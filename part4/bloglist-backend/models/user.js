const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // username should be at least 3 characters long and at most 20 characters long.
  // username should also be in alphanumeric characters only, and it should start with alphabets.
  username: String,
  name: String,
  passwordHash: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
