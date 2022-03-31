const express = require("express");
const app = express();
const cors = require("cors");

//Router:
const booksRouter = require("./books");
const copiesRouter = require("./copies");
const usersRouter = require("./users");
const transactionsRouter = require("./transactions");

app.use(express.json());
app.use(cors());

app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

app.listen(3005, () => {
	console.log("on! Port: 3005");
});

process.on("uncaughtException", (err) => {
	if (
		!(
			typeof err.message === undefined ||
			typeof err.request === undefined ||
			typeof err.response === undefined ||
			typeof err.errorObject === undefined
		)
	) {
		console.log(err.message);
		err.response.status(500).send(err.message);
	} else {
		console.log("unknown error");
		console.log(err);
	}
});
