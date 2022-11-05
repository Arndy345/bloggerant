const Blogs = require("../model/blog.model");
const blogRouter = require("express").Router();
require("../authentication/passport");
const passport = require("passport");
const User = require("../model/users.model");
const blogController = require("../controllers/blogs.controllers");
const authorize = require("../authentication/authorize");
blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get(
	"/getblog",
	blogController.getBlog
);

blogRouter.post(
	"/",
	passport.authenticate("jwt", {
		session: false,
	}),
	blogController.newBlog
);
blogRouter.patch(
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
