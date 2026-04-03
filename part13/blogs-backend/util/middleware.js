const jwt = require("jsonwebtoken");
const BlogUser = require("../models/blog_user.js");
const logger = require("./logger.js");
const { SECRET } = require("./config.js");

const errorHandler = (error, req, res, next) => {
  logger.error(error);
  // logger.error(error.message);

  if (error.name === "SequelizeValidationError") {
    const errorMessage = error.errors.map((error) => error.message);
    return res.status(400).json({ errorMessage });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.name });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authorization
        .substring(7)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      req.decodedToken = jwt.verify(token, SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const user = await BlogUser.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(400).json({ error: "user id missing or not valid " });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
