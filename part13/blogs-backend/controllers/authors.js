const router = require("express").Router();
const { Op } = require("sequelize");
const { Blog } = require("../models/index.js");
const { errorHandler } = require("../util/middleware.js");
const { sequelize } = require("../util/db.js");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("title")), "blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  }); // SELECT author, COUNT(title) AS blogs, SUM(likes) AS likes FROM blogs GROUP BY author ORDER BY SUM(likes) DESC;

  res.json(blogs);
});

router.use(errorHandler);

module.exports = router;
