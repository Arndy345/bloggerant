const errHandler = async (req, res, next) => {
	if (req.err === "Wrong email/password") {
		res.send("Wrong email/password");
	}
	next();
};
module.export = errHandler;
