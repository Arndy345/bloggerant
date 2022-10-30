const { model } = require("mongoose");
const userModel = require("../model/users.model");

const userRouter = require("express").Router();

userRouter.get("/", async (req, res) => {
	const user = await userModel.find({});
	console.log(user);
	res.send("Successful");
});

userRouter.post("/", async (req, res) => {
	const { firstName, lastName, email, passWord } =
		req.body;
	const user = await userModel.create({
		firstName,
		lastName,
		email,
		passWord,
	});
	console.log(user);
	res.send("Successful");
});

module.exports = userRouter;
