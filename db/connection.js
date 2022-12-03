const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();



const MONGODB_URI =
	process.env.NODE_ENV === "test"
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI;
const connectDB = async () => {
	await mongoose
		.connect(MONGODB_URI)
		.then((conn) => {
			console.log(
				`Conected to Mongo! Database name: ${conn.connections[0].name}`
			);
		})
		.catch((err) =>
			console.error(
				"Error connecting to mongo",
				err
			)
		);
};

module.exports = connectDB;
