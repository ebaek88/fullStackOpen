// controllers/notes.js for routing REST requests for Note model
const router = require("express").Router();

const { Note } = require("../models/index.js");

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  if (!req.note) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const notes = await Note.findAll();

  // console.log(JSON.stringify(notes, null, 2));
  res.json(notes);
});

router.get("/:id", noteFinder, async (req, res) => {
  res.json(req.note);
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const note = await Note.create({ ...req.body, date: new Date() });
    // const note = Note.build(req.body);
    // note.important = true;
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
