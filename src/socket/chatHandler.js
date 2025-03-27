const chatHandler = (io) => {
    io.of("/chat").on("connection", (socket) => {
        console.log(`User connected to chat: ${socket.id}`);

        // Event untuk bergabung ke room
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit("userJoined", { userId: socket.id });
        });

        // Event untuk mengirim pesan
        socket.on("sendMessage", ({ roomId, senderId, content }) => {
            const messageData = {
                id: Date.now().toString(),
                roomId,
                senderId,
                content,
                createdAt: new Date(),
            };

            // Broadcast pesan ke room tertentu
            io.of("/chat").to(roomId).emit("newMessage", messageData);
        });

        // Event untuk meninggalkan room
        socket.on("leaveRoom", (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected from chat: ${socket.id}`);
        });
    });
};

module.exports = chatHandler;
