const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const {
	errorHandler,
	invalidPathHandler,
} = require("./middlewares/errorHandlers");

// Defaults to in-memory store.
// You can use redis or any other store.
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//add secuirty
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Apply the rate limiting middleware to API calls only
app.use("/blogs", limiter);
app.use("/api", userRouter);
app.use("/blogs", blogRouter);

app.get("/", (req, res, next) => {
	res.send(
		"<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Bloggerant</span>!</h1>\
     <br> <h3 style='color: black;text-align: center'>Click <a href='https://github.com/arndy345/bloggerant' target='_blank'>here</a> to get started</h3>"
	);
	next();
});
app.all("*", invalidPathHandler);

app.use(errorHandler);

module.exports = app;
