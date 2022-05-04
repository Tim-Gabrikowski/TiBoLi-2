var mysql = require("mysql8.0");

const dbConf = require("../db.conf.json");

var con = mysql.createPool(dbConf);

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

//ACTIONS:
function getAll(callback) {
	query(`SELECT * FROM transactions`, callback);
}
function newTransaction(transaction, callback) {
	query(
		`INSERT INTO transactions (bNumber, mNumber, lentDate) VALUES (${transaction.customer}, ${transaction.copy}, '${transaction.lentDate}')`,
		callback
	);
}
function getTransactionsByMediaNumber(mNumber, callback) {
	query(`SELECT * FROM transactions WHERE  mNumber = ${mNumber}`, callback);
}
function getTransactionsByBenutzerNumber(bNumber, callback) {
	query(`SELECT * FROM transactions WHERE  bNumber = ${bNumber}`, callback);
}
function getTransactionsByCustomerWithBooks(bNumber, callback) {
	query(
		`SELECT books.title, books.author, copies.mNumber, transactions.lentDate, transactions.backDate FROM books
			JOIN copies
			ON copies.bookID = books.id
			JOIN transactions
			ON transactions.mNumber = copies.mNumber
			Where transactions.bNumber = ${bNumber}
			ORDER BY transactions.lentDate DESC;`,
		callback
	);
}
function countUnfinnishedTransactions(mNumber, callback) {
	query(
		`SELECT COUNT(*) AS count FROM transactions WHERE backDate IS NULL AND mNumber = ${mNumber};`,
		callback
	);
}
function finnishTransaction(mNumber, backDate, callback) {
	query(
		`UPDATE transactions SET backDate = ${backDate} WHERE mNumber = ${mNumber} AND backDate IS NULL`,
		callback
	);
}

module.exports = {
	getAll,
	newTransaction,
	getTransactionsByMediaNumber,
	getTransactionsByBenutzerNumber,
	getTransactionsByCustomerWithBooks,
	finnishTransaction,
	countUnfinnishedTransactions,
};
