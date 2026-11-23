# SDP Core 0.1 — contrato experimental

**Estado:** draft técnico, versão de schema `0.1`. Este documento é a referência proposta para conformidade estrutural do núcleo. Os requisitos MUST são normativos **dentro deste draft**, sem compromisso de compatibilidade eterna.

## 1. Objetivo e limites

SDP é um formato de **contêiner ZIP autocontido**, com manifesto autodeclarado, inventário de arquivos e assinatura opcional. O núcleo **não tem runtime, tipo de mídia, sistema operacional, perfil, loja, CA, execução ou licença obrigatórios**. O criador declara; o portador verifica.

## 2. Contêiner

- Extensão convencional proposta: `.sdp`; detecção **MUST** basear-se no conteúdo e no contrato, não apenas na extensão.
- Contêiner ZIP com entradas de arquivos regulares armazenadas ou comprimidas em DEFLATE. O perfil experimental de referência suporta métodos ZIP 0 (stored) e 8 (deflate).
- Na raiz, **MUST** conter exatamente `sdp.json` e `integrity.json`. `signature.json` é opcional. O restante pode ficar em caminhos relativos, inclusive arquivos adicionais na raiz.
- Paths de entrada **MUST** usar `/`, ser UTF-8 e relativos, sem barras invertidas, segmentos vazios, `.` ou `..`, drive letters, NUL, caminhos absolutos, duplicatas nem entrada de diretório artificial. **MUST NOT** conter links simbólicos ou entradas especiais no perfil Core 0.1. Verificadores não extraem conteúdo antes de validar.
- Os nomes dos três arquivos de controle são reservados apenas na raiz. A comparação de caminhos é **byte a byte após decodificação UTF-8 estrita**; colisões de normalização Unicode e de filesystem alvo são riscos adicionais a tratar pelo portador.
- Implementações **MUST** aplicar limites configuráveis de tamanho, entradas, profundidade, compressão e memória antes da extração. O padrão não estabelece cotas de hardware universais.

## 3. Manifesto `sdp.json`

Objeto JSON UTF-8 estrito, sem BOM, sem nomes de propriedades duplicados. Ver [schema](../schemas/sdp.schema.json). Campos obrigatórios:

| Campo | Tipo | Significado |
|---|---|---|
| `sdpVersion` | `"0.1"` | Versão do formato |
| `id` | string | Identificador autodeclarado, não reserva global |
| `name` | string | Nome exibido |
| `version` | string | Versão do objeto |
| `kind` | string | Natureza declarada; ex.: `game`, `application`, `dataset`, `document`, `asset` |
| `purpose` | string | Finalidade declarada, em linguagem humana |
| `creator` | objeto | Identidade autodeclarada: `id`, `name` e `keyId` opcional |
| `profiles` | array | Perfis de interoperabilidade declarados, opcional (default `[]`) |
| `requirements` | objeto | Requisitos próprios da aplicação; opcional e **não são concessões** |

Campos adicionais opcionais: `description`, `metadata` (objeto JSON para afirmações específicas), `license`, `homepage`. O manifesto não precisa de `entry`. Cada perfil pode definir seu próprio contrato em `profiles[].config`.

`creator.id` é um identificador **declarado pelo próprio criador**. Uma CA pode relacionar esse ID a uma chave, sem necessariamente verificar identidade civil. O manifesto sozinho não estabelece esse vínculo. `keyId`, quando presente, deve corresponder ao identificado no envelope de assinatura, mas não substitui verificação criptográfica.

`profiles` é uma lista de objetos com `id`, `version` e `config`. Perfis desconhecidos **não tornam o contêiner estruturalmente inválido**; podem torná-lo incompatível com determinado recebedor.

## 4. Inventário `integrity.json`

Objeto com `sdpVersion:"0.1"`, `algorithm:"sha256"`, e `files`: array de objetos `{path,size,sha256}`. A lista **MUST** incluir **todos os arquivos regulares do ZIP**, incluindo `sdp.json`, exceto `integrity.json` e `signature.json` (para evitar autorreferência). O array **MUST** ser ordenado por ordem lexicográfica de bytes UTF-8 do path, sem duplicatas. Cada `size` é a quantidade de bytes **descomprimidos**; o SHA-256 é lowercase hexadecimal de 64 posições calculado sobre os bytes descomprimidos.

Arquivos extras, faltantes, tipos não suportados, tamanho ou hash divergente tornam o pacote **estruturalmente inválido**. O inventário **não é** um mecanismo de resolução de módulos, execução ou autorização.

## 5. Assinatura opcional `signature.json`

A assinatura é **Ed25519** sobre a concatenação dos bytes ASCII exatos `SDP-INTEGRITY-v1\n` com os bytes exatos de `integrity.json` distribuídos no arquivo. Não reserializar JSON no processo de assinatura/verificação. O envelope declara `sdpVersion`, `algorithm:"Ed25519"`, `keyId` e `signature` (base64url sem padding, 64 bytes decodificados).

A assinatura relaciona a chave privada usada ao inventário exato, que vincula os arquivos. Não certifica identidade civil, boa-fé, veracidade, licitude, segurança ou homologação. A versão `SDP-INTEGRITY-v1\n` é **distinta** do prefixo legado `COVIL-VLG-INTEGRITY-v1\n`; não trocar os domínios durante migração de arquivo legado sem nova assinatura.

Um SDP sem `signature.json` **pode ser estruturalmente válido**. O portador decide se o aceita. Um pacote com `signature.json` malformado não é estruturalmente conforme; a verificação criptográfica da assinatura é etapa distinta.

## 6. Níveis de avaliação

1. **Estrutura:** ZIP, JSON e schemas, inventário, hashes, limites e regras de path.
2. **Assinatura:** correspondência criptográfica entre assinatura, bytes protegidos e chave pública fornecida.
3. **Reconhecimento da chave:** vínculo identidade↔chave e estado atestados pela CA/chaveiro escolhidos.
4. **Veracidade/materialidade:** avaliação independente das declarações pelo portador.
5. **Política:** admissibilidade, execução, homologação, quarentena, distribuição e sanções do recebedor.

Nenhum nível implica aprovação automática dos demais.

## 7. Conformidade e compatibilidade

Uma implementação conforme deve aceitar pacotes Core válidos e rejeitar pacotes Core inválidos sob os limites declarados. Não é obrigada a interpretar todos os perfis ou executar conteúdo. Perfis podem acrescentar campos/regras de conteúdo, **sem enfraquecer** exigências de integridade. O portador pode ter política mais restritiva que o padrão.

Ver [matriz de testes](../conformance/README.md), [assinaturas](signatures.md), [ameaças](../docs/02-verification.md) e [exemplos](../examples/README.md).
