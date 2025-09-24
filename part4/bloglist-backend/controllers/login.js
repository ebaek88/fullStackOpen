const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user.js");

loginRouter.post("/", async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		const passwordCorrect =
			user === null ? false : await bcrypt.compare(password, user.passwordHash);

		if (!(user && passwordCorrect)) {
			return res.status(401).json({ error: "invalid username or password" });
		}

		const userForToken = {
			username: user.username,
			id: user._id,
		};

		// token expires in n * 60 seconds
		const token = jwt.sign(userForToken, process.env.SECRET, {
			expiresIn: 2 * 60,
		});

		res.status(200).send({
			token,
			username: user.username,
			name: user.name,
			id: user._id.toString(),
		});
	} catch (err) {
		next(err);
	}
});

module.exports = loginRouter;
