const statusEl = document.getElementById('status')!;
const messagesEl = document.getElementById('messages')!;
const connectBtn = document.getElementById('connect')! as HTMLButtonElement;
const sendBtn = document.getElementById('send')! as HTMLButtonElement;

let ws: WebSocket | null = null;

function log(message: string) {
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setStatus(connected: boolean) {
    statusEl.textContent = connected ? 'Connected' : 'Disconnected';
    statusEl.className = connected ? 'connected' : 'disconnected';
    connectBtn.textContent = connected ? 'Disconnect' : 'Connect';
    sendBtn.disabled = !connected;
}

connectBtn.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        return;
    }

    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        setStatus(true);
        log('Connected to server');
    };

    ws.onmessage = (event) => {
        log(`Server: ${event.data}`);
    };

    ws.onclose = () => {
        setStatus(false);
        log('Disconnected from server');
    };

    ws.onerror = (error) => {
        log(`Error: ${error}`);
    };
});

sendBtn.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const message = `Hello from client at ${new Date().toLocaleTimeString()}`;
        ws.send(message);
        log(`Sent: ${message}`);
    }
});

// Initialize
setStatus(false);
log('Ready. Click Connect to start.');
