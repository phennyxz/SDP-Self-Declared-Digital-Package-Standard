# Perfis SDP

O **núcleo SDP** independe do conteúdo transportado. Um **perfil** é um contrato adicional sobre significado, requisitos, organização interna e interfaces de consumo. Perfis desconhecidos não invalidam a estrutura base, mas podem ser recusados por incompatibilidade com o portador.

Todo perfil deve declarar ID, versão, propriedades exigidas, semântica, modelo de ameaças, exemplos positivos/negativos e testes de conformidade próprios. Perfis **MUST NOT** relativizar o inventário, substituir a assinatura SDP ou atribuir poderes de homologação à CA.

## Perfis exemplares

- [COVIL — jogos e runtime](covil/README.md): contrato de interoperabilidade independente do formato; adaptável a SDP.
- [Dataset — conteúdo não executável](dataset/README.md): exemplo de perfil de dados estáticos, ainda não normativo.

O SDP não exige que qualquer um desses perfis esteja presente.
