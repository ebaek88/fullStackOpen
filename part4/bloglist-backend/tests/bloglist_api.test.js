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
      await Blog.deleteMany({}); // delete all notes
      await helper.createInitialBlogs(); // add initial notes
      // await Blog.insertMany(helper.initialBlogs);
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
    const blogsAtStart = await helper.blogsInDb();
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, blogsAtStart.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const response = await api.get("/api/blogs");

    const titles = response.body.map((blog) => blog.title);
    assert(titles.includes(blogsAtStart[0].title));
  });

  test("every blog has its unique value of id property", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const response = await api.get("/api/blogs");

    const ids = response.body.map((blog) => blog.id);

    assert.strictEqual(ids.length, blogsAtStart.length);
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
      assert.deepStrictEqual(resultBlog.body, {
        ...blogToView,
        user: blogToView.user.toString(),
      });
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
      const blogsAtStart = await helper.blogsInDb();
      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };

      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      assert(titles.includes("Canonical string reduction"));

      const users = blogsAtEnd.map((blog) => blog.user.toString());
      assert(users.includes(loginResponse.body.id));
    });

    test("the likes property of a new blog defaults to 0 if it is added without the property", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };

      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
      const recentlyAddedBlog = blogsAtEnd.find(
        (blog) => blog.title === newBlog.title
      );
      assert.strictEqual(recentlyAddedBlog.likes, 0);
    });

    test("fails with statuscode 400 and appropriate message if a blog without the title or url properties is added", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };

      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      const newBlog = {
        url: "https://www.google.com",
        author: "Dooly",
        likes: 11,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400, { error: "content missing" });

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with statuscode 401 and appropriate message if token is missing", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const newBlog = {
        title: "Important notes about dinosaurs",
        url: "https://www.google.com",
        author: "Dooly",
        likes: 37,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401, { error: "token invalid" });

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
  });

  describe("deletion of a blog", async () => {
    test("succeeds with status code 204 if logged in user and id are valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };
      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((blog) => blog.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };
      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      const validNonexistingId = await helper.nonExistingId();

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const loginInfo = {
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      };
      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      const invalidId = "5a3d5da59070081a82a3445";

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 and appropriate message if authentication token is missing", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401, { error: "token invalid" });

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 and appropriate message if the logged in user and the blog creator are not the same", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

      const loginInfo = {
        username: "root",
        password: "Q1w2e3r4!",
      };

      const loginResponse = await api.post("/api/login").send(loginInfo);
      const authToken = loginResponse.body.token;

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(401, {
          error: "a note can be deleted only by the user who created it",
        });

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
  });

  describe("update of a blog", () => {
    test("succeeds with statuscode 200", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blogToUpdate = {
        ...blogsAtStart[0],
        title: "haha",
        likes: -1000,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const titles = blogsAtEnd.map((blog) => blog.title);
      assert(titles.includes("haha"));

      const likes = blogsAtEnd.map((blog) => blog.likes);
      assert(likes.some((like) => like === -1000));
    });

    test("the likes property of a new blog defaults to 0 if it is added without the property", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blogToUpdate = {
        ...blogsAtStart[0],
        title: "haha",
      };
      delete blogToUpdate.likes;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const likes = blogsAtEnd.map((blog) => blog.likes);
      assert.strictEqual(
        likes.some((like) => like === 0),
        true
      );
    });

    test("fails with statuscode 400 if a blog without the title or url properties is updated", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blogToUpdate = {
        ...blogsAtStart[0],
      };
      // delete blogToUpdate.title;
      delete blogToUpdate.url;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.deepStrictEqual(blogsAtEnd[0], blogsAtStart[0]);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
