const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const lodash = require("lodash");
const app = require("../app.js");
const helper = require("./test_helper.js");
const Blog = require("../models/blog.js");
const logger = require("../utils/logger.js");

const api = supertest(app);

describe("when there are initially some blogs saved", () => {
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
    assert(titles.includes(helper.initialBlogs[0].title));
  });

  test("every blog has its unique value of id property", async () => {
    const response = await api.get("/api/blogs");

    const ids = response.body.map((blog) => blog.id);

    assert.strictEqual(ids.length, helper.initialBlogs.length);
    assert.deepStrictEqual(lodash.uniq(ids), ids);
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    test("succeeds with valid data", async () => {
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

    test("fails with statuscode 400 if a blog without the title or url properties is not added", async () => {
      const newBlog = {
        author: "Dooly",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", async () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((blog) => blog.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });

    test("fails with statuscode 204 if blog does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.delete(`/api/blogs/${validNonexistingId}`).expect(204);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
