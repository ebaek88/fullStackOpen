const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const lodash = require("lodash");
const app = require("../app.js");
const helper = require("./test_helper.js");
const Blog = require("../models/blog.js");
const logger = require("../utils/logger.js");

const api = supertest(app);

beforeEach(async () => {
  try {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    // Same as
    // const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    // const promiseArray = blogObjects.map((blog) => blog.save());
    // await Promise.all(promiseArray);
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

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);
  assert(titles.includes("React patterns"));
});

test("every blog has its unique value of id property", async () => {
  const response = await api.get("/api/blogs");

  const ids = response.body.map((blog) => blog.id);

  assert.strictEqual(ids.length, helper.initialBlogs.length);
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

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(titles.includes("Canonical string reduction"));
});

test("the likes property of a new blog defaults to 0 if it is added without the property", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const recentlyAddedBlog = blogsAtEnd.find(
    (blog) => blog.title === newBlog.title
  );
  assert.strictEqual(recentlyAddedBlog.likes, 0);
});

test("a blog without the title or url properties is not added", async () => {
  const newBlog = {
    author: "Dooly",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
