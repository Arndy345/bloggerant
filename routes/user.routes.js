const userController = require("../controllers/users.controller");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../authentication/passport");

const userRouter = require("express").Router();

userRouter.get("/users", userController.getUsers);

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
					const error = new Error(
						"Wrong email/password"
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
							email: user.email,
						};
						const token = jwt.sign(
							{ user: body },
							process.env.JWT_SECRET,
							{ expiresIn: "1h" }
						);

						return res.json({
							message: "login successful",
							token,
						});
					}
				);
			} catch (error) {
				next(error);
			}
		}
	)(req, res, next);
});
module.exports = userRouter;
