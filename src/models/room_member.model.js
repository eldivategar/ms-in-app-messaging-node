'use strict';

module.exports = (sequelize, DataTypes) => {
    const RoomMember = sequelize.define('RoomMember', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        room_id: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'ID of the room'
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'ID of the user'
        },
        role: {
            type: DataTypes.ENUM('admin', 'member'),
            defaultValue: 'member',
            comment: 'Role of the user in the room'
        },
        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'When the user joined the room'
        },
        last_read_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Last time user read messages in this room'
        }
    }, {
        tableName: 'room_members',
        underscored: true
    });

    RoomMember.associate = (models) => {
        RoomMember.belongsTo(models.Room, {
            foreignKey: 'room_id',
            as: 'room'
        });
        RoomMember.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return RoomMember;
};
