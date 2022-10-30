const Schema = require("mongoose").Schema;

const blogSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: String,
	author: String,
	state: String,
	read_count: String,
	reading_time: String,
	tags: String,
	body: {
		required: true,
		type: String,
	},
	timestamp: String,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
