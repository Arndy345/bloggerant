// const express = require("express");
const app = require("./index");
const dotenv = require("dotenv");


dotenv.config();

app.listen(process.env.PORT, () => {
	console.log(
		"Listening on port, ",
		process.env.PORT
	);
});

// module.exports = app;
