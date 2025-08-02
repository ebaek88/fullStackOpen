const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB: ", err.message);
  });

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
