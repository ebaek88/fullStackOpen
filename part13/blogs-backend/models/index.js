// models/index.js for grouping different models
const Blog = require("./blog.js");
const BlogUser = require("./blog_user.js");

// defining one-to-many relationship between users and blogs table
BlogUser.hasMany(Blog);
Blog.belongsTo(BlogUser);

Blog.sync({ alter: true });
BlogUser.sync({ alter: true });

module.exports = {
  Blog,
  BlogUser,
};
