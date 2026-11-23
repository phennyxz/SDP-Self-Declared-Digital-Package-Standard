# Assinatura, autoria e identidade

## Afirmação precisa

**Quem assina demonstra controle da chave privada que assinou os bytes exatos do inventário**. A assinatura não prova, sozinha, o nome civil do criador, a origem do conteúdo, a veracidade das afirmações nem o direito de distribuição.

### SDP Core 0.1

```text
message = ASCII("SDP-INTEGRITY-v1\n") || exactBytes(integrity.json)
signature = Ed25519.sign(privateKey, message)
```

`signature.json` guarda algoritmo, `keyId` e assinatura; não incorpora a chave privada. `keyId` é identificador da chave, não autoridade confiável. Para referência, sugerimos `ed25519-sha256:<64 hex>`, com SHA-256 da representação DER SubjectPublicKeyInfo pública (SPKI). O formato de `keyId` deve ser aplicado de modo idêntico por implementações. O verificador exige chave pública fornecida por fonte explicitamente confiável; jamais busca uma URL do manifesto e a aceita automaticamente.

Assinar o inventário significa, indiretamente, vincular os arquivos e **todas as declarações incluídas no manifesto**. O arquivo `signature.json` não é inventariado.

## CA/chaveiro

A CA/chaveiro fala **exclusivamente sobre pessoas/identidades cadastradas e chaves públicas**: titularidade declarada e verificada segundo sua política, prova de posse, estado válido/revogado, escopo e vigência. **Não fala sobre pacote, hash, estrutura, assinatura específica ou homologação**.

A consulta à CA é uma decisão do portador; o SDP não impõe fornecedor, infraestrutura, Google login, Firebase, host COVIL ou consulta online por abertura. Cache autenticado requer política de validade, revogação e proteção contra rollback.

## Estados distintos

| Estado | Afirmação |
|---|---|
| `structure_valid` | O arquivo respeita o contêiner e seu inventário |
| `signature_valid` | A assinatura corresponde à chave e aos bytes protegidos |
| `key_recognized` | Uma CA reconhece o vínculo chave↔identidade, válido no escopo consultado |
| `claims_reviewed` | O portador verificou afirmações por critérios próprios |
| `accepted` | O portador decidiu admitir o pacote |

**Nenhum desses estados é sinônimo dos demais.** Assinatura opcional em Core não é aprovação automática; a falta dela pode justificar rejeição por política do portador.
