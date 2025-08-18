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
    const user = new User({ username: "root", passwordHash });

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
      // console.log(usersAtEnd);
      const usernames = usersAtEnd.map((user) => user.username);
      assert(usernames.includes(newUser.username));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
