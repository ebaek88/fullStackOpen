const router = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user.js");

router.post("/reset", async (req, res) => {
	await Blog.deleteMany({});
	await User.deleteMany({});

	res.status(204).end();
});

module.exports = router;
