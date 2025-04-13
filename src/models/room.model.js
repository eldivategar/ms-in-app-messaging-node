'use strict';

module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the chat room'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of the chat room'
        },
        type: {
            type: DataTypes.ENUM('private', 'group'),
            defaultValue: 'private',
            comment: 'Type of the chat room'
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'User who created the room'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'When the room was created'
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to room avatar image'
        }
    }, {
        tableName: 'rooms',
        underscored: true
    });

    Room.associate = (models) => {
        Room.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'creator'
        });
        Room.hasMany(models.RoomMember, {
            foreignKey: 'room_id',
            as: 'members'
        });
        Room.hasMany(models.Message, {
            foreignKey: 'room_id',
            as: 'messages'
        });
    };

    return Room;
};
