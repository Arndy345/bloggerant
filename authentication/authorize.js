const Blogs = require("../model/blog.model");

const authorize = async (req, res, next) => {
	const author = req.user.id;
	const { id } = req.params;
	try {
		const blog = await Blogs.findOne({ _id: id });

		if (!blog) {
			res.status(404).send({ status: false });
			return;
		}
		const blogId = blog.author.valueOf();

		if (blogId === author) {
			next();
		} else {
			res.status(401);
			res.send("Unauthorised");
		}
	} catch (err) {
		res.status(400);
		// console.log(err);
		next(err);
	}
};

module.exports = authorize;
