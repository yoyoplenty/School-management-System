const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({
	path: "./config.env",
});

let database = process.env.DATABASE;

switch (process.env.NODE_ENV) {
	case "production":
		database = process.env.DATABASE;
		break;
	case "staging":
		database = process.env.STAGING_URI;
		break;
	case "qa":
		database = process.env.QA_MONGODB_URI;
		break;
	case "development":
		database = process.env.MONGODB_URI;
		break;
	case "local":
		database = process.env.DATABASEE;
		break;
	default:
		database = process.env.MONGODB_URI;
}

// Connect the database
mongoose
	.connect(database, {
		// useNewUrlParser: true,
		// useCreateIndex: true,
		// useFindAndModify: false,
		// useUnifiedTopology: true
	})
	.then((con) => {
		console.log("DB connection Successful!");
	});

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
	console.log(`Application is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
	// server.close(() => {
	// 	process.exit(1);
	// });
});
