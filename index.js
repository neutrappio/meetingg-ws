const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

const wsServer = new WebSocket.Server({ server: httpServer });

let viewers = [];
let participants = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');

    viewers.push(ws);
    ws.on('message', data => {
        viewers.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(data);
            } else {
                viewers.splice(i, 1);
            }
        });
    });
});

// HTTP stuff
app.get('/viewer', (req, res) => res.sendFile(path.resolve(__dirname, './viewer.html')));
app.get('/participant', (req, res) => res.sendFile(path.resolve(__dirname, './participant.html')));
app.get('/', (req, res) => {
    res.send(`
        <a href="participant">participant</a><br>
        <a href="viewer">viewer</a>
    `);
});
httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));
