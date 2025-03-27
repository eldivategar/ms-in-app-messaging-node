const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./User");
const Room = require("./Room");

const RoomMember = sequelize.define(
    "RoomMember",
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
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "room_members",
    }
);

RoomMember.belongsTo(Room, { foreignKey: "roomId", as: "room" });
RoomMember.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = RoomMember;
