'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the user'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Email of the user'
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Avatar of the user'
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'offline',
            validate: {
                isIn: [['online', 'offline', 'away']]
            },
            comment: 'User online status'
        },
        last_seen: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Last time user was seen online'
        }
    }, {
        tableName: 'users',
        underscored: true
    });

    User.associate = (models) => {
        User.hasMany(models.Room, {
            foreignKey: 'created_by',
            as: 'created_rooms'
        });
        User.hasMany(models.RoomMember, {
            foreignKey: 'user_id',
            as: 'room_memberships'
        });
        User.hasMany(models.Message, {
            foreignKey: 'sender_id',
            as: 'messages'
        });
    };

    return User;
};