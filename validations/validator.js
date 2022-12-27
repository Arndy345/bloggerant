const joi = require("joi");

const validateUserSignup = async (
	req,
	res,
	next
) => {
	const userPayload = req.body;

	try {
		await userSignupValidator.validateAsync(
			userPayload
		);
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(406)
			.send(error.details[0].message);
	}
};
const validateUserLogin = async (
	req,
	res,
	next
) => {
	const userPayload = req.body;

	try {
		await userLoginValidator.validateAsync(
			userPayload
		);
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(406)
			.send(error.details[0].message);
	}
};
const validateBlogMiddleWare = async (
	req,
	res,
	next
) => {
	const blogPayload = req.body;
	try {
		await blogValidator.validateAsync(
			blogPayload
		);
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(406)
			.send(error.details[0].message);
	}
};

const blogValidator = joi.object({
	title: joi.string().min(5).max(255).required(),
	description: joi
		.string()
		.min(5)
		.max(255)
		.optional(),
	// author: joi.objectId().required(),
	body: joi.string().required(),
	state: joi.string().default("draft"),
	readCount: joi.number().default(0),
	tags: joi.string().optional(),
});
const userSignupValidator = joi.object({
	firstName: joi.string().required(),
	lastName: joi.string().required(),
	email: joi.string().required(),
	passWord: joi
		.string()
		.min(5)
		.max(255)
		.required(),
});
const userLoginValidator = joi.object({
	email: joi.string().required(),
	passWord: joi
		.string()
		.min(5)
		.max(255)
		.required(),
});

module.exports = {
	validateBlogMiddleWare,
	validateUserSignup,
	validateUserLogin,
};
