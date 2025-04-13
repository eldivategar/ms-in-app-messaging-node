'use strict';

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        room_id: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'ID of the room where message was sent'
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'ID of the user who sent the message'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Content of the message'
        },
        type: {
            type: DataTypes.ENUM('text', 'image', 'file', 'system'),
            defaultValue: 'text',
            comment: 'Type of the message'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata for the message (file size, dimensions, etc.)'
        },
        is_edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether the message has been edited'
        },
        edited_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When the message was last edited'
        }
    }, {
        tableName: 'messages',
        underscored: true
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Room, {
            foreignKey: 'room_id',
            as: 'room'
        });
        Message.belongsTo(models.User, {
            foreignKey: 'sender_id',
            as: 'sender'
        });
    };

    return Message;
};
