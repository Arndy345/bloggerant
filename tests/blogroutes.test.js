// const app = require("../index");
// const listHelper = require("../utils/helper");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const api = supertest(app);
const User = require("../model/users.model");
const blogController = require("../controllers/blogs.controllers");
const Blog = require("../model/blog.model");
require("../db/connection");

let token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNjUxOWNmZWFhZTNkMjkyOWVlNWYxNyIsImVtYWlsIjoibm9uc28xIn0sImlhdCI6MTY2NzU4OTk5NSwiZXhwIjoxNjY3NTkzNTk1fQ.wunG3KnEKOPMp6asqAVaVp4IQk4WPk0KFaac38BW6ug";
// const headers = {
// 	Authorization: `Bearer ${token}`,
// };
// const login = async (username) => {
// 	const response = await api
// 		.post("/users/login")
// 		.send({
// 			email: username,
// 			password: "1234",
// 		});

// 	token = response.body.token;
// };
const initialUser = [
	{
		firstName: "Alex",
		lastName: "Sule",
		email: "nonso1",
		passWord: "1234",
	},
	{
		firstName: "Andrew",
		lastName: "Sule",
		email: "nonso2",
		passWord: "1234",
	},
];
const blogPost = {
	title: "ayanna",
	body: "contracts, transactions, and the records of them are among the defining structures in our economic, legal, and political systems. They protect assets and set organizational boundaries. They establish and verify identities and chronicle events. They govern interactions among nations, organizations, communities, and individuals. They guide managerial and social action. And yet these critical tools and the bureaucracies formed to manage them have not kept up with the economy’s digital transformation. They’re like a rush-hour gridlock trapping a Formula 1 race car. In a digital world, the way we regulate and maintain administrative control has to change.",
	state: "published",
};

// beforeEach(async () => {
// 	// await User.deleteMany({});
// 	let noteObject = new User(initialUser[0]);
// 	await noteObject.save();
// const user = await User.findOne({
// 	email: "nonso1",
// });
// 	// console.log(user);
// 	// await Blog.deleteMany({});
// blogPost.author = user._id;
// 	// console.log(blogPost.author);
// let noteBlog = new Blog(blogPost);
// 	// console.log(noteBlog);
// await noteBlog.save();
// 	// let noteObject1 = new User(initialUser[1]);
// 	// await noteObject1.save();
// });
// beforeAll(() => {});
// it("CREATES NEW USERS", async () => {
// 	return request(app)
// 		.post("/users/signup")
// 		.send
// 		// {
// 		// 	firstName: "odiwee",
// 		// 	passWord: "1234",
// 		// 	lastName: "admin",
// 		// 	email: "nonso1",
// 		// },
// 		// {
// 		// 	firstName: "andrew",
// 		// 	passWord: "1234",
// 		// 	lastName: "user",
// 		// 	email: "nonso2",
// 		// }
// 		()
// 		.then((res) => {
// 			expect(res.status).toBe(404);
// 			// expect(res.body.user).toBeDefined();
// 		});
// });
// it("GETS ALL USERS", async () => {
// 	return request(app)
// 		.get("/users")

// 		.then((res) => {
// 			// console.log(res);
// 			expect(res).toBeDefined();
// 			expect(res.status).toBe(200);
// 		});
// });
test("Tests login route and returns a user token", async () => {
	const userDetails = {
		email: "nonso1",
		passWord: "1234",
	};
	const response = await api
		.post("/users/login")
		.send(userDetails)
		.expect(200);

	token = response.body.token;
	// console.log(token);
	// expect(response.body.token).toBeDefined();
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
describe("Get blog route", () => {
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

	test("TRIES TO GET AN UNPUBLISHED BLOG", async () => {
		// const id = "636519cfeaae3d2929ee5f1b"

		// const request = await api("/blogs/getblog")
		const query = {
			id: "636519cfeaae3d2929ee5f1b",
		};

		req = {
			query,
		};
		res = {
			status(status) {
				expect(status).toBe(400);
			},
			json(data) {
				expect(data.status).toBe(false);
			},
		};

		await blogController.getBlog(req, res);
	});
	test("GETS A SINGLE PUBLISHED BLOG", async () => {
		// const id = "636519cfeaae3d2929ee5f1b"

		// const request = await api("/blogs/getblog")
		const query = {
			id: "63656117984bde937d593e47",
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
	//FAILS BECAUSE OF USERS AND BLOGS NOT LINKED CORRECTLY
	test("gets blogs of a particular user", async () => {
		// login("nonso1");
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
});
test("FAILS TO GET BLOGS AS WRONG TOKEN IS PASSED ", async () => {
	// login("nonso1");
	const token = "ndkehlwejknjkdjkwj";
	const page = 3;
	const response = await api
		.get(`/blogs/myblogs/?${page}`)
		.set("Authorization", `Bearer ${token}`)
		.expect(401);
	// console.log(response.body);
	expect(response.body).toEqual({});
});

test("UPDATE STATE OF BLOG", async () => {
	const id = "636519cfeaae3d2929ee5f1b";
	const response = await api
		.patch(`/blogs/${id}`)
		.set("Authorization", `Bearer ${token}`)
		.expect(200);

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

//DO THIS ONE LATER
//PASS IN AM ID FROM A DIFFERENT AUTHOR
test("UPDATE STATE OF BLOG FAILS DUE WRONG AUTHORIZATION", async () => {
	const id = "636519cfeaae3d2929ee5f2b";
	const response = await api
		.patch(`/blogs/${id}`)
		.set("Authorization", `Bearer ${token}`)
		.expect(401);

	expect(response.body.message).toBe(
		"Bad request"
	);
});

test("DELETE BLOG", async () => {
	const id = "636519cfeaae3d2929ee5f1b";
	const response = await api
		.delete(`/blogs/${id}`)
		.set("Authorization", `Bearer ${token}`)
		.expect(200);

	expect(response.body.message).toBe("Deleted");
});

test("WRONG USER TRIES TO DELETE BLOG", async () => {
	const id = "636519cfeaae3d2929ee5f1b";
	const response = await api
		.delete(`/blogs/${id}`)
		.set("Authorization", `Bearer ${token}`)
		.expect(401);

	expect(response.body.message).toBe(
		"Unauthorized"
	);
});

afterAll(() => {
	mongoose.connection.close();
});
