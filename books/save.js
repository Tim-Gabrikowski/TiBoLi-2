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
	query(`SELECT * FROM books`, callback);
}
function getById(id, callback) {
	query(`SELECT * FROM books WHERE id = ${id}`, callback);
}
function createNew(book, callback) {
	query(
		`INSERT INTO books (title, author) VALUES ('${book.title}', '${book.author}')`,
		callback
	);
}
function updateExisting(book, callback) {
	query(
		`UPDATE books SET title = '${book.title}', author = '${book.author}' WHERE id = ${book.id}`,
		callback
	);
}
function getCopiesFromBook(bookId, callback) {
	query(`SELECT * FROM copies WHERE bookId = ${bookId}`, callback);
}

module.exports = {
	getAll,
	getById,
	createNew,
	updateExisting,
	getCopiesFromBook,
};
