const Blogs = require("../model/blog.model");

const authorize = async (req, res, next) => {
	const id = req.user.id;
	try {
		const author = Blogs.find({ author: id });
		console.log(author);
		next();
	} catch (err) {
		next(err);
	}
};
module.exports = authorize;
