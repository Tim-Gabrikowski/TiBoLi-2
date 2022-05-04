const express = require("express");
const app = express();
const cors = require("cors");
const handleError = require("./errorHandling");

//Router:
const booksRouter = require("./books");
const copiesRouter = require("./copies");
const customersRouter = require("./customers");
const transactionsRouter = require("./transactions");
const settingsRouter = require("./settings");
const authModule = require("./auth");

app.use(express.json());
app.use(cors());

app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/customers", customersRouter);
app.use("/transactions", transactionsRouter);
app.use("/settings", settingsRouter);
app.use("/auth", authModule.router);

app.listen(3005, () => {
	console.log("on! Port: 3005");
});

process.on("uncaughtException", handleError);
