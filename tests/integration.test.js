const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("../utils/helper");
const User = require("../model/users.model");
const Blog = require("../model/blog.model");
const blogController = require("../controllers/blogs.controllers");
const connectDB = require("../db/connection");
jest.setTimeout(50000);
let token;
let id;

const generateToken = async () => {
	let token;
	const userDetails = {
		email: "andrew@gmail.com",
		passWord: "Password2",
	};

	const response = await api
		.post("/login")
		.send(userDetails)
		.then((res) => {
			expect(res.body.token).toBeDefined();
			expect(res.status).toBe(200);
			token = res.body.token;
		});
	console.log(token);
	return token;
};
const createBlog = async () => {
	const token = await generateToken();

	let blog;
	const response = await api
		.post(`/blogs/`)
		.send(helper.newBlog)
		.set("Authorization", `Bearer ${token}`)
		// .expect(201)
		.then((res) => {
			// expect(res.body.status).toBe(true);
			blog = res.body.blog;
		});
	return blog;
};

beforeAll(async () => {
	await connectDB();
	await User.deleteMany({});
	Blog.deleteMany({});

	const userObject = helper.initialUsers.map(
		(user) => new User(user)
	);
	const promiseArray = userObject.map((user) =>
		user.save()
	);
	await Promise.all(promiseArray);

	const user = await User.findOne({
		email: "nonso@gmail.com",
	});
	await Blog.deleteMany({});
	helper.initialBlogs.map(
		(blog) => (blog.author = user._id)
	);

	const blogObject = helper.initialBlogs.map(
		(blog) => new Blog(blog)
	);
	const blogArray = blogObject.map((blog) =>
		blog.save()
	);
	await Promise.all(blogArray);

	user.blogs = blogObject.map((blog) => {
		return user.blogs.concat(blog._id);
	});

	await user.save();

	id = user._id;
});

describe("TESTS THE USER LOGIN AND SIGNUP ROUTES", () => {
	test("Tests login route and returns a user token", async () => {
		const userDetails = {
			email: "nonso@gmail.com",
			passWord: "Password",
		};
		const response = await api
			.post("/login")
			.send(userDetails)
			.then((res) => {
				expect(res.body.token).toBeDefined();
				expect(res.status).toBe(200);
				token = res.body.token;
				// console.log(token);
			});
	});

	test("CREATES A NEW USER SUCCESSFULLY", async () => {
		const response = await api
			.post("/signup")
			.send(helper.newUser)
			.then((res) => {
				expect(res.status).toBe(200);
				expect(res.body.user).toBeDefined();
			});
	});
	test("FAILS TO CREATE A USER DUE TO DUPLICATE", async () => {
		const response = await api
			.post("/signup")
			.send(helper.newUser)
			.then((res) => {
				// console.log(res);
				expect(res.status).toBe(500);
				expect(res.body.user).toBeUndefined();
			});
	});
	test("ALL USERS ARE RETURNED", async () => {
		const title = "";
		const id = "";

		//ADD QUERIES
		const response = await api
			.get("/users")

			.then((res) => {
				expect(res).toBeDefined();
				expect(res.status).toBe(200);
			});
	});
});

describe("TESTS ALL THE BLOG ROUTES", () => {
	test("all blogs are returned", async () => {
		const queryParam = { state: "published" };
		const result = await api
			.get("/blogs/")
			.send(queryParam)
			.expect(200)
			.expect(
				"Content-Type",
				/application\/json/
			);

		expect(result.body.status).toBe(true);
	});
	test("GETS A SINGLE PUBLISHED BLOG", async () => {
		const blog = await Blog.findOne({
			state: "published",
		});
		const id = blog._id;
		const query = {
			id,
		};

		req = {
			query,
		};
		res = {
			status(status) {
				// console.log(status);
				expect(status).toBe(200);
			},
			json(data) {
				// console.log(data);
				expect(data.status).toBe(true);
			},
		};

		await blogController.getBlog(req, res);
	});
	test("TRIES TO GET AN UNPUBLISHED BLOG BUT FAILS", async () => {
		const blog = await Blog.findOne({
			state: "draft",
		});
		const id = blog._id;
		const query = {
			id,
		};

		req = {
			query,
		};
		res = {
			status(status) {
				// console.log(status);
				expect(status).toBe(404);
			},
			json(data) {
				// console.log(data);
				expect(data.status).toBe(false);
			},
		};

		await blogController.getBlog(req, res);
	});
	test("TRIES TO GET A  BLOG THAT DOESNT EXIST", async () => {
		// const blog = await Blog.findOne({
		// 	state: "draft",
		// });
		const id = "636798cbf05c3bf8fa28318f";
		const query = {
			id,
		};

		req = {
			query,
		};
		res = {
			status(status) {
				// console.log(status);
				expect(status).toBe(400);
			},
			json(data) {
				// console.log(data);
				expect(data.status).toBe(false);
			},
		};

		await blogController.getBlog(req, res);
	});

	test("gets blogs of a particular user", async () => {
		// await generateToken();
		// console.log(token);
		const page = 3;
		const state = "published";
		const orderBy = "asc";
		const sortBy = "timestamps";
		const response = await api
			.get(
				`/blogs/myblogs/?${page}&${state}&${orderBy}&${sortBy}`
			)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body).toBeDefined();
	});
	test("MY BLOG BY ID", async () => {
		// const queryParam = { state: "published" };
		const token = await generateToken;
		const blog = await createBlog();
		const result = await api
			.get(`/blogs/myblog/${blog._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.expect(
				"Content-Type",
				/application\/json/
			);

		expect(result.body.status).toBe(true);
	});
	test("tries to get blogs of user with no blogs created", async () => {
		let token = await generateToken();
		const page = 3;
		const state = "published";
		const orderBy = "asc";
		const sortBy = "timestamps";
		const response = await api
			.get(
				`/blogs/myblogs/?${page}&${state}&${orderBy}&${sortBy}`
			)
			.set("Authorization", `Bearer ${token}`)
			.expect(404);

		expect(response.text).toBe(
			"No Blogs created"
		);
	});

	test("FAILS TO GET BLOGS AS WRONG TOKEN IS PASSED ", async () => {
		const token = await generateToken();
		// console.log(token);
		const page = 3;
		const response = await api
			.get(`/blogs/myblogs/?${page}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(401);

		expect(response.body).toEqual({});
	});

	test("UPDATE STATE OF BLOG", async () => {
		const blog = await Blog.findOne({
			state: "draft",
		});
		const id = blog._id;
		const response = await api
			.patch(`/blogs/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body.message).toBe(
			"Blog state successfully updated"
		);
		expect(response.body.blog.state).toBe(
			"published"
		);
	});
	test("UPDATE STATE OF BLOG FAILS DUE WRONG ID", async () => {
		const id = "636519cfeaae3d2929ee5f2b";
		const response = await api
			.patch(`/blogs/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(400);

		expect(response.body.message).toBe(
			"Bad request"
		);
	});
	test("UPDATE STATE OF BLOG FAILS DUE WRONG AUTHORIZATION", async () => {
		const token = await generateToken();
		const blog = await Blog.findOne({
			state: "published",
		});
		const response = await api
			.patch(`/blogs/${blog._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(401);

		expect(response.text).toBe("Unauthorized");
	});

	test("DELETE BLOG", async () => {
		const blog = await createBlog();
		const token = await generateToken();

		const response = await api
			.delete(`/blogs/${blog._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body.message).toBe("Deleted");
	});

	test("WRONG USER TRIES TO DELETE BLOG", async () => {
		const token = await generateToken();
		const blog = await Blog.findOne({
			author: id,
		});

		const response = await api
			.delete(`/blogs/${blog._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(401)
			.then((res) => {
				expect(res.body.status).toBe(false);
				expect(res.body.message).toBe(
					"Unauthorized"
				);
			});
	});
	test("TRIES TO DELETE A NON EXISTENT BLOG", async () => {
		const id = "636519cfeaae3d2929ee5f2b";
		const response = await api
			.delete(`/blogs/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(400);

		expect(response.text).toBe("Bad request");
	});
	test("TRIES TO CREATE A NEW BLOG", async () => {
		const token = await generateToken();
		const response = await api
			.post(`/blogs/`)
			.send(helper.newBlog)
			.set("Authorization", `Bearer ${token}`)
			.expect(201)
			.then((res) => {
				expect(res.body.status).toBe(true);
			});
	});
	test("TRIES TO CREATE A NEW BLOG WITHOUT TOKEN", async () => {
		let token;
		const response = await api
			.post(`/blogs/`)
			.send(helper.newBlog)
			.set("Authorization", `Bearer ${token}`)
			.expect(401)
			.then((res) => {
				expect(res.text).toBe("Unauthorized");
			});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
