# Modelo de confiança descentralizado

```text
  Criador ──declara──> Manifesto SDP
     │                     │
     └──assina inventário──┘
                    │
                    ▼
               Portador/host ── consulta opcional ──> CA/chaveiro
                    │                                  │
                    │                  identidade ↔ chave, estado, validade
                    │
                    ├─ confere estrutura e hashes
                    ├─ verifica assinatura com chave pública
                    ├─ confronta declarações
                    └─ decide aceitar/rejeitar/homologar/distribuir
```

## Fronteiras

**SDP:** formato e evidências. **Criador:** declaração e assinatura, quando houver. **CA:** exclusivamente vínculo entre identidade cadastrada e chave, estado e validade. **Recebedor:** avaliação de autenticidade, materialidade, segurança e autorização.

Nenhuma CA se torna obrigatória pelo formato. Metadados `creator` e `keyId` são pistas autodeclaradas, não fontes de confiança. Host COVIL e plataforma Jogai são implementações possíveis, não âncoras universais.

**Reconhecimento da chave não é reconhecimento de pacote**. A CA não afirma nada sobre o inventário, assinatura específica, hash, categoria, conteúdo, legalidade ou distribuição do SDP.

## Autenticidade versus confiança

`signature_valid` e `key_recognized` são resultados diferentes. Chaves válidas podem assinar conteúdo inadequado, e pacotes íntegros podem fazer alegações falsas. Política de admissão e homologação pertence sempre ao portador.
