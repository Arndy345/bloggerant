const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));
app.use("/api", userRouter);

app.use("/blogs", blogRouter);

app.get("/", (req, res, next) => {
	res.send(
		"<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Bloggerant</span>!</h1>\
     <br> <h3 style='color: black;text-align: center'>Click <a href='https://github.com/arndy345/bloggerant' target='_blank'>here</a> to get started</h3>"
	);
	next();
});
app.all("*", (req, res, next) => {
	next();
});

// app.use(errorLogger);
// app.use(errorResponder);
// app.use(invalidPathHandler);
module.exports = app;
