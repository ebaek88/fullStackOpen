// index.js for configuring and launching the app.
const express = require("express");
const app = express();

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const notesRouter = require("./controllers/notes.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");

app.use(express.json());

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
