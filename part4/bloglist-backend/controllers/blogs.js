const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!(body.title && body.url)) {
    return response.status(400).json({ error: "content missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });
  blog.validateSync();

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
