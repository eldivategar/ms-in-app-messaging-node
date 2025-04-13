const roomService = require('../services/room.service');

class RoomController {
    // Room Controllers
    async createRoom(req, res) {
        try {
            const { other_user_id, other_user_name, other_user_email, description, type, avatar } = req.body;
            const created_by = req.user.id;
            const token = req.headers.authorization.split(' ')[1];

            if (!other_user_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Other user ID is required'
                });
            }

            const result = await roomService.createRoom({
                other_user_id,
                other_user_name,
                other_user_email,
                description,
                type,
                created_by,
                avatar,
                token
            });

            res.status(201).json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            console.error('Error in createRoom controller:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to create room'
            });
        }
    }

    async getRoomById(req, res) {
        try {
            const result = await roomService.getRoomById(req.params.roomId);
            if (!result.success) {
                return res.status(404).json({
                    status: 'error',
                    message: result.message
                });
            }
            return res.status(200).json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getRoomById controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch room'
            });
        }
    }

    async getUserRooms(req, res) {
        try {
            const result = await roomService.getUserRooms(req.user.id);
            res.json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getUserRooms controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch rooms'
            });
        }
    }

    async deleteRoom(req, res) {
        try {
            const result = await roomService.deleteRoom(req.params.roomId, req.user.id);
            if (!result.success) {
                return res.status(403).json({
                    status: 'error',
                    message: result.message
                });
            }

            res.json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            console.error('Error in deleteRoom controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to delete room'
            });
        }
    }

    async updateLastRead(req, res) {
        try {
            const result = await roomService.updateLastRead(req.params.roomId, req.params.userId);
            if (!result.success) {
                return res.status(400).json({
                    status: 'error',
                    message: result.message
                });
            }
            return res.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            console.error('Error in updateLastRead controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to update last read'
            });
        }
    }

    async getUnreadCount(req, res) {
        try {
            const result = await roomService.getUnreadCount(req.params.roomId, req.params.userId);
            if (!result.success) {
                return res.status(400).json({
                    status: 'error',
                    message: result.message
                });
            }
            return res.status(200).json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getUnreadCount controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to get unread count'
            });
        }
    }

    async getRoomMessages(req, res) {
        try {
            const { roomId } = req.params;
            const { limit } = req.query;
            
            const result = await roomService.getRoomMessages(roomId, limit);
            
            res.json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getRoomMessages controller:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch messages'
            });
        }
    }
}

module.exports = new RoomController();
