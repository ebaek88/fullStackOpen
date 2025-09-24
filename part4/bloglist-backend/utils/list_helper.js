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
	// const sortedAuthorCounts = Object.entries(authorCounts).toSorted(
	//   (a, b) => b[1] - a[1]
	// );
	// const mostProlificAuthor = {
	//   author: sortedAuthorCounts[0][0],
	//   blogs: sortedAuthorCounts[0][1],
	// };
	const mostProlificAuthor = _.max(Object.entries(authorCounts));
	return { author: mostProlificAuthor[0], blogs: mostProlificAuthor[1] };
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return undefined;

	const likesByAuthor = {};
	const likesFromBlogs = blogs.map((blog) => [blog.author, blog.likes]);
	likesFromBlogs.forEach((elem) => {
		likesByAuthor[elem[0]] = (likesByAuthor[elem[0]] || 0) + elem[1];
	});

	const authorWithMostLikes = Object.entries(likesByAuthor).toSorted(
		(a, b) => b[1] - a[1]
	)[0];

	return { author: authorWithMostLikes[0], likes: authorWithMostLikes[1] };
};

// Lodash version
const mostLikesLodash = (blogs) => {
	if (blogs.length === 0) return undefined;

	const grouped = _.groupBy(blogs, "author");
	// In Lodash, the callback fn for _.map has parameters in the following order:
	// If _.map is used over arrays: (element, index)
	// If _.map is used over object: (value, key)
	const authorLikes = _.map(grouped, (authorBlogs, author) => ({
		author,
		likes: _.sumBy(authorBlogs, "likes"),
	}));
	const top = _.maxBy(authorLikes, "likes");
	return top ? { author: top.author, likes: top.likes } : undefined;
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	mostLikesLodash,
};
