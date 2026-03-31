// index.js for configuring and launching the app.
const express = require("express");
const logger = require("./util/logger.js");
const app = express();

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const blogsRouter = require("./controllers/blogs.js");

app.use(express.json());

app.use("/api/blogs", blogsRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
