// models/blog.js for the table to be stored in the db
const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db.js");

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: "a blog should be written at least since 1991",
        },
        max: {
          args: new Date().getUTCFullYear(),
          msg: "a blog should be written no later than the current year",
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  },
);

module.exports = Blog;
