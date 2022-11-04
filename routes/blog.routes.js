const Blogs = require("../model/blog.model");
const blogRouter = require("express").Router();
require("../authentication/passport");
const passport = require("passport");
const User = require("../model/users.model");
const blogController = require("../controllers/blogs.controllers");
const authorize = require("../authentication/authorize");
blogRouter.get(
	"/",
	blogController.getAllBlogs
);
blogRouter.get(
	"/getblog",
	blogController.getBlog
);

blogRouter.post(
	"/",
	passport.authenticate("jwt", {
		session: false,
	}),
	async (req, res) => {
		const body = req.body;

		const author = req.user.id;
		body.author = author;
		const wordCount = body.body.split(" ").length;
		body.readingTime = ((wordCount) => {
			return Math.round((wordCount / 200) * 60);
		})(wordCount);

		const user = await User.findById(author);

		const blog = await Blogs.create(body);

		user.blogs = user.blogs.concat(blog._id);
		await user.save();
		// console.log(user.blogs);
		res.json({ status: true, blog });
	}
);
blogRouter.post(
	"/editblog/:id",
	passport.authenticate("jwt", {
		session: false,
	}),
	blogController.editBlog
);

blogRouter.patch(
	"/:id",
	passport.authenticate("jwt", {
		session: false,
	}),
	blogController.updateState
);

blogRouter.delete(
	"/:id",
	passport.authenticate("jwt", {
		session: false,
	}),
	blogController.deleteBlog
);

blogRouter.get(
	"/myblogs",
	passport.authenticate("jwt", {
		session: false,
	}),
	blogController.getMyBlogs
);
module.exports = blogRouter;
