# Conformidade e níveis de teste

O formato é aberto: qualquer entidade pode produzir validadores, ferramentas de build e suites próprias. **Não existe validador oficial obrigatório nem certificação central SDP.**

| Grupo | Verificação | Automação |
|---|---|---|
| S01 | ZIP reconhecido, entradas de arquivo suportadas | Automatizável |
| S02 | Caminhos seguros, duplicatas e links rejeitados | Automatizável |
| S03 | `sdp.json` completo, UTF-8 estrito, schema e versão | Automatizável |
| S04 | `integrity.json` completo e ordenado | Automatizável |
| S05 | SHA-256 e tamanhos de todos os arquivos | Automatizável |
| S06 | `signature.json` bem-formado, se presente | Automatizável |
| S07 | Assinatura Ed25519 com chave fornecida | Automatizável separadamente |
| S08 | Reconhecimento identidade↔chave na CA escolhida | Político/externo |
| S09 | Veracidade de declarações e licitude | Investigação do portador |
| S10 | Homologação, admissão, publicação e penalidade | Política do portador |
| Pxx | Campos e interfaces de um perfil | Suite do perfil |

O verificador de referência em `tools/verify-sdp.mjs` realiza verificações estruturais e pode comparar assinatura com chave pública explícita. Limites anti-bomba, verificações ZIP adversariais e segurança de produção exigem auditoria e testes independentes.

### Como executar

```bash
npm test
node tools/verify-sdp.mjs examples/minimal.sdp
node tools/verify-sdp.mjs examples/minimal.sdp --public-key caminho/para/public-key.pem
```

A extensão de arquivo e a existência de `keyId` não implicam confiança. Os testes do repositório não significam certificação legal/editorial.
