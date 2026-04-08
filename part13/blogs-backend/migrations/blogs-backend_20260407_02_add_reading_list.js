const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("reading_lists", {
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
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "blogs",
          key: "id",
        },
      },
      blog_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "blog_users",
          key: "id",
        },
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("reading_lists");
  },
};
