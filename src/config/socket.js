const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS,
            methods: ["GET", "POST"],
        },
    });

    console.log("Socket.io initialized");

    return io;
};

// Fungsi untuk mendapatkan instance io
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io belum diinisialisasi!");
    }
    return io;
};

module.exports = { initializeSocket, getIo };
