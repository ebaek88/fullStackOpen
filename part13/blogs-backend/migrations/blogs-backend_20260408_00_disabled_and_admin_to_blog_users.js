// add column "disabled" and "admin" to the table "blog_users"
const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blog_users", "disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("blog_users", "admin", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blog_users", "disabled");
    await queryInterface.removeColumn("blog_users", "admin");
  },
};
