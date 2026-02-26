const server = Bun.serve({
    port: 8080,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("WebSocket server running on ws://localhost:8080");
    },
    websocket: {
        open(ws) {
            console.log("Client connected");
            ws.send("Welcome to Demo 1!");
        },
        message(ws, message) {
            console.log(`Received: ${message}`);
            ws.send(`Echo: ${message}`);
        },
        close(ws) {
            console.log("Client disconnected");
        },
    },
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
