# Introduction to Multiplayer Networking

**[live website](https://jmoggr.com/talks/introduction-to-multiplayer-networking/)**

An introduction to multiplayer networking

## Demos

```
demos/
├── demo1/              # full state snapshot
├── demo2/              # optimistic updates, with de-sync
└── demo3/              # optimistic updates, no de-sync
```

### Building and Running

From the demos folder:

```bash
bun build client.ts --outfile client.js --target browser
bun run server.ts
```

Then open http://localhost:8080 in your browser.
