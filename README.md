# SDP — Self-Declared Digital Package Standard

**Um pacote declara. Seu criador assume a declaração. O recebedor verifica e decide.**

O **SDP** é uma proposta de padrão aberto para empacotar conteúdo digital de qualquer natureza com **autodescrição, inventário verificável e assinatura opcional**. Seu objetivo é permitir que o autor declare **o que entrega, para que serve e a quem atribui sua autoria**, e que o portador avalie essas afirmações sem depender de uma plataforma, autoridade certificadora ou runtime central.

> **Estado: SDP Core 0.1 — draft experimental.** Esta versão estabelece uma base coerente de referência, não uma certificação de segurança, homologação ou registro oficial de extensão/MIME. O uso de `.sdp` é proposto; a sigla **SDP** já designa *Session Description Protocol* em outro contexto. Não presumir exclusividade.

## Por que existe?

Um arquivo digital normalmente carrega conteúdo; seu contexto, requisitos, responsabilidade e verificações ficam dispersos em catálogos, servidores ou convenções privadas. O SDP propõe um envelope **autodeclarado**, portátil e inspecionável por qualquer recebedor.

| Pergunta | Resposta do pacote | Limite |
|---|---|---|
| **O que é?** | `kind`, nome, versão, descrição, inventário | Declarar não comprova veracidade |
| **Para que serve?** | `purpose`, `profiles`, `requirements` | Requisitos não concedem permissões |
| **De quem é?** | `creator` declarado e assinatura opcional | Assinatura prova vínculo com chave, não identidade por si |
| **Foi alterado?** | Hash SHA-256 de cada entrada | Hash não prova segurança, qualidade ou licitude |
| **Posso aceitar?** | **Decisão exclusiva do recebedor** | O SDP não homologa nem autoriza distribuição |

### Onde se aplica?

Um SDP pode transportar **jogos, aplicativos, plugins, bibliotecas, documentos, datasets, assets, coleções de mídia ou conteúdo sem código executável**. Perfis específicos acrescentam contratos sem tornar suas regras universais.

```text
                    SDP — formato base independente
                    ├─ manifesto e autodeclaração
                    ├─ inventário SHA-256
                    ├─ assinatura opcional de autoria
                    └─ arquivos, sem execução obrigatória
                         │
          ┌──────────────┼─────────────────┐
          ▼              ▼                 ▼
     Perfil COVIL   Perfil de dados   Outros perfis
     interface de   conteúdo não     software, mídias,
     execução       executável       plugins, arquivos
          │
     Host COVIL / Jogai / terceiros, cada um com sua política
```

## Comece aqui

| Público | Leitura recomendada |
|---|---|
| Quero entender a filosofia | [Princípios e limites](docs/01-principles.md) |
| Vou criar um pacote | [Especificação SDP Core 0.1](spec/core-0.1.md), [exemplos](examples/README.md) |
| Vou construir um verificador | [Verificação e ameaças](docs/02-verification.md), [schemas](schemas/), [conformidade](conformance/README.md) |
| Tenho uma chave/CA | [Assinatura e identidade](spec/signatures.md), [fronteiras de confiança](docs/03-trust-model.md) |
| Vou consumir ou distribuir | [Política do portador e incidentes](docs/04-recipient-policy.md) |
| Vou integrar um jogo com COVIL | [Perfil COVIL](profiles/covil/README.md) |
| Vim do VLG | [Compatibilidade e migração](docs/05-vlg-migration.md) |
| Quero contribuir | [Governança](GOVERNANCE.md), [contribuição](CONTRIBUTING.md), [decisões](adr/) |

## A promessa — e os limites

O SDP **padroniza declarações e evidências verificáveis**, não a verdade delas. A assinatura autentica uma chave sobre os bytes protegidos; uma CA/chaveiro pode afirmar se a chave está vinculada a certa identidade e se está válida, **sem conhecer ou certificar pacotes**. O portador valida formato, hashes e assinatura, investiga afirmações materiais, estabelece requisitos, decide homologação, execução, publicação, quarentena ou rejeição.

**Recomendação forte:** rejeitar pacotes discrepantes, bloquear execução de pacotes com falhas de integridade e manter políticas de isolamento, auditoria e resposta proporcional a reincidência comprovada. O padrão não confere poderes de punição automáticos a qualquer entidade.

## Estrutura mínima ilustrativa

```text
exemplo.sdp  (arquivo ZIP)
├── sdp.json          # manifesto de autodeclaração
├── integrity.json    # inventário verificável
├── signature.json    # opcional: assinatura Ed25519 do inventário
└── payload/
    └── qualquer-conteudo.bin
```

O conteúdo pode ser aninhado e **não precisa ser executável**. Os schemas e exemplos deste repositório descrevem o contrato experimental; qualquer implementação independente pode verificar conformidade. A documentação sobre COVIL não altera os critérios básicos do SDP.

## Estado de entrega

**Presente:** especificação experimental do núcleo, contratos de assinatura e confiança, schemas JSON, exemplos, verificador de referência em Node.js, casos de teste e documentação do perfil COVIL.

**Não prometido:** registro oficial da extensão `.sdp`, validação substantiva de conteúdo, CA embutida, defesa absoluta contra ZIP hostil, verificação de segurança de código, homologação, host seguro de navegador ou implementação completa de SDK COVIL.

Este é um padrão comunitário em desenvolvimento. Termos **MUST/SHOULD/MAY** são requisitos **do perfil experimental 0.1**, não declarações de certificação formal.
