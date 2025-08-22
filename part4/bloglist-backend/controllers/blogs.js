const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const middleware = require("../utils/middleware.js");

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

blogsRouter.post(
  "/",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;

    try {
      // Retrieve information about the logged in user from the userExtractor middleware
      const user = request.user;

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
  }
);

blogsRouter.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      // Retrieve information about the logged in user from the userExtractor middleware
      const user = request.user;

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
  }
);

blogsRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes } = request.body;

    try {
      // Retrieve information about the logged in user from the userExtractor middleware
      const user = request.user;

      // Check if the blog to be updated has been created by the user logged in
      const blogToUpdate = await Blog.findById(request.params.id);

      if (!blogToUpdate) {
        return response.status(404).end();
      }

      if (blogToUpdate.user.toString() !== user._id.toString()) {
        return response.status(401).json({
          error: "a note can be updated only by the user who created it",
        });
      }

      // Update the blog
      blogToUpdate.title = title;
      blogToUpdate.author = author;
      blogToUpdate.url = url;
      blogToUpdate.likes = likes || 0;

      blogToUpdate.validateSync();

      const updatedBlog = await blogToUpdate.save();
      // After saving the updated note, we need to update the blogs list in User as well.
      user.blogs = user.blogs.concat(updatedBlog._id);
      await user.save();

      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = blogsRouter;
