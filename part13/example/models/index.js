// models/index.js for grouping different models
const Note = require("./note.js");
const User = require("./user.js");
const Team = require("./team.js");
const Membership = require("./membership.js");
const UserNotes = require("./user_notes.js");

// defining one-to-many relationship between users and notes table
User.hasMany(Note);
Note.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

User.belongsToMany(Note, { through: UserNotes, as: "marked_notes" });
Note.belongsToMany(User, { through: UserNotes, as: "users_marked" });

// no longer needed to sync explicitly, since we are using migrations from now on
// Note.sync({ alter: true });
// User.sync({ alter: true });

module.exports = {
  Note,
  User,
  Team,
  Membership,
  UserNotes,
};
