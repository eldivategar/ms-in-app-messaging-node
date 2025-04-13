const roomRepository = require('../repositories/room.repository');
const { Room, RoomMember } = require('../models');

class RoomService {
    async createRoom(roomData) {
        try {
            const { other_user_id, other_user_name, other_user_email, description, type, avatar, created_by, token } = roomData;
            const name = new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
            const room = await roomRepository.createRoomWithMembers({
                name,
                description,
                type,
                created_by,
                avatar,
                other_user_id,
                other_user_name,
                other_user_email,
                token
            });

            return {
                success: true,
                data: room
            };
        } catch (error) {
            console.error('Error in createRoom service:', error);
            throw error;
        }
    }

    async getRoomById(roomId) {
        try {
            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return {
                    success: false,
                    message: 'Room not found'
                };
            }
            return {
                success: true,
                data: room
            };
        } catch (error) {
            console.error('Error in getRoomById service:', error);
            throw error;
        }
    }

    async getUserRooms(userId) {
        try {
            const rooms = await roomRepository.getUserRooms(userId);
            return {
                success: true,
                data: rooms
            };
        } catch (error) {
            console.error('Error in getUserRooms service:', error);
            throw error;
        }
    }

    async deleteRoom(roomId, userId) {
        try {
            // Check if room exists and user is admin
            const room = await Room.findOne({
                include: [{
                    model: RoomMember,
                    as: 'members',
                    where: {
                        user_id: userId,
                        role: 'admin'
                    }
                }]
            });

            if (!room) {
                return {
                    success: false,
                    message: 'You do not have permission to delete this room'
                };
            }

            // Delete room and related data
            await roomRepository.deleteRoom(roomId);

            return {
                success: true,
                message: 'Room deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteRoom service:', error);
            throw error;
        }
    }

    async updateLastRead(roomId, userId) {
        try {
            await roomRepository.updateLastRead(roomId, userId);
            return {
                success: true,
                message: 'Last read updated successfully'
            };
        } catch (error) {
            console.error('Error in updateLastRead service:', error);
            throw error;
        }
    }

    async getUnreadCount(roomId, userId) {
        try {
            const count = await roomRepository.getUnreadCount(roomId, userId);
            return {
                success: true,
                data: count
            };
        } catch (error) {
            console.error('Error in getUnreadCount service:', error);
            throw error;
        }
    }

    async getRoomMessages(roomId, limit = 50) {
        try {
            const messages = await roomRepository.getRoomMessages(roomId, parseInt(limit) || 50);
            return {
                success: true,
                data: messages
            };
        } catch (error) {
            console.error('Error in getRoomMessages service:', error);
            throw error;
        }
    }
}

module.exports = new RoomService();
