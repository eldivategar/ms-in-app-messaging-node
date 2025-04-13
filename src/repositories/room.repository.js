const { Op } = require('sequelize');
const { Room, RoomMember, Message, User } = require('../models');
const jwt = require('jsonwebtoken');

class RoomRepository {
    // Room Operations
    async createRoom(roomData) {
        const { name, description, type, created_by, avatar } = roomData;

        const room = await Room.create({
            name,
            description,
            type,
            created_by,
            avatar
        });

        // Add creator as admin member
        await RoomMember.create({
            room_id: room.id,
            user_id: created_by,
            role: 'admin'
        });

        return room;
    }

    async createRoomWithMembers(roomData) {
        const { name, description, type, created_by, avatar, other_user_id, other_user_name, other_user_email } = roomData;

        // Start transaction
        const result = await Room.sequelize.transaction(async (t) => {
            // Create or get creator user
            let creator = await User.findByPk(created_by);
            if (!creator) {
                // Get creator data from token
                const token = roomData.token;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userData = decoded.data;

                creator = await User.create({
                    id: created_by,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role_name,
                    status: 'offline'
                }, { transaction: t });
            }

            // Create or get other user
            let otherUser = await User.findByPk(other_user_id);
            if (!otherUser) {
                otherUser = await User.create({
                    id: other_user_id,
                    name: other_user_name,
                    email: other_user_email,
                    role: 'user',
                    status: 'offline'
                }, { transaction: t });
            }

            // Check if room already exists between these users
            const existingRoom = await Room.findOne({
                include: [{
                    model: RoomMember,
                    as: 'members',
                    where: {
                        user_id: {
                            [Op.in]: [created_by, other_user_id]
                        }
                    }
                }],
                where: {
                    type: 'private'
                },
                transaction: t
            });

            if (existingRoom && existingRoom.members.length === 2) {
                return existingRoom;
            }

            // Create room
            const room = await Room.create({
                name: name || `Chat with ${otherUser.name}`,
                description,
                type,
                created_by,
                avatar
            }, { transaction: t });

            // Add creator as admin member
            await RoomMember.create({
                room_id: room.id,
                user_id: created_by,
                role: 'admin'
            }, { transaction: t });

            // Add other user as member
            await RoomMember.create({
                room_id: room.id,
                user_id: other_user_id,
                role: 'member'
            }, { transaction: t });

            // Fetch room with members and messages
            const roomWithMembers = await Room.findByPk(room.id, {
                include: [{
                    model: RoomMember,
                    as: 'members',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'avatar']
                    }]
                }, {
                    model: Message,
                    as: 'messages',
                    include: [{
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'name', 'email', 'avatar']
                    }],
                    order: [['created_at', 'DESC']],
                    limit: 50
                }],
                transaction: t
            });

            return roomWithMembers;
        });

        return result;
    }

    async getRoomById(roomId) {
        return await Room.findByPk(roomId, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async getUserRooms(userId) {
        try {
            // First, get all room IDs where the user is a member
            const userRooms = await RoomMember.findAll({
                where: { user_id: userId },
                attributes: ['room_id'],
                raw: true
            });
            const roomIds = userRooms.map(room => room.room_id);

            // Then, get all rooms with their members
            const rooms = await Room.findAll({
                include: [
                    {
                        model: RoomMember,
                        as: 'members',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'name', 'email', 'avatar']
                            }
                        ]
                    },
                    {
                        model: Message,
                        as: 'messages',
                        limit: 1,
                        order: [['created_at', 'DESC']],
                        include: [
                            {
                                model: User,
                                as: 'sender',
                                attributes: ['id', 'name', 'email', 'avatar']
                            }
                        ]
                    }
                ],
                where: {
                    id: {
                        [Op.in]: roomIds
                    }
                },
                order: [['updated_at', 'DESC']]
            });

            // Transform the rooms data to match the expected format
            return rooms.map(room => {
                const transformedRoom = room.toJSON();
                transformedRoom.members = transformedRoom.members.map(member => ({
                    user_id: member.user.id,
                    user_name: member.user.name,
                    user_email: member.user.email,
                    user_avatar: member.user.avatar,
                    role: member.role,
                    joined_at: member.joined_at,
                    last_read_at: member.last_read_at,
                    createdAt: member.createdAt,
                    updatedAt: member.updatedAt
                }));
                return transformedRoom;
            });
        } catch (error) {
            console.error('Error in getUserRooms repository:', error);
            throw error;
        }
    }

    async deleteRoom(roomId) {
        return await Room.sequelize.transaction(async (t) => {
            // Delete all messages in the room
            await Message.destroy({
                where: { room_id: roomId },
                transaction: t
            });

            // Delete all room members
            await RoomMember.destroy({
                where: { room_id: roomId },
                transaction: t
            });

            // Delete the room itself
            const deletedRoom = await Room.destroy({
                where: { id: roomId },
                transaction: t
            });

            return deletedRoom;
        });
    }

    // Utility Methods
    async updateLastRead(roomId, userId) {
        return await RoomMember.update(
            { last_read_at: new Date() },
            {
                where: {
                    room_id: roomId,
                    user_id: userId
                }
            }
        );
    }

    async getUnreadCount(roomId, userId) {
        const lastRead = await RoomMember.findOne({
            where: {
                room_id: roomId,
                user_id: userId
            },
            attributes: ['last_read_at']
        });

        return await Message.count({
            where: {
                room_id: roomId,
                created_at: {
                    [Op.gt]: lastRead?.last_read_at || new Date(0)
                }
            }
        });
    }

    async getRoomMessages(roomId, limit = 50) {
        return await Message.findAll({
            where: { room_id: roomId },
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email', 'avatar']
            }],
            order: [['created_at', 'DESC']],
            limit
        });
    }
}

module.exports = new RoomRepository();