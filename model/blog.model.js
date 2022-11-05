const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const readingTime = require("../utils/readingAlgo");

const blogSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: String,
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		state: {
			type: String,
			default: "draft",
			enum: ["draft", "published"],
		},
		readCount: {
			type: Number,
			default: 0,
		},
		readingTime: Number,
		tags: [String],
		body: {
			required: true,
			type: String,
		},
	},
	{ timestamps: true }
);

// calculate reading time before saving document
blogSchema.pre("save", function (next) {
	let blog = this;

	// do nothing if the article body is unchanged
	if (!blog.isModified("body")) return next();

	// calculate the time in minutes
	const readTime = readingTime(this.body);

	blog.readingTime = readTime;
	next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
