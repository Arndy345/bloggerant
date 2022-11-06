const Blogs = require("../model/blog.model");
const Users = require("../model/users.model");
const mongoose = require("mongoose");

const getAllBlogs = async (req, res) => {
	const queryParam = {
		state: "published",
	};
	const { page, sortBy, author, title, tags } =
		req.query;
	const { orderBy } = req.query || "asc";
	const p = page || 1;
	const limit = 20;
	let blogsPerPage = (p - 1) * limit;

	const sort = {};
	if (sortBy && orderBy) {
		sort[sortBy] = orderBy === "asc" ? 1 : -1;
	}

	if (author) queryParam.author = author;
	if (title) queryParam.title = title;
	// if (tags) {
	// 	const searchTag = Array.isArray(tags)
	// 		? tags
	// 		: tags.split(", ") || tags.split(",");
	// 	console.log(searchTag);
	// }

	// if (tags) {
	// 	console.log("here");

	// 	const blogs = await Blogs.find({
	// 		$and: [
	// 			{ tags: { $in: searchTag } },
	// 			{ state: { $in: "published" } },
	// 		],
	// 	})
	// 		.select("title description  author -_id")
	// 		.limit(limit)
	// 		.skip(blogsPerPage)
	// 		.sort(sort);
	// 	// console.log(blogs);
	// 	if (blogs.length === 0) {
	// 		res.status(404);
	// 		res.send("Not Found");
	// 		return;
	// 	}

	// 	return res.json({ status: true, blogs });
	// }
	try {
		const blogs = await Blogs.find(queryParam)
			.select("title description  author -_id")
			.limit(limit)
			.skip(blogsPerPage)
			.sort(sort);

		if (blogs.length === 0) {
			res.status(404);
			res.send("Not Found");
			return;
		}

		res.json({ status: true, blogs });
	} catch (err) {
		return res.status(400);
	}
};

//LOGGED IN AND NON LOGGED IN USERS GET PUBLISHED BLOG
const getBlog = async (req, res) => {
	const { query } = req;
	const { title, id } = query;
	const queryParam = {};

	if (title) queryParam.title = title;
	if (id) queryParam._id = id;

	try {
		const blog = await Blogs.findOne(
			queryParam
		).populate({
			path: "author",
			select: "firstName lastName -_id",
		});

		if (!blog) {
			res.status(404).send({ status: false });
			return;
		}

		if (blog.state !== "published") {
			res.status(404);
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
		// console.log(err);
		res.status(400);
		res.json({ status: false });
		return;
	}
};

const getBlogById = async (req, res) => {
	const { params } = req;
	const { id } = params;
	const queryParam = {};

	if (id) queryParam._id = id;

	try {
		const blog = await Blogs.findOne(
			queryParam
		).populate({
			path: "author",
			select: "firstName lastName -_id",
		});

		if (!blog) {
			res.status(404).send({ status: false });
			return;
		}

		if (blog.state !== "published") {
			res.status(404);
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
		// console.log(err);
		res.status(400);
		res.json({ status: false });
		return;
	}
};
const newBlog = async (req, res) => {
	const body = req.body;

	const author = req.user.id;
	body.author = author;

	const wordCount = body.body.split(" ").length;
	body.readingTime = ((wordCount) => {
		return Math.round((wordCount / 200) * 60);
	})(wordCount);

	try {
		const user = await Users.findById(author);

		const blog = await Blogs.create(body);

		user.blogs = user.blogs.concat(blog._id);
		await user.save();
		res.status(201);
		res.json({ status: true, blog });
	} catch (err) {
		res.status(400);
		res.send("Bad request");
	}
};
//WORK ON THIS
const editBlog = async (req, res) => {
	const { id } = req.params;
	const { title } = req.query;
	const author = req.user.id;
	const { body } = req.body;
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
			res.status(401).send("Unauthorized");
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
		// console.log("here");
		res.status(400).send("Bad request");
		return;
	}
};

const getMyBlogs = async (req, res) => {
	const author = req.user.id;
	// console.log(author);
	const _id = mongoose.Types.ObjectId(author);
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
	newBlog,
	getBlogById,
};
