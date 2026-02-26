export interface Player {
    id: number;
    name: string;
}

export interface Cell {
    color: string;
    playerId: number | null;
}

export interface GameState {
    grid: Cell[][];
    gridSize: number;
    players: Record<number, Player>;
}

export interface SetColorCommand {
    type: 'setColor';
    id: number;
    version: number;
    timestamp: string;
    stateHash: string;
    playerId: number;
    x: number;
    y: number;
    color: string;
}

export interface SetNameCommand {
    type: 'setName';
    id: number;
    version: number;
    timestamp: string;
    stateHash: string;
    playerId: number;
    name: string;
}

export type Command = SetColorCommand | SetNameCommand;

export interface CommandMessage {
    type: 'command';
    command: Command;
}

export interface StateMessage {
    type: 'state';
    state: GameState;
    playerId: number;
}

export type ServerMessage = CommandMessage | StateMessage;

export const COLORS = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
export const GRID_SIZE = 8;

export function createCommand(type: 'setColor', playerId: number, x: number, y: number, color: string): SetColorCommand;
export function createCommand(type: 'setName', playerId: number, name: string): SetNameCommand;
export function createCommand(type: 'setColor' | 'setName', playerId: number, ...args: any[]): Command {
    const base = {
        id: Math.floor(Math.random() * 1000000000),
        version: 0,
        timestamp: new Date().toISOString(),
        stateHash: '',
        playerId,
    };
    if (type === 'setColor') {
        return { ...base, type, x: args[0], y: args[1], color: args[2] };
    } else {
        return { ...base, type, name: args[0] };
    }
}

export function hashState(state: GameState): string {
    let hash = 0;
    const str = JSON.stringify(state.grid) + JSON.stringify(state.players);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

export function calculateScores(state: GameState): { playerId: number; name: string; score: number }[] {
    const scores: Record<number, number> = {};
    for (const row of state.grid) {
        for (const cell of row) {
            if (cell.playerId !== null) {
                scores[cell.playerId] = (scores[cell.playerId] || 0) + 1;
            }
        }
    }
    return Object.entries(scores)
        .map(([id, score]) => ({
            playerId: Number(id),
            name: state.players[Number(id)]?.name || 'Unknown',
            score,
        }))
        .sort((a, b) => b.score - a.score);
}
