import type { GameState, Command } from './types';
import { COLORS, createCommand, hashState, calculateScores } from './types';
import { applyCommand } from './game';
import { connect, sendCommand, setLatency } from './networking';

declare const litHtml: { html: any; render: any };

let gameState: GameState | null = null;
let selectedColor = COLORS[0];
let latency = 0;
let lastServerHash = '';
let synced = true;
let playerId = 0;
let playerName = '';

function checkSync() {
    if (gameState && lastServerHash) {
        const clientHash = hashState(gameState);
        synced = clientHash === lastServerHash;
    }
}

function renderGame(state: GameState) {
    const { html, render } = litHtml;
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
                                applyCommand(state, command);
                                renderGame(state);
                                sendCommand(command);
                            }
                        }}
                    />
                    <button @click=${() => {
                        const command = createCommand('setName', playerId, playerName);
                        applyCommand(state, command);
                        renderGame(state);
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
                                        applyCommand(state, command);
                                        renderGame(state);
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
                                renderGame(state);
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
                                renderGame(state);
                            }}
                        />
                    </label>
                    <div class="sync-status ${synced ? 'synced' : 'desynced'}">
                        ${synced ? 'In Sync' : 'Desynced'}
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
            gameState = state;
            playerId = id;
            lastServerHash = hashState(state);
            synced = true;
            renderGame(gameState);
        },
        (command) => {
            if (gameState) {
                applyCommand(gameState, command);
                lastServerHash = command.stateHash;
                checkSync();
                renderGame(gameState);
            }
        }
    );
}

if ((window as any).litHtml) {
    init();
} else {
    window.addEventListener('lit-ready', init);
}
