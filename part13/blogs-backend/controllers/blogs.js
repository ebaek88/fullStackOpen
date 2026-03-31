// controllers/blogs.js for routing REST requests for Blog model
const router = require("express").Router();

const { Blog } = require("../models/index.js");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();

  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const blog = await Blog.create({ ...req.body });
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  await req.blog.destroy();
  res.status(204).end();
});

module.exports = router;
