//! Instantiating users test parameters for users
const initialUsers = [
	{
		email: "nonso@gmail.com",
		firstName: "Joe",
		lastName: "Danny",
		passWord: "Password",
	},
	{
		email: "andrew@gmail.com",
		firstName: "Tuyo",
		lastName: "Jacob",
		passWord: "Password2",
	},
];

const newUser = {
	email: "nonsoandrew@gmail.com",
	firstName: "Tuyor",
	lastName: "David",
	passWord: "Password",
};

//! Instantiating users test parameters for blogs
const initialBlogs = [
	{
		title: "The gods must be crazy",
		description: "The gods must be crazy",
		tags: "movies",
		body: "The gods must be crazy talks about a tribe that has not been open to civilisation",
		state: "published",
	},
	{
		title: "The gods are  dead",
		description: "The gods are dead",
		owner: "John Doe",
		tags: "horror",
		body: "The gods are dead talks about a th belief of a certain community",
	},
	{
		title: "What a title",
		description: "The gods are dead",
		owner: "John Doe",
		tags: "horror",
		body: "The gods are dead talks about a th belief of a certain community",
		state: "published",
	},
];

const newBlog = {
	title: "A new blog",
	description: "The gods are dead",
	tags: "#movies",
	body: "The gods are dead talks about a th belief of a certain community",
};

module.exports = {
	initialUsers,
	newUser,
	initialBlogs,
	newBlog,
};
