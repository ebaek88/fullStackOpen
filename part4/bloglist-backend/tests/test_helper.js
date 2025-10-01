const Blog = require("../models/blog.js");
const User = require("../models/user.js");

const initialBlogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
];

const userId = "68dda78ba96712f8794ac4b0";

// creating initial notes with user "root"
const createInitialBlogs = async () => {
	const blogModels = initialBlogs.map((blog) => {
		return new Blog({
			title: blog.title,
			author: blog.author,
			url: blog.url,
			likes: blog.likes,
			user: userId,
		});
	});

	try {
		// DO NOT USE ASYNC FUNCTION INSIDE forEach. Instead, use promise array and Promise.all()
		const promiseArray = blogModels.map((blogModel) => blogModel.save());
		await Promise.all(promiseArray);
	} catch (err) {
		console.error(err.message);
	}
};

const initialUser = {
	// username: "test",
	// password: "bbcBbc998&",
	username: "root",
	password: "Q1w2e3r4!",
};

const nonExistingId = async () => {
	const blog = new Blog({
		title: "willremovethissoon",
		author: "willremovethissoon",
		url: "willremovethissoon",
	});

	await blog.save();
	await blog.deleteOne();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = {
	createInitialBlogs,
	initialUser,
	nonExistingId,
	blogsInDb,
	usersInDb,
};
