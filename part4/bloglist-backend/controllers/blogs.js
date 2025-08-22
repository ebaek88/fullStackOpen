const blogsRouter = require("express").Router();
const { request } = require("express");
const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
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
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  try {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    if (!(body.title && body.url)) {
      return response.status(400).json({ error: "content missing" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });
    blog.validateSync();

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  // Check if login has been made beforehand
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  try {
    // Check if the token is issued to a valid user
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    // Check if the blog to be deleted has been created by the user logged in
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
      return response.status(404).end();
    }

    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: "a note can be deleted only by the user who created it",
      });
    }

    // Delete the blog
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
