const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, curr) => sum + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  const blogsSorted = blogs.toSorted((a, b) => b.likes - a.likes);
  return blogsSorted[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;

  const authorCounts = _.countBy(blogs, (blog) => blog.author);
  const sortedAuthorCounts = Object.entries(authorCounts).toSorted(
    (a, b) => b[1] - a[1]
  );
  const mostProlificAuthor = {
    author: sortedAuthorCounts[0][0],
    blogs: sortedAuthorCounts[0][1],
  };

  return mostProlificAuthor;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
