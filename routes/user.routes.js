const userController = require("../controllers/users.controller");
const passport = require("passport");

const {
	signup,
	login,
} = require("../controllers/users.controller");
require("../authentication/passport");
const {
	validateUserSignup,
	validateUserLogin,
} = require("../validations/validator");

const userRouter = require("express").Router();

userRouter.get("/users", userController.getUsers);

userRouter.post(
	"/signup",
	validateUserSignup,
	passport.authenticate("signup", {
		session: false,
	}),
	signup
);
userRouter.post(
	"/login",
	validateUserLogin,
	login
);

// userRouter.post("/login", (req, res, next) => {
// 	passport.authenticate(
// 		"login",
// 		async (err, user, info) => {
// 			try {
// 				if (err || !user) {
// 					const error = new Error(
// 						"Wrong email/password"
// 					);
// 					return next(error);
// 				}

// 				req.login(
// 					user,
// 					{ session: false },
// 					async (error) => {
// 						if (error) return next(error);

// 						const body = {
// 							_id: user._id,
// 							email: user.email,
// 						};
// 						const token = jwt.sign(
// 							{ user: body },
// 							process.env.JWT_SECRET,
// 							{ expiresIn: "1h" }
// 						);

// 						return res.json({
// 							message: "login successful",
// 							token,
// 						});
// 					}
// 				);
// 			} catch (error) {
// 				console.log(error);
// 				next(error);
// 			}
// 		}
// 	)(req, res, next);
// });
module.exports = userRouter;
