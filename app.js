const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.routes");
require("./db/connection");
dotenv.config();
const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.get("/", (req, res) => {
	res.send("HEllo");
	console.log("Connected");
});
app.listen(process.env.PORT, () => {
	console.log(
		"Listening on port, ",
		process.env.PORT
	);
});

module.exports = app;
