// models/index.js for grouping different models
const Note = require("./note.js");
const User = require("./user.js");

// defining one-to-many relationship between users and notes table
User.hasMany(Note);
Note.belongsTo(User);

// no longer needed to sync explicitly, since we are using migrations from now on
// Note.sync({ alter: true });
// User.sync({ alter: true });

module.exports = {
  Note,
  User,
};
