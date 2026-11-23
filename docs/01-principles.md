# Princípios do SDP

## Uma declaração de boa-fé, não um selo de verdade

Um pacote SDP é a **autoidentificação de seu criador**: uma declaração rastreável do que entrega, para que serve e a quem atribui sua autoria. O padrão não exige que o conteúdo seja código, jogo ou executável. Não presume que toda declaração seja verdadeira; cria condições para verificações independentes.

**Princípio orientador:** *com grandes poderes vêm grandes responsabilidades*. Quem publica responde por suas próprias declarações; quem recebe deve confrontar evidências e aplicar critérios adequados aos riscos, sem transferir sua responsabilidade ao formato ou à CA.

## Propriedades

- **Portabilidade:** contêiner legível por implementações independentes, sem garantir compatibilidade com todo host.
- **Autodeclaração:** autor define identidade declarada, tipo, propósito e requisitos, sob sua responsabilidade.
- **Verificabilidade:** hashes de todos os arquivos, assinatura opcional e resultados reproduzíveis.
- **Neutralidade:** SDP não favorece COVIL, Jogai, vendedor, fabricante, perfil, empresa ou CA.
- **Extensibilidade disciplinada:** perfis têm contratos próprios e não mudam o núcleo silenciosamente.
- **Rejeição segura:** arquivos malformados devem ser recusados antes de execução ou extração imprudente.
- **Transparência:** diferenciar conforme, assinado, reconhecido, avaliado e aceito.
- **Interoperabilidade:** implementações de terceiros podem testar conformidade sem autorização prévia.

## Não objetivos

SDP não é antivírus, prova de licitude, homologador, repositório de confiança central, DRM, sistema universal de identidade, formato de código executável, mecanismo de atualização ou gerenciador de pacotes. Esses sistemas podem consumir SDP sem alterar seu significado.

## Linguagem normativa

MUST / MUST NOT: requisito do **draft Core 0.1**. SHOULD / SHOULD NOT: recomendação forte sujeita a justificativa. MAY: possibilidade. Divergências de conteúdo podem demandar investigação; uma mera imprecisão subjetiva não prova dolo.
