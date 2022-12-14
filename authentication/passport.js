const passport = require("passport");
const localStrategy =
	require("passport-local").Strategy;
const User = require("../model/users.model");
const JWTstrategy =
	require("passport-jwt").Strategy;
const ExtractJWT =
	require("passport-jwt").ExtractJwt;
require("dotenv").config();

passport.use(
	"signup",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "passWord",
			//ALLOWS REW PARAMS TO BE PASSED
			passReqToCallback: true,
		},
		async (req, email, passWord, done) => {
			try {
				const { firstName, lastName } = req.body;

				const user = await User.create({
					firstName,
					lastName,
					email,
					passWord,
				});

				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);
// ...

passport.use(
	"login",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "passWord",
		},
		async (email, passWord, done) => {
			try {
				const user = await User.findOne({
					email,
				});

				if (!user) {
					return done(null, false, {
						message: "User not found",
					});
				}

				const validate =
					await user.comparePasswords(passWord);

				if (!validate) {
					return done(null, false, {
						message: "Wrong Password",
					});
				}

				return done(null, user, {
					message: "Logged in Successfully",
				});
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest:
				ExtractJWT.fromAuthHeaderAsBearerToken(),
		},
		async (token, done) => {
			try {
				const user = await User.findById(
					token.user
				);
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			} catch (e) {
				next(err);
			}
		}
	)
);
