# Exemplos SDP

A pasta `examples/` contém **fontes editáveis** e o pacote ilustrativo `minimal.sdp`, produzido a partir de `examples/minimal/`. O conteúdo não executável prova que o SDP não se limita a jogos.

```text
examples/minimal/
├── sdp.json
└── payload/
    └── mensagem.txt
```

Use `node tools/build-example.mjs` para gerar `examples/minimal.sdp` com inventário correto. Depois rode `node tools/verify-sdp.mjs examples/minimal.sdp`. O exemplo não é assinado nem homologado.

Um pacote de jogo pode declarar o perfil `org.covil.runtime` com `entry`, `actions` e capacidades; um dataset ou documento não precisa de `entry`.
