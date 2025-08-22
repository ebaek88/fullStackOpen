const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const logger = require("./utils/logger.js");
const config = require("./utils/config.js");
const middleware = require("./utils/middleware.js");
const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");

// Setting up middleware and connecting to DB
const app = express();

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB: ", error.message);
  });

app.use(express.json());
morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :body"
    )
  );
}

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
