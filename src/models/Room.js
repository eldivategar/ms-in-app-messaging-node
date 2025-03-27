const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./User");

const Room = sequelize.define(
    "Room",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "rooms",
    }
);

Room.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Room;
