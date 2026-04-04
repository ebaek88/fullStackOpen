// controllers/blogs.js for routing REST requests for Blog model
const router = require("express").Router();
const { Op } = require("sequelize");
const logger = require("../util/logger.js");
const {
  tokenExtractor,
  userExtractor,
  errorHandler,
} = require("../util/middleware.js");

const { Blog, BlogUser } = require("../models/index.js");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.substring]: req.query.search } },
      { author: { [Op.substring]: req.query.search } },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["blogUserId"] },
    include: {
      model: BlogUser,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });

  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.post("/", tokenExtractor, userExtractor, async (req, res, next) => {
  try {
    logger.info(req.body);
    const blog = await Blog.create({
      ...req.body,
      blogUserId: req.user.id,
      date: new Date(),
    });
    return res.json(blog);
  } catch (error) {
    return next(error);
    // return res.status(400).json({ error });
  }
});

router.delete(
  "/:id",
  blogFinder,
  tokenExtractor,
  userExtractor,
  async (req, res, next) => {
    try {
      if (req.user.id !== req.blog.blogUserId) {
        return res.status(401).json({
          error: "a note can be deleted only by the user who created it",
        });
      }
      await req.blog.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    return next(error);
    // return res.status(400).json({ error });
  }
});

router.use(errorHandler);

module.exports = router;
