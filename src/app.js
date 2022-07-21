const express = require("express");
const app = express();
const cors = require("cors");
const handleError = require("./errorHandling");
const fileUpload = require("express-fileupload");
require("dotenv").config();

//Routers:
const booksRouter = require("./books");
const copiesRouter = require("./copies");
const customersRouter = require("./customers");
const transactionsRouter = require("./transactions");
const authModule = require("./auth");
const pdfRouter = require("./pdf");
const bookwishRouter = require("./bookwish");
const classesRouter = require("./classes");
const adminRouter = require("./admin");

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/customers", customersRouter);
app.use("/transactions", transactionsRouter);
app.use("/auth", authModule.router);
app.use("/pdf", pdfRouter);
app.use("/wish", bookwishRouter);
app.use("/classes", classesRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
	res.send({ ok: true, message: "Welcome!" });
});

app.listen(process.env.SERVER_PORT, () => {
	console.log("on! Port:", process.env.SERVER_PORT);
});

process.on("uncaughtException", handleError);
