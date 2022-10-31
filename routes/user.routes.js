// const { model } = require("mongoose");
const userModel = require("../model/users.model.js");
const userController = require("../controllers/users.controller");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../authentication/passport");

const userRouter = require("express").Router();

userRouter.get("/", userController.getUsers);

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
userRouter.post(
	"/signup",
	passport.authenticate("signup", {
		session: false,
	}),
	async (req, res, next) => {
		res.json({
			message: "Signup successful",
			user: req.user,
		});
	}
);

userRouter.post("/login", (req, res, next) => {
	passport.authenticate(
		"login",
		async (err, user, info) => {
			try {
				if (err || !user) {
					console.log(err, user);
					const error = new Error(
						"An error occurred"
					);
					return next(error);
				}

				req.login(
					user,
					{ session: false },
					async (error) => {
						if (error) return next(error);

						const body = {
							_id: user._id,
							userName: user.userName,
						};
						const token = jwt.sign(
							{ user: body },
							process.env.JWT_SECRET
						);

						return res.json({ token });
					}
				);
			} catch (error) {
				return next(error);
			}
		}
	)(req, res, next);
});
module.exports = userRouter;
