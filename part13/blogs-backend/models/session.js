const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db.js");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blog_users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "session",
  },
);

module.exports = Session;
