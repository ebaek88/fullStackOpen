require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog.js");

// using test DB
mongoose
  .connect(process.env.TEST_MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((err) => logger.error("error connecting to MongoDB: ", err.message));

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

Blog.insertMany(initialBlogs)
  .then(() => console.log("added successfully"))
  .catch((err) => logger.error(err.message))
  .finally(() => mongoose.connection.close());

// Same as
// const blogObjects = initialBlogs.map((blog) => new Blog(blog));
// const promiseArray = blogObjects.map((blog) => blog.save());

// Promise.all(promiseArray)
//   .then(() => console.log("added successfully"))
//   .catch((err) => logger.error(err.message))
//   .finally(() => mongoose.connection.close());
