const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
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
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
