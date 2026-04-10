const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const { SECRET } = require("../util/config.js");

const { BlogUser, Session } = require("../models/index.js");
const { errorHandler } = require("../util/middleware.js");

// for login
router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await BlogUser.findOne({ where: { username: username } });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    // if the user is disabled, login is denied
    if (user.disabled) {
      return res
        .status(401)
        .json({ error: "the user is disabled. please contact admin" });
    }

    // if there is a token already existing in the sessions table, return that token
    const tokenInSession = await Session.findOne({
      where: {
        blogUserId: user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (user.id === tokenInSession?.blogUserId) {
      return res.status(200).send({
        token: tokenInSession.token,
        username: user.username,
        name: user.name,
        message: "already logged in",
      });
    }

    // if there is no entry in the sessions table with the blog user id, save the token in the table
    const userForToken = {
      username: user.username,
      id: user.id,
    };

    // since server-side session strategy is used, no need to set expiry in the jwt token
    const token = jwt.sign(userForToken, SECRET);

    // now, store the token in the sessions table only if there is no token existing already in the sessions table
    await Session.create({
      token,
      blogUserId: user.id,
    });

    return res
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
