const blogRouter = require("express").Router();
require("../authentication/passport");
const passport = require("passport");
const authorize = require("../authentication/authorize");
const blogController = require("../controllers/blogs.controllers");
const {
	validateBlogMiddleWare,
} = require("../validations/validator");

blogRouter
	.route("/blogs")
	.get(blogController.getAllBlogs);
blogRouter
	.route("/blog")
	.get(blogController.getBlog);
blogRouter
	.route("/getblog/:id")
	.get(blogController.getBlogById);

blogRouter.use(
	"/",
	passport.authenticate("jwt", {
		session: false,
	})
);
blogRouter
	.route("/blogs")
	.post(
		validateBlogMiddleWare,
		blogController.newBlog
	);

// blogRouter.use("/myblogs", authorize);

blogRouter
	.route("/myblogs")
	.get(blogController.getMyBlogs);

blogRouter.use("/myblogs/:id", authorize);
blogRouter
	.route("/myblogs/:id")
	.get(blogController.getMyBlogById)
	.put(blogController.editBlog)
	.patch(blogController.updateBlog)
	.delete(blogController.deleteBlog);

module.exports = blogRouter;
