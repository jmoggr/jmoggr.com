import type { GameState, Command, ServerMessage, Player, Cell } from '../shared/types';
import { GRID_SIZE, hashState } from '../shared/types';

function createInitialState(): GameState {
    const grid: Cell[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        grid[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            grid[y][x] = { color: '#ffffff', playerId: null };
        }
    }
    return { grid, gridSize: GRID_SIZE, players: {} };
}

function applyCommand(state: GameState, command: Command): void {
    if (command.type === 'setColor') {
        state.grid[command.y][command.x] = { color: command.color, playerId: command.playerId };
    } else if (command.type === 'setName') {
        if (state.players[command.playerId]) {
            state.players[command.playerId].name = command.name;
        }
    }
}

function createPlayer(): Player {
    const id = Math.floor(Math.random() * 1000000000);
    return { id, name: `user-${id.toString().slice(0, 4)}` };
}

const gameState = createInitialState();
const clients = new Map<any, Player>();
let version = 0;

function broadcastState(): void {
    for (const [client, player] of clients) {
        const message: ServerMessage = { type: 'state', state: gameState, playerId: player.id };
        client.send(JSON.stringify(message));
    }
}

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
};

const server = Bun.serve({
    port: 8080,
    async fetch(req, server) {
        const url = new URL(req.url);

        if (url.pathname === '/ws') {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("WebSocket upgrade failed", { status: 400 });
        }

        const path = url.pathname === '/' ? '/index.html' : url.pathname;
        const ext = path.substring(path.lastIndexOf('.'));
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const file = Bun.file(import.meta.dir + '/..' + path);
        if (await file.exists()) {
            return new Response(file, { headers: { 'Content-Type': contentType } });
        }
        return new Response("Not found", { status: 404 });
    },
    websocket: {
        open(ws) {
            console.log("Client connected");
            const player = createPlayer();
            clients.set(ws, player);
            gameState.players[player.id] = player;
            const message: ServerMessage = { type: 'state', state: gameState, playerId: player.id };
            ws.send(JSON.stringify(message));
        },
        message(ws, message) {
            try {
                const command: Command = JSON.parse(message as string);
                const player = clients.get(ws);
                const username = player?.name || 'unknown';
                console.log(`[${username}] ${command.type}`);
                command.version = ++version;
                applyCommand(gameState, command);
                command.stateHash = hashState(gameState);
                broadcastState();
            } catch (e) {
                console.error('Invalid message:', e);
            }
        },
        close(ws) {
            console.log("Client disconnected");
            const player = clients.get(ws);
            if (player) {
                delete gameState.players[player.id];
                clients.delete(ws);
            }
        },
    },
});

console.log(`Demo 1 running at http://localhost:${server.port}`);
