const express = require('express');
const cors = require('cors');
const http = require('http');
const { initializeSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

const io = initializeSocket(server);

chatHandler(io);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
