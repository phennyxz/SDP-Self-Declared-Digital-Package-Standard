import { readFileSync } from 'node:fs';
import { createHash, createPublicKey, verify as verifySignature } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
const fail = m => { throw Error(m); };
const utf8 = new TextDecoder('utf-8', { fatal: true });
const strictJSON = raw => {
  // Draft validator deliberately has no duplicate-member JSON parser.
  // Producers MUST not create duplicate keys; production verifiers MUST reject them.
  return JSON.parse(utf8.decode(raw));
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const crc32 = bytes => { let c=0xffffffff; for (const b of bytes) { c ^= b; for (let n=0;n<8;n++) c=(c>>>1)^((c&1)?0xedb88320:0); } return (c^0xffffffff)>>>0; };
const ascii = b => Buffer.from(b, 'ascii');
const secureName = s => typeof s === 'string' && !!s && !s.includes('\\') && !s.includes('\\0') &&
  !s.startsWith('/') && !s.includes(':') && !s.split('/').some(x => !x || x === '.' || x === '..');
const exact = (obj, required, allowed = required) => obj && typeof obj === 'object' && !Array.isArray(obj) &&
  required.every(k => Object.hasOwn(obj, k)) && Object.keys(obj).every(k => allowed.includes(k));
function entries(zip) {
  const out = new Map();
  const spans = [];
  // Locate end-of-central-directory (EOCD) within max comment length.
  let end = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) {
    if (zip.readUInt32LE(i) === 0x06054b50 && i + 22 + zip.readUInt16LE(i + 20) === zip.length) { end = i; break; }
  }
  if (end < 0) fail('ZIP EOCD missing');
  if (zip.readUInt16LE(end + 4) || zip.readUInt16LE(end + 6)) fail('Multi-disk ZIP unsupported');
  const count = zip.readUInt16LE(end + 10), size = zip.readUInt32LE(end + 12), offset = zip.readUInt32LE(end + 16);
  if (count > 10000 || size > 8 * 1024 * 1024 || offset + size > end) fail('ZIP index limits');
  let p = offset, budget = 256 * 1024 * 1024;
  for (let n = 0; n < count; n++) {
    if (p + 46 > end || zip.readUInt32LE(p) !== 0x02014b50) fail('Invalid central directory');
    const flags = zip.readUInt16LE(p + 8), method = zip.readUInt16LE(p + 10);
    const expectedCrc = zip.readUInt32LE(p + 16);
    const csize = zip.readUInt32LE(p + 20), usize = zip.readUInt32LE(p + 24);
    const nameLen = zip.readUInt16LE(p + 28), extra = zip.readUInt16LE(p + 30), comment = zip.readUInt16LE(p + 32);
    const external = zip.readUInt32LE(p + 38), local = zip.readUInt32LE(p + 42);
    if (p + 46 + nameLen + extra + comment > end) fail('Invalid entry length');
    const name = utf8.decode(zip.subarray(p + 46, p + 46 + nameLen));
    if (!secureName(name) || out.has(name) || name.endsWith('/')) fail('Unsafe or duplicate path');
    if ((flags & ~0x808) !== 0 || !(flags & 0x800) || ![0,8].includes(method)) fail('Unsupported ZIP flags, encryption or method');
    const unixMode = external >>> 16;
    if ((unixMode & 0xf000) && (unixMode & 0xf000) !== 0x8000) fail('ZIP special file unsupported');
    if (usize > 64 * 1024 * 1024 || usize > budget || csize > 64 * 1024 * 1024) fail('Entry size limit');
    budget -= usize;
    if (local + 30 > offset || zip.readUInt32LE(local) !== 0x04034b50) fail('Invalid local header');
    const lflags = zip.readUInt16LE(local + 6), lm = zip.readUInt16LE(local + 8);
    const lname = zip.readUInt16LE(local + 26), lextra = zip.readUInt16LE(local + 28);
    if (lflags !== flags || lm !== method || lname !== nameLen) fail('Header mismatch');
    if (!zip.subarray(local + 30, local + 30 + lname).equals(zip.subarray(p + 46, p + 46 + nameLen))) fail('Local name mismatch');
    const dataStart = local + 30 + lname + lextra;
    if (dataStart + csize > offset) fail('Entry overlaps ZIP index');
    for (const [start, finish] of spans) if (local < finish && dataStart + csize > start) fail('Overlapping ZIP entries');
    spans.push([local, dataStart + csize]);
    const packed = zip.subarray(dataStart, dataStart + csize);
    let bytes;
    if (method === 0) bytes = packed;
    else bytes = inflateRawSync(packed, { maxOutputLength: usize + 1 });
    if (bytes.length !== usize) fail('ZIP decompressed size mismatch');
    if (crc32(bytes) !== expectedCrc) fail('ZIP CRC mismatch');
    out.set(name, bytes);
    p += 46 + nameLen + extra + comment;
  }
  if (p !== offset + size) fail('Central directory size mismatch');
  return out;
}
function checkSchemaManifest(m) {
  if (!exact(m,['sdpVersion','id','name','version','kind','purpose','creator'],['sdpVersion','id','name','version','kind','purpose','creator','description','profiles','requirements','metadata','license','homepage']) || m.sdpVersion !== '0.1') fail('Invalid manifest structure');
  const text = (s,max) => typeof s === 'string' && s.length > 0 && s.length <= max;
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)+$/.test(m.id) || m.id.length > 160 || !text(m.name,160) || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(m.version) || !/^[a-z][a-z0-9_-]*$/.test(m.kind) || m.kind.length > 64 || !text(m.purpose,2000)) fail('Invalid manifest fields');
  if (!exact(m.creator,['id','name'],['id','name','keyId']) || !text(m.creator.id,160) || !text(m.creator.name,160)) fail('Invalid creator');
  if (m.creator.keyId !== undefined && !/^ed25519-sha256:[0-9a-f]{64}$/.test(m.creator.keyId)) fail('Invalid creator key id');
  if (m.description !== undefined && (typeof m.description !== 'string' || m.description.length > 4000)) fail('Invalid description');
  if (m.license !== undefined && (typeof m.license !== 'string' || m.license.length > 200)) fail('Invalid license');
  if (m.homepage !== undefined && (typeof m.homepage !== 'string' || m.homepage.length > 2000 || !/^https?:\/\//.test(m.homepage))) fail('Invalid homepage');
  for (const k of ['requirements','metadata']) if (m[k] !== undefined && (!m[k] || typeof m[k] !== 'object' || Array.isArray(m[k]))) fail('Invalid '+k);
  if (m.profiles !== undefined) {
    if (!Array.isArray(m.profiles)) fail('Invalid profiles');
    for (const p of m.profiles) if (!exact(p,['id','version','config']) || !/^[a-z0-9]+(?:[._-][a-z0-9]+)+$/.test(p.id) || p.id.length > 160 || !/^\d+\.\d+(?:\.\d+)?$/.test(p.version) || !p.config || Array.isArray(p.config) || typeof p.config !== 'object') fail('Invalid profile');
  }
}
export function verifySDP(zipBytes, keyPem) {
  if (!Buffer.isBuffer(zipBytes)) zipBytes = Buffer.from(zipBytes);
  if (zipBytes.length > 128 * 1024 * 1024) fail('ZIP too large');
  const fs = entries(zipBytes);
  if (!fs.has('sdp.json') || !fs.has('integrity.json')) fail('Missing SDP control files');
  const manifest = strictJSON(fs.get('sdp.json')); checkSchemaManifest(manifest);
  const inv = strictJSON(fs.get('integrity.json'));
  if (!exact(inv,['sdpVersion','algorithm','files']) || inv.sdpVersion !== '0.1' || inv.algorithm !== 'sha256' || !Array.isArray(inv.files)) fail('Invalid integrity inventory');
  const listed = [...fs.keys()].filter(s => !['integrity.json','signature.json'].includes(s)).sort((a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b)));
  if (inv.files.length !== listed.length) fail('Inventory entry count mismatch');
  inv.files.forEach((item,i) => {
    if (!exact(item,['path','size','sha256']) || item.path !== listed[i] || !Number.isSafeInteger(item.size) || item.size < 0 || !/^[a-f0-9]{64}$/.test(item.sha256)) fail('Invalid inventory item');
    const b = fs.get(item.path);
    if (b.length !== item.size || hash(b) !== item.sha256) fail('Hash or size mismatch: ' + item.path);
  });
  let signature = 'absent';
  if (fs.has('signature.json')) {
    const s = strictJSON(fs.get('signature.json'));
    if (!exact(s,['sdpVersion','algorithm','keyId','signature']) || s.sdpVersion !== '0.1' || s.algorithm !== 'Ed25519' || !/^ed25519-sha256:[0-9a-f]{64}$/.test(s.keyId) || !/^[A-Za-z0-9_-]{86}$/.test(s.signature)) fail('Invalid signature envelope');
    if (manifest.creator.keyId && manifest.creator.keyId !== s.keyId) fail('Creator key mismatch');
    signature = 'unverified';
    if (keyPem) {
      const pub = createPublicKey(keyPem);
      const digest = hash(pub.export({ type: 'spki', format: 'der' }));
      if ('ed25519-sha256:' + digest !== s.keyId) fail('Public key identifier mismatch');
      const message = Buffer.concat([ascii('SDP-INTEGRITY-v1\n'), fs.get('integrity.json')]);
      const signatureBytes = Buffer.from(s.signature, 'base64url');
      if (signatureBytes.length !== 64 || !verifySignature(null,message,pub,signatureBytes)) fail('Invalid Ed25519 signature');
      signature = 'valid';
    }
  }
  return { structure: 'valid', signature, id: manifest.id, kind: manifest.kind, fileCount: listed.length, note: 'Material claims and identity are not verified' };
}
if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  try { const file = process.argv[2]; if (!file) fail('Usage: node tools/verify-sdp.mjs FILE.sdp [--public-key PUB.pem]');
    const ki = process.argv.indexOf('--public-key'); const key = ki >= 0 ? readFileSync(process.argv[ki + 1], 'utf8') : undefined;
    console.log(JSON.stringify(verifySDP(readFileSync(file),key),null,2));
  } catch(e) { console.error('SDP INVALID:',e.message); process.exitCode=1; }
}
