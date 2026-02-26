import type { Command, ServerMessage, StateMessage, Player } from './types';
import { hashState } from './types';
import { createInitialState, applyCommand } from './game';

const gameState = createInitialState();
const clients = new Map<any, Player>();
let version = 0;

function createPlayer(): Player {
    const id = Math.floor(Math.random() * 1000000000);
    return { id, name: `user-${id.toString().slice(0, 4)}` };
}

function broadcastCommand(command: Command, sender: any): void {
    const message: ServerMessage = { type: 'command', command };
    const json = JSON.stringify(message);
    for (const [client] of clients) {
        if (client !== sender) {
            client.send(json);
        }
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

        const file = Bun.file(import.meta.dir + path);
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
            const message: StateMessage = { type: 'state', state: gameState, playerId: player.id };
            ws.send(JSON.stringify(message));
        },
        message(ws, message) {
            try {
                const command: Command = JSON.parse(message as string);
                console.log(`Received command:`, command);
                command.version = ++version;
                applyCommand(gameState, command);
                command.stateHash = hashState(gameState);
                broadcastCommand(command, ws);
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

console.log(`Demo 2 running at http://localhost:${server.port}`);
