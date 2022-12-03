const app = require("./app");
const connectDB = require("./db/connection");
const http = require("http");
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(
			"listening for requests on port",
			PORT
		);
	});
});
// app.listen(port, async () => {
// 	await connectDB();
// 	console.log("Listening on port", port);
// });
