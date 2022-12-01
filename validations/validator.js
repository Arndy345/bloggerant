const joi = require("joi");

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
	state: joi.string().default('draft'),
	readCount: joi.number().default(0),
	tags: joi.string().optional(),
	// createAt: joi.date().default(Date.now()),
	// lastUpdateAt: joi.date().default(Date.now()),
});

module.exports = validateBlogMiddleWare;
