const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Room = require("./Room");
const User = require("./User");

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Room,
                key: "id",
            },
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "sent",
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "messages",
    }
);

Message.belongsTo(Room, { foreignKey: "roomId", as: "room" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

module.exports = Message;
