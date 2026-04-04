// controllers/notes.js for routing REST requests for Note model
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { SECRET } = require("../util/config.js");

const router = require("express").Router();

const { Note, User } = require("../models/index.js");

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  if (!req.note) {
    return res.status(404).end();
  }
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.important) {
    where.important = req.query.important === "true";
  }

  if (req.query.search) {
    where.content = { [Op.substring]: req.query.search };
  }

  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });

  // console.log(JSON.stringify(notes, null, 2));
  res.json(notes);
});

router.get("/:id", noteFinder, async (req, res) => {
  res.json(req.note);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({
      ...req.body,
      date: new Date(),
      userId: user.id,
    });
    // const note = Note.build({ ...req.body, date: new Date() });
    // note.userId = user.id;
    // await note.save();
    return res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/:id", noteFinder, async (req, res) => {
  req.note.important = req.body.important;
  await req.note.save();
  res.json(req.note);
});

router.delete("/:id", noteFinder, async (req, res) => {
  await req.note.destroy();
  res.status(204).end();
});

module.exports = router;
