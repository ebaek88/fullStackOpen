const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const lodash = require("lodash");
const app = require("../app.js");
const Blog = require("../models/blog.js");
const logger = require("../utils/logger.js");

const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

beforeEach(async () => {
  try {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  } catch (err) {
    logger.error(err.message);
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);
  assert(titles.includes("React patterns"));
});

test("every blog has its unique value of id property", async () => {
  const response = await api.get("/api/blogs");

  const ids = response.body.map((blog) => blog.id);

  assert.strictEqual(ids.length, initialBlogs.length);
  assert.deepStrictEqual(lodash.uniq(ids), ids);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);

  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  assert(titles.includes("Canonical string reduction"));
});

after(async () => {
  await mongoose.connection.close();
});
