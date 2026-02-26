import type { GameState, Command, Cell } from './types';
import { GRID_SIZE } from './types';

export function createInitialState(): GameState {
    const grid: Cell[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        grid[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            grid[y][x] = { color: '#ffffff', playerId: null };
        }
    }
    return { grid, gridSize: GRID_SIZE, players: {} };
}

export function applyCommand(state: GameState, command: Command): void {
    if (command.type === 'setColor') {
        state.grid[command.y][command.x] = { color: command.color, playerId: command.playerId };
    } else if (command.type === 'setName') {
        if (state.players[command.playerId]) {
            state.players[command.playerId].name = command.name;
        }
    }
}

export function cloneState(state: GameState): GameState {
    return {
        grid: state.grid.map(row => row.map(cell => ({ ...cell }))),
        gridSize: state.gridSize,
        players: { ...state.players },
    };
}
