// index.js for configuring and launching the app.
const express = require("express");
const logger = require("./util/logger.js");
const app = express();

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
