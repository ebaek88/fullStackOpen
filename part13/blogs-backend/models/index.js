// models/index.js for grouping different models
const { sequelize } = require("../util/db.js");
const Blog = require("./blog.js");
const BlogUser = require("./blog_user.js");

// defining one-to-many relationship between users and blogs table
BlogUser.hasMany(Blog);
Blog.belongsTo(BlogUser);

const syncModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = {
  Blog,
  BlogUser,
  syncModels,
};
