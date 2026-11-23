# Perfil SDP-COVIL — interoperabilidade com hosts de jogos

**Integração VLG:** o formato de jogo **VLG** permanece no repositório [covil-game-spec](https://github.com/phennyxz/covil-game-spec). VLG é a especialização ZIP do SDP para jogos: usa o núcleo genérico de manifesto/inventário/assinatura e acrescenta `manifest.json` de jogo e o perfil `org.covil.runtime`. O VLG legado 0.1 continua distinto e não é SDP-compatible por simples renomeação. A variante experimental está em [PR #3](https://github.com/phennyxz/covil-game-spec/pull/3), ainda sem merge nem verificação de assinatura.


**Estado:** perfil de integração experimental. O protocolo COVIL é **independente do SDP**: um jogo COVIL pode chegar por outras vias e um SDP pode conter dados sem código executável.

O SDP declara um objeto `profiles[]` com `id:"org.covil.runtime"`, `version:"0.1"` e `config` específico, por exemplo:

```json
{
  "id": "org.covil.runtime",
  "version": "0.1",
  "config": {
    "entry": "payload/index.html",
    "requiredCapabilities": [],
    "optionalCapabilities": [],
    "actions": ["left", "right", "jump"]
  }
}
```

O **entry** aponta para um arquivo inventariado e não se torna requisito universal SDP. O host verifica suas capacidades, define sandbox e permissões e só então inicializa o jogo.

## Contrato de interface COVIL (histórico experimental 0.1)

1. O host cria contexto isolado e canal privado `MessageChannel` com sessão opaca.
2. `host.init` informa protocolo, viewport, ações e capacidades efetivamente concedidas.
3. SDK chama `async init(covil)`, então sinaliza `game.ready` ou `game.error`.
4. O host envia `host.start`; somente então começa a simulação.
5. Controles: `covil.controls.on(action, callback)`; capacidades: `covil.has(id)`; ciclo de vida: `covil.lifecycle.on(event, callback)`.
6. `host.pause`, `host.resume`, `host.stop` controlam execução. O host pode encerrar unilateralmente.
7. **`reset` é extensão proposta, ainda não implementada no SDK anterior:** reinicia a partida sem recriar sessão ou invocar `init` novamente, preservando a autoridade do host.

```js
async function init(covil) {
  covil.controls.on("left", pressed => { /* controle lógico */ });
  covil.lifecycle.on("start", () => { /* simulação */ });
  covil.lifecycle.on("pause", () => { /* suspender simulação */ });
  covil.lifecycle.on("resume", () => { /* continuar simulação */ });
  covil.lifecycle.on("stop", () => { /* limpar recursos */ });
  // Proposta futura: covil.lifecycle.on("reset", resetGame)
}
```

`covil.request`, RPCs privilegiados e SDK completo não estão padronizados/implementados por este perfil. `host.init` não autentica o pacote e `game.ready` não comprova segurança. O host valida mensagens, origem, sessão, limites, estado e capacidades e controla isolamento, CSP, rede e permissões.

### Referências

[COVIL Game Specification](https://github.com/phennyxz/covil-game-spec) mantém documentação e protótipo anteriores. Este perfil não reimplementa o SDK nem afirma que Jogai executa SDP atualmente.
