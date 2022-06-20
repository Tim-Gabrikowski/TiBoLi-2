const express = require("express");
const app = express();
const cors = require("cors");
const handleError = require("./errorHandling");
require("dotenv").config();

//Routers:
const booksRouter = require("./books");
const copiesRouter = require("./copies");
const customersRouter = require("./customers");
const transactionsRouter = require("./transactions");
const settingsRouter = require("./settings");
const authModule = require("./auth");
const pdfRouter = require("./pdf");
const bookwhishRouter = require("./bookwhish");

app.use(express.json());
app.use(cors());

app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/customers", customersRouter);
app.use("/transactions", transactionsRouter);
app.use("/settings", settingsRouter);
app.use("/auth", authModule.router);
app.use("/pdf", pdfRouter);
app.use("/whish", bookwhishRouter);

if (process.env.SERVER_IS_MODULE == "false") {
	app.listen(process.env.SERVER_PORT, () => {
		console.log("on! Port:", process.env.SERVER_PORT);
	});
} else if (process.env.SERVER_IS_MODULE == "true") {
	module.exports = app;
}

process.on("uncaughtException", handleError);
