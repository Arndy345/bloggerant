const Blogs = require("../model/blog.model");
const Users = require("../model/users.model");
const mongoose = require("mongoose");

const getAllBlogs = async (req, res) => {
	const queryParam = {
		state: "published",
	};
	const {
		page = 1,
		limit = 20,
		sortBy,
		author,
		title,
		tags,
	} = req.query;
	const { orderBy } = req.query || "asc";
	const p = page || 1;
	// const limit = 20;
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
			res.send("Blog Not Found");
			return;
		}

		res.json({ status: true, blogs });
	} catch (err) {
		console.log(err);
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
			res.status(404).send({
				status: false,
				message: "Blog not found",
			});
			return;
		}

		if (blog.state !== "published") {
			res.status(404);
			res.json({
				status: false,
				message: "Blog not found",
			});
			return;
		}
		blog.readCount = blog.readCount + 1;
		await blog.save();

		res.status(200);
		res.json({ status: true, blog });
		return;
	} catch (err) {
		res.status(400);
		res.json({
			status: false,
		});
		return;
	}
};

const getBlogById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const blog = await Blogs.findOneAndUpdate(
			{ _id: id, state: "published" },
			{ $inc: { readCount: 1 } },
			{ new: true }
		).populate({
			path: "author",
			select: "-email -blogs",
		});
		if (!blog) {
			res.status(404);
			res.json({
				status: false,
				message: "Blog not found",
			});
			return;
		}
		res.status(200);
		res.json(blog);
		return;
	} catch (err) {
		next(err);
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
	const { title, description, body, tags } =
		req.body;

	await Blogs.findByIdAndUpdate(
		{ _id: id },
		{
			title,
			description,
			body,
			$push: { tags: tags },
		},
		{ new: true }
	);
	return res.status(201).json({
		message: "Blog successfully updated",
	});
};

const updateState = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blogs.findOneAndUpdate(
			{
				_id: id,
				state: "draft",
			},
			{ $set: { state: "published" } },
			{ new: true }
		).select("state title description -_id");
		if (!blog) {
			res.status(400);
			res.send("Blog published already");
			return;
		}

		res.status(200).json({
			message: "Blog state successfully updated",
			blog,
		});
	} catch (err) {
		next();
	}
};

const deleteBlog = async (req, res) => {
	const { id } = req.params;

	try {
		Blogs.deleteOne({ _id: id }, function (err) {
			if (err) return res.send(err);
			res.status(200);
			res.json({
				status: true,
				message: "Deleted",
			});
		});
		return;
	} catch (error) {
		next();
	}
};
const getMyBlogs = async (req, res) => {
	const author = req.user.id;
	const _id = mongoose.Types.ObjectId(author);

	const {
		state,
		page = 1,
		limit = 20,
		sortBy,
		orderBy,
	} = req.query;

	// console.log(state);
	const p = page;
	// const limit = 20;
	let blogsPerPage = (p - 1) * limit;

	// const findQuery = { _id };
	const sort = {};
	if (sortBy && orderBy) {
		sort[sortBy] = orderBy === "asc" ? 1 : -1;
	}
	let blog;
	try {
		if (state) {
			blog = await Blogs.find({
				author: _id,
				state: state,
			})
				.select("title description state")
				.limit(limit)
				.skip(blogsPerPage)
				.sort(sort);
		} else {
			blog = await Blogs.find({
				author: _id,
			})
				.select("title description state")
				.limit(limit)
				.skip(blogsPerPage)
				.sort(sort);
		}
		// console.log(blog);
		if (blog.length != 0) {
			res.status(200);
			res.json({
				status: true,
				blog: blog,
			});
		} else {
			res.status(404).send("No Blogs created");
			return;
		}
	} catch (error) {
		next(error);
	}
};
const getMyBlogById = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blogs.findOneAndUpdate(
			{ _id: id },
			{ $inc: { readCount: 1 } },
			{ new: true }
		);
		if (!blog) {
			res.status(404);
			res.json({ status: false });
			return;
		}

		res.status(200);
		res.json({ status: true, blog });
		return;
	} catch (err) {
		next(err);
	}
};

module.exports = {
	updateState,
	deleteBlog,
	getMyBlogs,
	getMyBlogById,
	getBlog,
	getAllBlogs,
	editBlog,
	newBlog,
	getBlogById,
};
