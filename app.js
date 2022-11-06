// const express = require("express");
const app = require("./index");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");

const port = process.env.PORT || 3000;
app.listen(port, async () => {
	await connectDB();
	console.log("Listening on port", port);
});

// module.exports = app;
