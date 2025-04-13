const { Message, User } = require('../models');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id, 'User:', socket.user.name);

        // Join room
        socket.on('join_room', async (data) => {
            const { roomId } = data;
            const userId = socket.user.id;

            try {
                // Join the room
                socket.join(roomId);
                console.log(`User ${socket.user.name} joined room ${roomId}`);

                // Notify others in the room
                socket.to(roomId).emit('user_joined', {
                    userId,
                    userName: socket.user.name,
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Handle new message
        socket.on('send_message', async (data) => {
            const { roomId, content, type = 'text' } = data;
            const senderId = socket.user.id;

            try {
                // Save message to database
                const message = await Message.create({
                    room_id: roomId,
                    sender_id: senderId,
                    content,
                    type
                });

                // Get message with sender info
                const messageWithSender = await Message.findByPk(message.id, {
                    include: [{
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'name', 'email', 'avatar']
                    }]
                });

                // Broadcast message to room
                io.to(roomId).emit('new_message', {
                    senderId,
                    senderName: socket.user.name,
                    content,
                    type,
                    timestamp: message.created_at
                });
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing status
        socket.on('typing', (data) => {
            const { roomId, isTyping } = data;
            const userId = socket.user.id;

            socket.to(roomId).emit('user_typing', {
                userId,
                userName: socket.user.name,
                isTyping
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id, 'User:', socket.user.name);
        });
    });

    return io;
};
