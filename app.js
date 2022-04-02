const express = require("express");
const app = express();
const cors = require("cors");
const handleError = require("./errorHandling");

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

process.on("uncaughtException", handleError);
