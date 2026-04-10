// models/index.js for grouping different models
const Blog = require("./blog.js");
const BlogUser = require("./blog_user.js");
const ReadingList = require("./reading_list.js");
const Session = require("./session.js");

// defining one-to-many relationship between users and blogs table
BlogUser.hasMany(Blog);
Blog.belongsTo(BlogUser);

// defining many-to-many relationship between blogs and users through the join table reading_lists
Blog.belongsToMany(BlogUser, { through: ReadingList });
BlogUser.belongsToMany(Blog, { through: ReadingList });

// defining one-to-one relationship between users and sessions table
BlogUser.hasOne(Session, {
  foreignKey: { allowNull: false }, // this sets that a session cannot exists without a BlogUser
});
Session.belongsTo(BlogUser);

module.exports = {
  Blog,
  BlogUser,
  ReadingList,
  Session,
};
