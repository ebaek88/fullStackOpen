const mongoose = require("mongoose");

// Setting up DB schema and object model from it
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required!"],
  },
  author: String,
  url: {
    type: String,
    required: [true, "URL required!"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Formatting the document objects returned by Mongoose
// , so that the id field is in string and the version field is no longer needed in the app
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
