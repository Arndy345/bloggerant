// const express = require("express");
const app = require("./index");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");

dotenv.config();

app.listen(process.env.PORT, async () => {
	await connectDB();
	console.log(
		"Listening on port 3030 "
		// process.env.PORT
	);
});

// module.exports = app;
