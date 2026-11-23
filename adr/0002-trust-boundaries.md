# ADR 0002 — Assinatura, identidade e decisão do recebedor

**Status: aceita como diretriz do draft 0.1 (2026-11-23).**

## Decisão

Assinatura do criador significa controle da chave privada aplicada ao inventário específico. **CA/chaveiro atesta somente vínculo entre identidade cadastrada e chave pública, validade e revogação**, nunca estrutura, hash, assinatura particular, veracidade ou aprovação de pacote. Recebedor decide conferência, avaliação material, homologação, quarentena, publicação e eventual penalidade.

Não confundir integridade, autenticidade da assinatura, reconhecimento da chave, veracidade e admissibilidade. Recomendamos fortemente rejeição de inconsistências materiais e bloqueio de execução de integridade falha; sanções requerem política clara e evidências.
