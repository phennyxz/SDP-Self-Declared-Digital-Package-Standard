# Origem e migração: VLG / COVIL → SDP

O SDP deriva de decisões experimentais sobre o **VLG — Virtual Light Game** e sua execução por ambientes **COVIL**. Ao ampliar o escopo, o pacote deixou de ser exclusivamente de jogos: aplicativos, dados, documentos e recursos não executáveis passam a ser cidadãos de primeira classe.

## Compatibilidade honesta

**SDP Core 0.1 é um contrato novo**, não uma renomeação de ZIP VLG. Um VLG histórico tem `manifest.json`, `integrity.json`, `signature.json` (opcional) e exigências de jogo Web; assinatura histórica usa `COVIL-VLG-INTEGRITY-v1\n`. O novo SDP usa `sdp.json`, campos universais e domínio `SDP-INTEGRITY-v1\n`. **Não renomeie um VLG para `.sdp` afirmando conformidade**. Qualquer conversor deve construir manifesto/inventário novos, preservar rastreabilidade e solicitar **nova assinatura**.

## Divisão durável

- **SDP:** descreve, inventaria e transporta qualquer conteúdo.
- **Perfil COVIL:** declara a compatibilidade e as interfaces de inicialização, eventos, controles, capacidades e ciclo de vida de um jogo. O runtime pode consumir ou não SDP.
- **CA/chaveiro:** associa identidade↔chave, não reconhece pacotes.
- **Host/plataforma:** verifica e decide admissão, homologação, distribuição e execução.

## Plano de adoção gradual

1. Publicar o draft SDP sem quebrar repositórios existentes.
2. Documentar conversão VLG→SDP com assinatura nova e metadados explícitos.
3. Implementar validador e vetores de teste para SDP, preservando o VLG legado.
4. Desenvolver adaptador SDP→COVIL como ferramenta opcional, não como parte obrigatória do Core.
5. Só declarar compatibilidade Jogai/COVIL após testes reais, incluindo caso assinado e host isolado.

Referência histórica: [COVIL Game Spec](https://github.com/phennyxz/covil-game-spec). O repositório antigo não foi substituído nem automaticamente migrado.
