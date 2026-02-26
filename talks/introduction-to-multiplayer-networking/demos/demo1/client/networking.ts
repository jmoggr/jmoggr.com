import type { GameState, Command, ServerMessage } from '../shared/types';

export type StateCallback = (state: GameState, playerId: number) => void;

let ws: WebSocket | null = null;
let onStateUpdate: StateCallback | null = null;
let simulatedLatency = 0;
let currentPlayerName = '';

export function setPlayerName(name: string): void {
    currentPlayerName = name;
}

export function setLatency(ms: number): void {
    simulatedLatency = ms;
}

function getWebSocketUrl(): string {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'ws://localhost:8080/ws';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
}

export function connect(callback: StateCallback): void {
    onStateUpdate = callback;
    ws = new WebSocket(getWebSocketUrl());

    ws.onmessage = (event) => {
        setTimeout(() => {
            const message: ServerMessage = JSON.parse(event.data);
            if (message.type === 'state' && onStateUpdate) {
                onStateUpdate(message.state, message.playerId);
            }
        }, simulatedLatency);
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

export function sendCommand(command: Command): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log(`[${currentPlayerName}] sending:`, command);
        setTimeout(() => {
            ws!.send(JSON.stringify(command));
        }, simulatedLatency);
    }
}
