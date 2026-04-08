const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db.js");

class ReadingList extends Model {}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blogs",
        key: "id",
      },
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
    timestamps: false,
    modelName: "reading_list",
  },
);

module.exports = ReadingList;
