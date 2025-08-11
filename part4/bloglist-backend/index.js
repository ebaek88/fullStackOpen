require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// DB and port configuration
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Setting up middleware and connecting to DB
const app = express();
console.log("connecting to ", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB: ", error.message);
  });

app.use(express.json());

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Setting up DB schema and object model from it
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

// HTTP router functions
app.get("/api/blogs", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => {
      console.error(error.message);
    });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => {
      console.error(error.message);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
