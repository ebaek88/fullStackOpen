const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      blog_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "blog_users",
          key: "id",
        },
      },
      // Since Sequelize treats model setup and migration DDL a bit differently,
      // in migration files, unlike model definitions, it is required to explicitly define columns created_at
      // and/or updated_at
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("sessions");
  },
};
