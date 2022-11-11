const blogRouter = require("express").Router();
require("../authentication/passport");
const passport = require("passport");
const authorize = require("../authentication/authorize");
const blogController = require("../controllers/blogs.controllers");

blogRouter
	.route("/")
	.get(blogController.getAllBlogs);
blogRouter
	.route("/getblog")
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
	.route("/")
	.post(blogController.newBlog);

// blogRouter.use("/myblogs", authorize);

blogRouter
	.route("/myblogs")
	.get(blogController.getMyBlogs);

blogRouter.use("/myblogs/:id", authorize);
blogRouter
	.route("/myblogs/:id")
	.get(blogController.getMyBlogById)
	.put(blogController.editBlog)
	.patch(blogController.updateState)
	.delete(blogController.deleteBlog);

module.exports = blogRouter;
