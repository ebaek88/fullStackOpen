// models/index.js for grouping different models
const Blog = require("./blog.js");
const BlogUser = require("./blog_user.js");
const ReadingList = require("./reading_list.js");

// defining one-to-many relationship between users and blogs table
BlogUser.hasMany(Blog);
Blog.belongsTo(BlogUser);

// defining many-to-many relationship between blogs and users through the join table reading_lists
Blog.belongsToMany(BlogUser, { through: ReadingList });
BlogUser.belongsToMany(Blog, { through: ReadingList });

module.exports = {
  Blog,
  BlogUser,
  ReadingList,
};
