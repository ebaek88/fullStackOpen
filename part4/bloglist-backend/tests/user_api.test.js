const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app.js");
const helper = require("./test_helper.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const api = supertest(app);
console.log("Test DB URI: ", process.env.TEST_MONGODB_URI);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("Q1w2e3r4!", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      passwordHash,
    });

    await user.save();
  });

  describe("creation of a new user", () => {
    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "user123",
        name: "Go Gildong",
        password: "jWxqyPzy7$",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((user) => user.username);
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "another superuser",
        password: "qtjmlT^892",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected 'username' to be unique"));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper status code and message if username is not met with validation", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        // username: "9obiwan",
        // username: "uu",
        username: "obiwan999999888888777",
        name: "Jedi",
        password: "Yoda4ever~",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("long") ||
          result.body.error.includes("valid")
      );
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password is not met with validation", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "abc12345",
        name: "User",
        password: "Salaien!",
        // password: "Salainen1234",
        // password: "salainen1234!",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("The password did not meet the condition!")
      );
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  describe("retrieval of users", () => {
    test("successfully obtains existing users", async () => {
      const users = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const usernames = users.body.map((user) => user.username);
      assert(usernames.includes("root"));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
