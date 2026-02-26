import type { GameState, Command, ServerMessage } from './types';

export type StateCallback = (state: GameState, playerId: number) => void;
export type CommandCallback = (command: Command) => void;

let ws: WebSocket | null = null;
let onStateUpdate: StateCallback | null = null;
let onCommandReceived: CommandCallback | null = null;
let simulatedLatency = 0;

export function setLatency(ms: number): void {
    simulatedLatency = ms;
}

export function connect(stateCallback: StateCallback, commandCallback: CommandCallback): void {
    onStateUpdate = stateCallback;
    onCommandReceived = commandCallback;
    ws = new WebSocket('ws://localhost:8080/ws');

    ws.onmessage = (event) => {
        setTimeout(() => {
            const message: ServerMessage = JSON.parse(event.data);
            if (message.type === 'state' && onStateUpdate) {
                onStateUpdate(message.state, message.playerId);
            } else if (message.type === 'command' && onCommandReceived) {
                onCommandReceived(message.command);
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
