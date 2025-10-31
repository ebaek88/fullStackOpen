const redis = require("../redis");
const express = require("express");
const router = express.Router();

router.get("/", async (_req, res) => {
  const addedTodos = await redis.getAsync("added_todos");
  res.json({ added_todos: Number(addedTodos) || 0 });
});

module.exports = router;
