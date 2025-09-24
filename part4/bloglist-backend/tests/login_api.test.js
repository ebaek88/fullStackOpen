const assert = require("node:assert");
const { test, describe, beforeEach, after } = require("node:test");
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
		await User.deleteOne({ username: "test" });

		const passwordHash = await bcrypt.hash("bbcBbc998&", 10);
		const newUser = new User({
			username: "test",
			name: "Test User",
			passwordHash,
		});

		await newUser.save();
	});

	describe("logging in", () => {
		test("log in successfully with valid username and password", async () => {
			const loginInfo = {
				username: "test",
				password: "bbcBbc998&",
			};

			const afterLogin = await api
				.post("/api/login")
				.send(loginInfo)
				.expect(200)
				.expect("Content-Type", /application\/json/);

			assert(afterLogin.body.token);
			assert.strictEqual(afterLogin.body.username, loginInfo.username);
		});

		test("fails with status code 401 and appropriate message if login info is wrong", async () => {
			const loginInfo = {
				username: "test",
				password: "wrongPassword!123",
			};

			await api
				.post("/api/login")
				.send(loginInfo)
				.expect(401, { error: "invalid username or password" })
				.expect("Content-Type", /application\/json/);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
