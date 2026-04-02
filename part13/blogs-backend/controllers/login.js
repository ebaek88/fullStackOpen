const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const { SECRET } = require("../util/config.js");

const BlogUser = require("../models/blog_user.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await BlogUser.findOne({ where: { username: username } });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 3 });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
