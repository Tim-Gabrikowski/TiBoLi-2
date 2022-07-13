const levenshtein = require("js-levenshtein");
const database = require("../database");

function getAllAction(req, res) {
	if (req.user.perm_group < 0)
		return res.status(403).send({ message: "not allowed" });
	res.set("Access-Control-Allow-Origin", "*");

	database.getAllBooks().then((books) => {
		res.send(books);
	});
}
function getIdAction(req, res) {
	if (req.user.perm_group < 0)
		return res.status(403).send({ message: "not allowed" });
	res.set("Access-Control-Allow-Origin", "*");

	database.getBookById(req.params.id).then((book) => {
		res.send(book[0]);
	});
}
function createNewAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });
	res.set("Access-Control-Allow-Origin", "*");

	database.createNewBook(req.body).then((book) => {
		res.send(book);
	});
}
function updateAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });
	res.set("Access-Control-Allow-Origin", "*");

	const newBook = req.body;

	database.updateExistingBook(newBook).then((nBook) => {
		database.getBookById(newBook.id).then((book) => {
			res.send(book[0]);
		});
	});
}
function getCopiesAction(req, res) {
	if (req.user.perm_group < 0)
		return res.status(403).send({ message: "not allowed" });
	res.set("Access-Control-Allow-Origin", "*");

	database.getBookById(req.params.id).then((books) => {
		if (books.length != 1)
			return res
				.status(400)
				.send({ message: "no / multiple Books with that Id" });
		var book = books[0].dataValues;
		database.getCopiesFromBook(book.id).then((copies) => {
			book.copies = copies;
			res.send(book);
		});
	});
}
function searchByTitleAction(req, res) {
	if (req.user.perm_group < 0)
		return res.status(403).send({ message: "not allowed" });

	const searchTerm = req.params.term;
	const maxOps = 0.3 * searchTerm.length + 3;

	database.getAllBooks().then((books) => {
		var back = books.filter((element) => {
			var dist = levenshtein(element.title, searchTerm);
			return dist <= maxOps;
		});
		res.send(back);
	});
}
function searchByAuthorAction(req, res) {
	if (req.user.perm_group < 0)
		return res.status(403).send({ message: "not allowed" });

	const searchTerm = req.params.term;
	const maxOps = 0.3 * searchTerm.length + 3;

	database.getAllBooks().then((books) => {
		var back = books.filter((element) => {
			var dist = levenshtein(element.author, searchTerm);
			return dist <= maxOps;
		});
		res.send(back);
	});
}
function deleteBookAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });
	database.deleteBook(req.params.id).then((result) => {
		res.send({ ok: true });
	});
}

module.exports = {
	getAllAction,
	getIdAction,
	createNewAction,
	updateAction,
	getCopiesAction,
	searchByTitleAction,
	searchByAuthorAction,
	deleteBookAction,
};
