const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config.js");
const User = require("../models/user.js");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  // for the simplicity, it is assumed that all users have the same password "secret"
  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 3 });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
