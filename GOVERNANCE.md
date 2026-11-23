# Governança do padrão

**Estado:** projeto experimental comunitário. Nenhum documento deste repositório confere por si só reconhecimento internacional, registro IANA, exclusividade de extensão ou poder de certificação.

## Processo

1. Mudanças normativas devem vir por PR e explicitar motivação, compatibilidade, ameaças, testes e versão afetada.
2. Diferenciar **proposta**, **aprovado para o draft**, **implementado** e **testado**.
3. Alterações incompatíveis no formato ou bytes assinados exigem versão nova, vetores de teste e documentação de migração. Nunca reinterpretar `SDP-INTEGRITY-v1\n` silenciosamente.
4. Perfis especializados não podem tornar o núcleo dependente de COVIL, Jogai ou CA única.
5. Revisões editoriais e segurança devem considerar boa-fé, evidências, proporcionalidade e direito de contestação.
6. Normas de conformidade não dependem de uma ferramenta exclusiva; divergências entre validadores são bugs ou ambiguidades do contrato a resolver publicamente.

O maintainer decide o aceite de PRs; portadores decidem suas políticas de confiança e distribuição.
