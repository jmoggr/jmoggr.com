import type { GameState, Command, ServerMessage } from './types';

export type StateCallback = (state: GameState, playerId: number) => void;

let ws: WebSocket | null = null;
let onStateUpdate: StateCallback | null = null;
let simulatedLatency = 0;

export function setLatency(ms: number): void {
    simulatedLatency = ms;
}

export function connect(callback: StateCallback): void {
    onStateUpdate = callback;
    ws = new WebSocket('ws://localhost:8080/ws');

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
        setTimeout(() => {
            ws!.send(JSON.stringify(command));
        }, simulatedLatency);
    }
}
