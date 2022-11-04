const Blogs = require("../model/blog.model");
const Users = require("../model/users.model");
const mongoose = require("mongoose");

const getAllBlogs = async (req, res) => {
	const { author, title, tags } = req.query;
	const queryParam = req.body || {
		state: "published",
	};

	if (author) queryParam.author = author;
	if (title) queryParam.title = title;

	// console.log(queryParam);
	const blogs = await Blogs.find(queryParam);
	// .populate({
	// 	path: "author",
	// 	select: "author",
	// 	match: { title: title },
	// });
	// .match("title", title);
	// console.log(blogs[0].blogs[0].title);
	return res.json({ status: true, blogs });
};

//LOGGED IN AND NON LOGGED IN USERS GET PUBLISHED BLOG
const getBlog = async (req, res) => {
	const { query } = req;
	const { title, id } = query;
	// console.log(title, id);
	const queryParam = {};

	if (title) queryParam.title = title;
	if (id) queryParam._id = id;

	// console.log(queryParam);
	try {
		const blog = await Blogs.findOne(
			queryParam
		).populate("author");
		// console.log(blog);
		if (!blog) {
			res.status(404).send({ status: false });
			return;
		}

		if (blog.state !== "published") {
			// console.log("HERE");
			res.status(400);
			res.json({
				status: false,
				message: "NOT FOUND",
			});
			return;
		}
		blog.readCount = blog.readCount + 1;
		await blog.save();

		res.status(200);
		res.json({ status: true, blog });
		return;
	} catch (err) {
		// console.log(err, "HERE");
		res.status(400);
		res.json({ status: false });
		return;
	}
};

const editBlog = async (req, res) => {
	const { id } = req.params;
	const { title } = req.query;
	console.log(title);
	const author = req.user.id;
	const { body } = req.body;
	console.log(body);
	let blog;
	if (title) {
		blog = await Blogs.find({ title });
	}
	blog = await Blogs.findById(id);
	const blogId = blog.author.valueOf();
	if (author === blogId) {
		blog.body = body;
		blog.save();
		res.send(blog);
	} else {
		res.status(401).send("Unauthorized");
	}
};

const updateState = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	const author = req.user.id;
	try {
		const blog = await Blogs.findById(id);

		const blogId = blog.author.valueOf();
		if (blogId === author) {
			blog.state = "published";
			blog.save();
			res
				.status(200)
				.json({ status: true, blog });
		} else {
			res.status(401).send("Unauthorised");
		}
	} catch (err) {
		res.status(400);
		res.json({
			status: false,
			message: "Bad request",
		});
		return;
	}
};

const deleteBlog = async (req, res) => {
	const { id } = req.params;
	const author = req.user.id;
	try {
		const blog = await Blogs.findById(id);
		// console.log(blog);
		const blogId = blog.author.valueOf();
		if (author === blogId) {
			Blogs.deleteOne(
				{ _id: id },
				function (err) {
					if (err) return res.send(err);
					res.status(200);
					res.json({
						status: true,
						message: "Deleted",
					});
				}
			);
			return;
		} else {
			res.status(401);
			res.json({
				status: false,
				message: "Unauthorized",
			});
			return;
		}
	} catch (error) {
		res.status(400).send("Bad request");
	}
};

const getMyBlogs = async (req, res) => {
	const author = req.user.id;
	// console.log(author);
	const _id = mongoose.Types.ObjectId(author);
	// console.log(_id);
	const { state, page, sortBy, orderBy } =
		req.query;
	const p = page || 1;
	const limit = 20;
	let blogsPerPage = (p - 1) * limit;

	const findQuery = { _id };
	const sort = {};
	if (sortBy && orderBy) {
		sort[sortBy] = orderBy === "asc" ? 1 : -1;
	}
	let blog;
	if (state) {
		blog = await Users.findOne(
			findQuery
		).populate({
			path: "blogs",
			match: { state },
			select: "title description -_id",
			options: {
				limit: limit,
				skip: blogsPerPage,
				sort,
			},
		});
	} else {
		blog = await Users.findOne(
			findQuery
		).populate({
			path: "blogs",
			select: "title description -_id",
			options: {
				limit: limit,
				skip: blogsPerPage,
				sort,
			},
		});
		// console.log(blog);
	}

	if (blog.blogs.length != 0) {
		res.status(200);
		res.json({ status: true, blog: blog.blogs });
	} else {
		res.status(404).send("No Blogs created");
		return;
	}
};

module.exports = {
	updateState,
	deleteBlog,
	getMyBlogs,
	getBlog,
	getAllBlogs,
	editBlog,
};
