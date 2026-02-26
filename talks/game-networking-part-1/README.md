# Game Networking Part 1

An introduction to game networking concepts with interactive demos.

## Structure

```
├── slides/          # Marp presentation
│   ├── slides.md    # Source
│   └── dist/        # Built output
├── demos/
│   ├── demo1/       # Basic WebSocket connection
│   ├── demo2/       # Placeholder
│   └── demo3/       # Placeholder
```

## Building

### Slides

```bash
cd slides
pnpm install
pnpm build
```

### Demos

Build all demo client.js files:

```bash
for demo in demo1 demo2 demo3; do
  bun build demos/$demo/client.ts --outfile demos/$demo/client.js --format=iife
done
```

Or build a single demo:

```bash
bun build demos/demo1/client.ts --outfile demos/demo1/client.js --format=iife
```

## Running Demos

Each demo has a WebSocket server and client.

1. Start the server:
   ```bash
   bun demos/demo1/server.ts
   ```

2. Open the client in a browser:
   - **Standalone:** Open `demos/demo1/index.html` directly (file:// works)
   - **Via dev server:** http://localhost:3000/talks/game-networking-part-1/demos/demo1/

3. Click "Connect" to establish WebSocket connection, then "Send Message" to test.
