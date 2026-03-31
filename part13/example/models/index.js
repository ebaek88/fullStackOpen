// models/index.js for grouping different models
const Note = require("./note.js");

Note.sync();

module.exports = {
  Note,
};
