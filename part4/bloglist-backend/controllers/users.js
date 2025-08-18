const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user.js");
const { request, response } = require("express");

userRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = User.find({});
    response.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
