# Verificação objetiva e modelo de ameaças

## Pipeline recomendado

1. **Quarentena de entrada:** tratar ZIP como hostil, aplicar tamanho máximo ao arquivo e não executar nada.
2. **Estrutura ZIP:** detectar truncamento, duplicatas, sobreposição de entradas, ZIP bombs, links especiais, traversal, encoding conflitante e arquivos criptografados não suportados.
3. **Manifesto:** JSON UTF-8 estrito, campos, tipos, versão, ausência de nomes duplicados e schema aplicável.
4. **Inventário:** entradas exatas, ordenação, tamanhos, hashes SHA-256 e arquivos completos.
5. **Assinatura:** parse e verificação Ed25519 sobre domínio + bytes originais; identificar chave pública por fonte de confiança escolhida.
6. **Chave:** consulta ao chaveiro/CA para status e vínculo identidade↔chave, quando exigido.
7. **Declarações:** confrontar finalidade, metadados, restrições, capacidades e afirmações materiais com evidência.
8. **Decisão:** aceitar, rejeitar, isolar, quarentenar, revisar e eventualmente homologar/publicar.

Uma etapa anterior válida **não autoriza** pular as posteriores.

## Ameaças e limites

- SHA-256 demonstra correspondência com o inventário; sem assinatura, um atacante pode substituir conteúdo e inventário conjuntamente.
- Ed25519 autentica uso de chave; não demonstra ausência de malware ou autorização legal.
- Um manifesto pode omitir requisitos, declarar conteúdo falsamente ou alegar identificação de terceiro.
- Uma chave pode estar comprometida, revogada ou expirada; rede, cache, rollback e indisponibilidade exigem política explícita.
- ZIP pode desencadear esgotamento de recursos, traversal, symlinks e inconsistências entre leitor e extrator.
- Conteúdo executável continua hostil mesmo após passar todas as verificações anteriores. Aplicar sandbox e mínimo privilégio.

## Validador de referência

`tools/verify-sdp.mjs` e seus testes auxiliam a verificar um **subconjunto local** do Core. Ferramentas não certificam veracidade, legislação, autoria civil ou ausência de conteúdo perigoso. Não confiar exclusivamente em um validador não endurecido para produção.
