const app = require("./app");
const connectDB = require("./db/connection");
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);



app.listen(port, async () => {
	await connectDB();
	console.log("Listening on port", port);
});
