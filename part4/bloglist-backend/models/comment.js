const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		// content is required. it can be at least 1 character long and at most 100 characters long.
		content: {
			type: String,
			minLength: [1, "Content should be at least 1 character long!"],
			maxLength: [100, "Content cannot be more than 100 characters long!"],
			required: [true, "Content required!"],
		},
		// likes for a comment: this is the future functionality
		likes: {
			type: Number,
			default: 0,
		},
		// blog: where the comment belongs to
		blog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
			required: true,
		},
		// user: who wrote the comment
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
); // automatically creates createdAt and updatedAt. Both in Date type.

commentSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
