const jwt = require("jsonwebtoken");
const { BlogUser, Session } = require("../models/index.js");
const logger = require("./logger.js");
const { SECRET } = require("./config.js");

const errorHandler = (error, req, res, next) => {
  logger.error(error);
  let errorMessage = [];

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    errorMessage = errorMessage.concat(
      error.errors.map((error) => error.message),
    );
  }

  if (error.name === "SequelizeDatabaseError") {
    errorMessage = errorMessage.concat(error.name);
  }

  if (errorMessage.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  return res.status(500).json({ error: "internal server error" });
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
      return next(error);
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const token = req
      .get("authorization")
      .substring(7)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    const user = await BlogUser.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(400).json({ error: "user id missing or not valid " });
    }

    // now find in the table session if the token is valid
    const tokenInSession = await Session.findOne({
      where: {
        blogUserId: user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (
      token !== tokenInSession?.token ||
      user.id !== tokenInSession?.blogUserId
    ) {
      return res.status(401).json({ error: "token expired" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  const user = await BlogUser.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor, isAdmin };
