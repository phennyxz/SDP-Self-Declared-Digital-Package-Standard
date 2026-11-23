# Contribuindo com o SDP

Obrigado por considerar uma melhoria ao padrão. Prefira issues e PRs pequenas com motivação clara, exemplos, casos de conformidade positivos/negativos e consideração explícita de compatibilidade.

Para alterar o Core, atualize `spec/core-0.1.md`, schemas, exemplos, documentação e testes, sem depender de um runtime de jogos. Para perfis, documente requisitos específicos de seu ecossistema sem transformar a extensão em obrigação universal.

### Testes locais

```bash
npm test
npm run example
npm run verify:example
```

Mudanças de assinatura, domínio, serialização, paths, limites ou interpretação de hashes merecem revisão de segurança. Não afirme certificação, validação jurídica nem conformidade de produção com base apenas nos testes locais.
