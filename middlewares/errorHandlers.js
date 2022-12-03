// const errorLogger = (err, req, res, next) => {
// 	console.error("\x1b[31m", err);
// 	next(err);
// };

const errorHandler = (err, req, res, next) => {
	if (err.message === "auth") {
		res.status(401);
		res.send("Unauthorized");
		return;
	} else if (err.type === "input") {
		res.status(400);
		return res.send("invalid input");
	} else if (
		err.message.startsWith(
			"Cast to ObjectId failed"
		)
	) {
		res.status(400);
		return res.send("Invalid Blog ID");
	} else if (
		err.message.startsWith(
			"E11000 duplicate key error collection"
		)
	) {
		res.status(400).json({
			message: "email already in use",
		});
	} else if (
		err.message.startsWith(
			"User validation failed"
		)
	) {
		res.status(400).json({
			message: "Invalid/Incomplete details",
		});
	} else {
		res.status(500);
		return res.send("Internal error");
	}
};

const invalidPathHandler = (req, res, next) => {
	res.status(400).send({
		message: `${req.originalUrl} is not a valid path`,
	});
	next();
};

module.exports = {
	errorHandler,
	invalidPathHandler,
};
