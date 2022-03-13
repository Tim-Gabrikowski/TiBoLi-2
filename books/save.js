var mysql = require("mysql8.0");

const dbConf = require("../db.config.json");

var con = mysql.createConnection(dbConf);

con.connect(function (err) {
	if (err) throw err;
});

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

//ACTIONS:
function getAll(callback) {
	query(`SELECT * FROM books WHERE deleted = 0`, callback);
}
function getById(id, callback) {
	query(`SELECT * FROM books WHERE id = ${id}`, callback);
}
function createNew(book, callback) {
	book.title = book.title.replace("'", "''");
	book.author = book.author.replace("'", "''");
	query(
		`INSERT INTO books (title, author) VALUES ('${book.title}', '${book.author}')`,
		callback
	);
}
function updateExisting(book, callback) {
	book.title = book.title.replace("'", "''");
	book.author = book.author.replace("'", "''");
	query(
		`UPDATE books SET title = '${book.title}', author = '${book.author}' WHERE id = ${book.id}`,
		callback
	);
}
function getCopiesFromBook(bookId, callback) {
	query(
		`SELECT * FROM copies WHERE bookId = ${bookId} AND NOT lifecycle = 5`,
		callback
	);
}
function getSearched(stringToSearch, callback) {
	var parts = stringToSearch.split(" ");
	var searchString = "";
	parts.forEach((element) => {
		searchString += "%" + element + "%";
	});
	searchString = searchString.replace("'", "''");
	query(
		`SELECT * FROM books WHERE title LIKE '${searchString}' AND deleted = 0`,
		callback
	);
}
function deleteBook(bookId, callback) {
	query(`UPDATE books SET deleted = 1 WHERE id = ${bookId}`, callback);
}
module.exports = {
	getAll,
	getById,
	createNew,
	updateExisting,
	getCopiesFromBook,
	getSearched,
	deleteBook,
};
