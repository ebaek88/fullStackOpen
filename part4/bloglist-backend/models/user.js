const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	// username should be at least 3 characters long and at most 20 characters long.
	// username should also be in alphanumeric characters only, and it should start with alphabets.
	username: {
		type: String,
		minLength: [3, "The username should be at least 3 characters long!"],
		maxLength: [20, "The username cannot be more than 20 characters long!"],
		validate: {
			validator: (v) => {
				return /^([a-zA-Z]{1})([a-zA-Z0-9]{2,20})$/.test(v);
			},
			message: (props) => `${props.value} is not a valid username!`,
		},
		required: [true, "Username required!"],
		unique: true, // this ensures the uniqueness of username
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should NOT be revealed
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
