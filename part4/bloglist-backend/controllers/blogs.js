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

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    blog ? response.json(blog) : response.status(404).end();
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

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id);
    result ? response.status(204).end() : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    blog.title = title;
    blog.author = author;
    blog.url = url;
    blog.likes = likes || 0;

    blog.validateSync();

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
