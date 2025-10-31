const express = require("express");
const { Todo } = require("../mongo");
const redis = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const numTodos = await redis.getAsync("added_todos");
  redis.setAsync(
    "added_todos",
    isNaN(Number(numTodos)) ? 0 : Number(numTodos) + 1
  );
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.json(req?.todo);
  // res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  // find the todo
  const { text, done } = req?.body;
  const todoToUpdate = req.todo;

  if (todoToUpdate) {
    // update the todo
    todoToUpdate.text = text ?? todoToUpdate.text;
    todoToUpdate.done = done ?? todoToUpdate.done;
    // save the todo
    const savedTodo = await todoToUpdate.save();
    res.json(savedTodo);
  }
  // res.sendStatus(405); // Implement this
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
