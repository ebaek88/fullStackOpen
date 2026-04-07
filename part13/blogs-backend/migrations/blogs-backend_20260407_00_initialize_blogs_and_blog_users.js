// tables: blogs, blog_users
const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("blog_users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      // When defining in migrations, it is essential to remember that,
      // unlike models, column and table names such as user_id are written in snake case form.
      // So, "password_hash", not "passwordHash" in migrations.
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
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

    await queryInterface.createTable("blogs", {
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
      blog_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "blog_users", key: "id" },
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
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("blog_users");
  },
};
