// models/index.js for grouping different models
const Blog = require("./blog.js");

Blog.sync();

module.exports = {
  Blog,
};
