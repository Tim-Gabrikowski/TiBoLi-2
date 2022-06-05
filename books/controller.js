const { stringify } = require("nodemon/lib/utils");
const levenshtein = require("js-levenshtein");
const {
	getAll,
	getById,
	createNew,
	updateExisting,
	getCopiesFromBook,
	deleteBook,
} = require("./save");

const database = require("../database");

function getAllAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");

	database.getAllBooks().then((books) => {
		res.send(books);
	});
}
function getIdAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");

	database.getBookById(req.params.id).then((book) => {
		res.send(book[0]);
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");

	const { title, author } = req.body;

	database.createNewBook({ title: title, author: author }).then((book) => {
		res.send(book);
	});
}
function updateAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");

	const newBook = req.body;

	database.updateExistingBook(newBook).then((nBook) => {
		database.getBookById(newBook.id).then((book) => {
			res.send(book[0]);
		});
	});
}
function getCopiesAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");

	database.getBookById(req.params.id).then((book) => {
		database.getCopiesFromBook(book[0].id).then((copies) => {
			var back = {
				id: book[0].id,
				title: book[0].title,
				author: book[0].author,
				createdAt: book[0].createdAt,
				updatedAt: book[0].updatedAt,
				deletedAt: book[0].deletedAt,
				copies: copies,
			};
			res.send(back);
		});
	});
}
function searchByTitleAction(req, res) {
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
	database.deleteBook(req.params.id).then((result) => {
		res.send("ok");
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
