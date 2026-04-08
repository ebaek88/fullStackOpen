const router = require("express").Router();
const { Blog, BlogUser, ReadingList } = require("../models/index.js");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("../util/middleware.js");

router.post("/", tokenExtractor, userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.body.blogId);
    if (!blog) {
      return res.status(404).end();
    }

    const readingList = await ReadingList.create({
      blogId: req.body.blogId,
      blogUserId: req.user.id,
    });

    return res.json(readingList);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
