const mongoose = require("mongoose");
const config = require("../config");

mongoose.Promise = require("bluebird");
mongoose
	.connect(config.mongoConnection, {
		promiseLibrary: require("bluebird"),
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("connection succesful"))
	.catch((err) => console.error(err));
	
process.on("SIGINT", function () {
	mongoose.disconnect(function () {
		console.log("Mongoose disconnected on app termination");
		process.exit(0);
	});
});

module.exports = mongoose;
