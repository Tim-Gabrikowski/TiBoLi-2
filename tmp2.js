const Secuelize = require("sequelize");
require("dotenv").config();

var con = new Secuelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{
		port: process.env.DATABASE_PORT,
		host: process.env.DATABASE_HOST,
		logging: console.log,
		dialect: "mysql",
	}
);

var Book = con.define(
	"book",
	{
		title: Secuelize.STRING,
		author: Secuelize.STRING,
	},
	{
		paranoid: true,
	}
);

con.sync({ alter: true });

const express = require("express");
const app = express();

app.use(express.json());

app.get("/books", (req, res) => {
	Book.findAll().then((books) => {
		res.send(books);
	});
});
app.post("/book", (req, res) => {
	const { title, author } = req.body;

	Book.create({ title: title, author: author }).then((book) => {
		res.send(book);
	});
});
app.put("/book/:id", (req, res) => {
	var { title, author } = req.body;
	var { id } = req.params;

	Book.update({ title: title, author: author }, { where: { id: id } }).then(
		(book) => {
			res.send(book);
		}
	);
});
app.delete("/book/:id", (req, res) => {
	var { id } = req.params;

	Book.destroy({ where: { id: id } }).then((book) => {
		res.send({ back: book });
	});
});

app.listen(3008);
