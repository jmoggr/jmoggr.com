import type { GameState, Command } from './types';
import { COLORS, createCommand, hashState, calculateScores } from './types';
import { applyCommand, cloneState, createInitialState } from './game';
import { connect, sendCommand, setLatency } from './networking';

declare const litHtml: { html: any; render: any };

let selectedColor = COLORS[0];
let latency = 0;
let lastServerHash = '';
let synced = true;
let playerId = 0;
let playerName = '';

// Authoritative state (up to last confirmed command)
let authoritativeState: GameState = createInitialState();

// Optimistic commands (sent but not yet confirmed)
let optimisticCommands: Command[] = [];

// Current displayed state (authoritative + optimistic)
let displayState: GameState = createInitialState();

function recomputeDisplayState() {
    displayState = cloneState(authoritativeState);
    for (const cmd of optimisticCommands) {
        applyCommand(displayState, cmd);
    }
}

function checkSync() {
    if (lastServerHash) {
        const clientHash = hashState(authoritativeState);
        synced = clientHash === lastServerHash;
    }
}

function renderGame() {
    const { html, render } = litHtml;
    const state = displayState;
    const scores = calculateScores(state);
    const currentPlayer = state.players[playerId];
    if (currentPlayer && !playerName) {
        playerName = currentPlayer.name;
    }

    const template = html`
        <div class="game-container">
            <div class="main-area">
                <div class="name-input">
                    <input type="text" .value=${playerName} placeholder="Your name"
                        @input=${(e: Event) => {
                            playerName = (e.target as HTMLInputElement).value;
                        }}
                        @keyup=${(e: KeyboardEvent) => {
                            if (e.key === 'Enter') {
                                const command = createCommand('setName', playerId, playerName);
                                optimisticCommands.push(command);
                                recomputeDisplayState();
                                renderGame();
                                sendCommand(command);
                            }
                        }}
                    />
                    <button @click=${() => {
                        const command = createCommand('setName', playerId, playerName);
                        optimisticCommands.push(command);
                        recomputeDisplayState();
                        renderGame();
                        sendCommand(command);
                    }}>Set Name</button>
                </div>
                <div class="grid">
                    ${state.grid.map((row, y) => html`
                        <div class="row">
                            ${row.map((cell, x) => html`
                                <div
                                    class="cell"
                                    style="background-color: ${cell.color}"
                                    @click=${() => {
                                        const command = createCommand('setColor', playerId, x, y, selectedColor);
                                        optimisticCommands.push(command);
                                        recomputeDisplayState();
                                        renderGame();
                                        sendCommand(command);
                                    }}
                                ></div>
                            `)}
                        </div>
                    `)}
                </div>
                <div class="palette">
                    ${COLORS.map(color => html`
                        <div
                            class="color ${color === selectedColor ? 'selected' : ''}"
                            style="background-color: ${color}"
                            @click=${() => {
                                selectedColor = color;
                                renderGame();
                            }}
                        ></div>
                    `)}
                </div>
                <div class="controls">
                    <label>
                        Latency: ${latency}ms
                        <input type="range" min="0" max="3000" .value=${latency}
                            @input=${(e: Event) => {
                                latency = parseInt((e.target as HTMLInputElement).value);
                                setLatency(latency);
                                renderGame();
                            }}
                        />
                    </label>
                    <div class="sync-status ${synced ? 'synced' : 'desynced'}">
                        ${synced ? 'In Sync' : 'Desynced'}
                    </div>
                    <div class="pending-count">
                        Pending: ${optimisticCommands.length}
                    </div>
                </div>
            </div>
            <div class="scoreboard">
                <h3>Scoreboard</h3>
                ${scores.length === 0 ? html`<div class="no-scores">No scores yet</div>` : ''}
                ${scores.map(s => html`
                    <div class="score-row ${s.playerId === playerId ? 'current-player' : ''}">
                        <span class="player-name">${s.name}</span>
                        <span class="player-score">${s.score}</span>
                    </div>
                `)}
            </div>
        </div>
    `;
    render(template, document.getElementById('app')!);
}

function init() {
    connect(
        (state, id) => {
            authoritativeState = cloneState(state);
            playerId = id;
            optimisticCommands = [];
            lastServerHash = hashState(state);
            synced = true;
            recomputeDisplayState();
            renderGame();
        },
        (command) => {
            // Apply to authoritative state
            applyCommand(authoritativeState, command);
            lastServerHash = command.stateHash;

            // Remove matching optimistic command by id
            optimisticCommands = optimisticCommands.filter(cmd => cmd.id !== command.id);

            // Recompute display state
            recomputeDisplayState();
            checkSync();
            renderGame();
        }
    );
}

if ((window as any).litHtml) {
    init();
} else {
    window.addEventListener('lit-ready', init);
}
