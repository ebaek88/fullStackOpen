const router = require("express").Router();
const { Blog, BlogUser } = require("../models/index.js");
const { errorHandler } = require("../util/middleware.js");

router.post("/", async (req, res, next) => {
  try {
    await Blog.destroy({ where: {} });
    await BlogUser.destroy({ where: {} });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
