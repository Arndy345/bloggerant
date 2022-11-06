const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
const morgan = require("morgan");
// const errHandler = require("./utils/errHandler");
// require("./db/connection");
app.use(express.json());
app.use(morgan("dev"));
app.use("/", userRouter);
// app.use(errHandler);
app.use("/blogs", blogRouter);

app.get("/", (req, res) => {
	res.send("Welcome to my Blog");
	// console.log("Connected");
});
module.exports = app;
