const bcrypt = require("bcrypt");
const router = require("express").Router();
const logger = require("../util/logger.js");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("../util/middleware.js");

const { BlogUser } = require("../models/index.js");

router.get("/", async (req, res) => {
  const users = await BlogUser.findAll({
    attributes: {
      exclude: ["passwordHash"],
    },
  });

  res.json(users);
});

router.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userInfo = { username, name, passwordHash };
    const user = await BlogUser.create(userInfo);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:username", async (req, res) => {
  const user = await BlogUser.findOne({
    where: { username: req.params.username },
    attributes: {
      exclude: ["passwordHash"],
    },
  });
  user ? res.json(user) : res.status(404).end();
});

router.put("/:username", tokenExtractor, userExtractor, async (req, res) => {
  const user = await BlogUser.findOne({
    where: { username: req.params.username },
    attributes: {
      exclude: ["passwordHash"],
    },
  });

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
});

router.use(errorHandler);

module.exports = router;
