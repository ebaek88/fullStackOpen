const commentsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");
const User = require("../models/user.js");
const middleware = require("../utils/middleware.js");

commentsRouter.get("/", async (request, response, next) => {
	try {
		const comments = await Comment.find({})
			.populate("user", {
				username: 1,
				name: 1,
			})
			.populate("blog", {
				title: 1,
				author: 1,
				url: 1,
				likes: 1,
			});
		response.json(comments);
	} catch (error) {
		next(error);
	}
});

commentsRouter.get("/:id", async (request, response, next) => {
	try {
		const comment = await Comment.findById(request.params.id)
			.populate("user", {
				username: 1,
				name: 1,
			})
			.populate("blog", {
				title: 1,
				author: 1,
				url: 1,
				likes: 1,
			});
		comment
			? response.json(comment)
			: response.status(404).json({ error: "comment not found" });
	} catch (error) {
		next(error);
	}
});

module.exports = commentsRouter;
