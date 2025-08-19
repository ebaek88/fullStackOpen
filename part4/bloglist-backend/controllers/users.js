const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user.js");
const { request, response } = require("express");

userRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  // Password should be at least 8 and at most 60 characters.
  // It must contain at least an uppercase letter, a number, and one of ~!@#$%^&*.
  // It may contain lowercase letters.
  const passwordCondition =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*])[A-Za-z0-9~!@#$%^&*]{8,60}$/;
  if (!passwordCondition.test(password)) {
    return res
      .status(400)
      .json({ error: "The password did not meet the condition!" });
  }

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
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
