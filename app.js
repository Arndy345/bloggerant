const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
var cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const {
	errorHandler,
	invalidPathHandler,
} = require("./middlewares/errorHandlers");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load(
	"./blog.yaml"
);
// Defaults to in-memory store.
// You can use redis or any other store.
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// app.use(cors("*"));
//add secuirty
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
// Apply the rate limiting middleware to API calls only
app.use("/api", limiter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1", blogRouter);

app.get("/", (req, res, next) => {
	res.send(
		"<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Bloggerant</span>!</h1>\
     <br> <h3 style='color: black;text-align: center'>Click <a href='/api-docs'>here</a> to get started</h3>"
	);
	next();
});
app.use(
	"/api-docs",
	swaggerUI.serve,
	swaggerUI.setup(swaggerDocument)
);
app.all("*", invalidPathHandler);

app.use(errorHandler);

module.exports = app;
