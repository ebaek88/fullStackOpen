const bcrypt = require("bcrypt");
const router = require("express").Router();
const { Op } = require("sequelize");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("../util/middleware.js");

const { Blog, BlogUser, ReadingList } = require("../models/index.js");
const adminRouter = require("./admin.js");

router.get("/", async (req, res) => {
  const users = await BlogUser.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["blogUserId"] },
    },
  });

  res.json(users);
});

router.post("/", async (req, res, next) => {
  const { username, name, email, password } = req.body;

  const saltRounds = 10;

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userInfo = { username, name, email, passwordHash };
    const user = await BlogUser.create(userInfo);
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

// router.get("/:username", async (req, res) => {
//   const user = await BlogUser.findOne({
//     where: { username: req.params.username },
//     attributes: {
//       exclude: ["passwordHash"],
//     },
//   });
//   user ? res.json(user) : res.status(404).end();
// });

router.get("/:id", async (req, res) => {
  console.log("id: " + req.params.id);
  console.log("read: " + req.query.read);

  const user = await BlogUser.findByPk(req.params.id, {
    attributes: {
      exclude: ["id", "passwordHash", "createdAt", "updatedAt"],
    },
    include: {
      model: Blog,
      attributes: { exclude: ["blogUserId", "createdAt", "updatedAt"] },
      through: {
        attributes: ["id", "read"],
      },
    },
  });

  if (user) {
    // we use filtered blogs only when there is a query parameter "read"
    const filteredBlogs = user.blogs?.filter(
      (blog) => blog.reading_list.read === (req.query.read === "true"),
    );

    const result = {
      name: user.name,
      username: user.username,
      email: user.email,
      readings: (req.query.read ? filteredBlogs : user.blogs).map((blog) => ({
        id: blog.id,
        author: blog.author,
        url: blog.url,
        title: blog.title,
        likes: blog.likes,
        year: blog.year,
        readinglists: [blog.reading_list],
      })),
    };

    res.json(result);
    // res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put(
  "/:username",
  tokenExtractor,
  userExtractor,
  async (req, res, next) => {
    const user = await BlogUser.findOne({
      where: { username: req.params.username },
      attributes: {
        exclude: ["passwordHash"],
      },
    });

    if (!user) {
      return res.status(404).end();
    }

    if (user.id !== req.user.id) {
      return res
        .status(401)
        .json({ error: "the name can be changed only by its user" });
    }

    try {
      user.name = req.body.name;
      await user.save();
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.use("/:username/disable", adminRouter);
router.use(errorHandler);

module.exports = router;
