# ADR 0001 — SDP como formato universal de autodeclaração

**Status: aceita como diretriz do draft 0.1 (2026-11-23).**

## Decisão

SDP significa **Self-Declared Digital Package Standard**. Um pacote não precisa ser jogo, software ou executável. O núcleo transporta autodeclarações do criador, arquivos, inventário criptográfico e assinatura opcional. O recebedor verifica o que considerar necessário e decide sobre admissão e confiança.

A sigla SDP já possui outros usos; `.sdp` é apenas uma extensão proposta, não registro exclusivo.

## Consequências

O protocolo COVIL vira perfil opcional. O VLG histórico não é magicamente compatível com SDP; migrar exige reconstrução do inventário e nova assinatura. Nenhuma CA ou ferramenta de conformidade é autoridade obrigatória do formato.
