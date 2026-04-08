const bcrypt = require("bcrypt");
const router = require("express").Router();
const logger = require("../util/logger.js");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("../util/middleware.js");

const { Blog, BlogUser, ReadingList } = require("../models/index.js");

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
  const user = await BlogUser.findByPk(req.params.id, {
    attributes: {
      exclude: ["id", "passwordHash", "createdAt", "updatedAt"],
    },
    include: {
      model: Blog,
      attributes: { exclude: ["blogUserId"] },
      through: {
        attributes: [],
      },
    },
  });

  if (user) {
    const result = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      readings: user.blogs,
    };

    res.json(result);
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

router.use(errorHandler);

module.exports = router;
