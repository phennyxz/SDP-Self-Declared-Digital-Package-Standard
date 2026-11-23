import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const hash = b => createHash('sha256').update(b).digest('hex');
const manifest = readFileSync('examples/minimal/sdp.json');
const payload = readFileSync('examples/minimal/payload/mensagem.txt');
const files = [['payload/mensagem.txt',payload],['sdp.json',manifest]];
const integrity = Buffer.from(JSON.stringify({sdpVersion:'0.1',algorithm:'sha256',files:files.map(([path,b])=>({path,size:b.length,sha256:hash(b)}))},null,2)+'\n');
files.push(['integrity.json',integrity]);
const out=[]; const locals=[]; const central=[];
function push16(a,n){a.push(n&255,(n>>>8)&255)}
function push32(a,n){push16(a,n&65535);push16(a,n>>>16)}
function crc32(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
let offset=0;
for(const [path,b] of files){const name=Buffer.from(path);const crc=crc32(b);
const l=[];push32(l,0x04034b50);push16(l,20);push16(l,0x0800);push16(l,0);push16(l,0);push16(l,0);push32(l,crc);push32(l,b.length);push32(l,b.length);push16(l,name.length);push16(l,0);
locals.push(Buffer.from(l),name,b);
const c=[];push32(c,0x02014b50);push16(c,0x0314);push16(c,20);push16(c,0x0800);push16(c,0);push16(c,0);push16(c,0);push32(c,crc);push32(c,b.length);push32(c,b.length);push16(c,name.length);push16(c,0);push16(c,0);push16(c,0);push16(c,0);push32(c,0x81a40000);push32(c,offset);
central.push(Buffer.from(c),name);offset+=l.length+name.length+b.length;
}
const cen=Buffer.concat(central),end=[];push32(end,0x06054b50);push16(end,0);push16(end,0);push16(end,files.length);push16(end,files.length);push32(end,cen.length);push32(end,offset);push16(end,0);
const zip=Buffer.concat([...locals,cen,Buffer.from(end)]);writeFileSync('examples/minimal.sdp',zip);console.log('Generated examples/minimal.sdp ('+zip.length+' bytes)');
