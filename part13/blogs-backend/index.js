// index.js for configuring and launching the app.
const express = require("express");
const logger = require("./util/logger.js");
const app = express();

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");
const authorsRouter = require("./controllers/authors.js");
const resetRouter = require("./controllers/reset.js");
const testRouter = require("./controllers/test.js");
const readingListRouter = require("./controllers/readinglists.js");

app.use(express.json());

app.use("/", testRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/reset", resetRouter);
app.use("/api/readinglists", readingListRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
