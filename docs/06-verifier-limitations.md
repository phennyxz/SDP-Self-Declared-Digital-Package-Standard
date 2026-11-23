# Limites do verificador experimental

O script `tools/verify-sdp.mjs` demonstra leitura ZIP e conferência de inventário, hashes e assinatura com chave fornecida explicitamente. **Não é um leitor ZIP de produção** e não certifica conformidade completa ao Core.

## Diferenças conhecidas em relação ao Core 0.1

- JSON.parse de Node rejeita JSON inválido, porém não rejeita nomes de propriedades duplicados: o draft exige essa rejeição, que ainda requer parser próprio/testes.
- O verificador valida campos centrais manualmente, mas não executa JSON Schema Draft 2020-12 em todas as ramificações (por exemplo, `uniqueItems`, `format` e `metadata` arbitrário).
- O processamento ZIP limita quantidade/tamanho e rejeita alguns recursos arriscados; requer fuzzing, testes de extração cruzada, checagens profundas de ZIP64, comentários, entradas sobrepostas, flags e casos adversariais.
- `--public-key` verifica criptograficamente com a chave PEM explícita; não consulta CA nem estabelece identidade.
- Resultados de teste demonstram casos cobertos, **não** ausência de vulnerabilidades nem conformidade de produção.

Qualquer host que admita uploads de terceiros deve utilizar uma biblioteca ZIP endurecida e aplicar políticas adicionais de limites, sandbox, identidade e revisão material.
