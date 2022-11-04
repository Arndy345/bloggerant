const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
const morgan = require("morgan");
require("./db/connection");
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRouter);
app.use("/blogs", blogRouter);
app.get("/", (req, res) => {
	res.send("HEllo");
	console.log("Connected");
});
module.exports = app;
