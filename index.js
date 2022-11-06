// const express = require("express");
const app = require("./app");
// const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// console.log(server);
app.listen(port, async () => {
	await connectDB();
	console.log("Listening on port", port);
});
