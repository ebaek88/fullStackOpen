const jwt = require("jsonwebtoken");
const logger = require("./logger.js");
const User = require("../models/user.js");

const tokenExtractor = (request, response, next) => {
  try {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
      request.token = authorization.replace("Bearer ", "");
    } else {
      request.token = null;
    }
    next();
  } catch (error) {
    next(error);
  }
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (!(authorization && authorization.startsWith("Bearer "))) {
    return response.status(401).json({ error: "token nonexisting" });
  }
  const token = authorization.replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  try {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }
    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected 'username' to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

module.exports = { userExtractor, unknownEndpoint, errorHandler };
