const User = require("../model/users.model");

const getUsers = async (req, res) => {
	const user = await User.find({});
	res.status(200).send(user);
};

module.exports = {
	getUsers,
};
