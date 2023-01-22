const User = require("../model/users.model");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
	const user = await User.find({});
	res.status(200).send(user);
};

const signup = async (req, res, next) => {
	res.json({
		message: "Signup successful",
		user: req.user,
	});
};
const login = async (req, res, next) => {
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
				console.log(error);
				next(error);
			}
		}
	)(req, res, next);
};
// //USE JWT WITHOUT PASSPORT
// const login = async (req, res) => {
// 	const { email, passWord } = req.body;
// 	const user = await User.findOne({
// 		email,
// 	});

// 	if (!user) {
// 		return done(null, false, {
// 			message: "User not found",
// 		});
// 	}
// 	const validate = await user.comparePasswords(
// 		passWord
// 	);

// 	if (!validate) {
// 		return done(null, false, {
// 			message: "Wrong Password",
// 		});
// 	}
// 	const { _id, firstName, lastName } = user;
// 	const token = jwt.sign(
// 		{ email, _id, lastName, firstName },
// 		process.env.JWT_SECRET,
// 		{ expiresIn: "10d" }
// 	);
// 	res.status(200).json(token);
// };
module.exports = {
	getUsers,
	signup,
	login,
};
