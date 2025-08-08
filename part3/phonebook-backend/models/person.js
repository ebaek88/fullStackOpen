const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "The name should be at least 3 characters long!"],
    required: [true, "Name required!"],
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(\d{2,3})-(\d{5,})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Phone number required!"],
  },
});

// Formatting the document objects returned by Mongoose
// , so that the id field is in string and the version field is no longer needed in the app
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
