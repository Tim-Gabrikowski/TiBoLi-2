var mysql = require("mysql8.0");
const dbConf = require("../db.config.json");

var con = mysql.createConnection(dbConf);

con.connect(function (err) {
	if (err) throw err;
	console.log("Copies connected!");
});

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

//ACTIONS:
function getAll(callback) {
	query(`SELECT * FROM copies`, callback);
}
function getByNumber(mNumber, callback) {
	query(`SELECT * FROM copies WHERE mNumber = ${mNumber}`, callback);
}
function createNew(copies, callback) {
	var queryValues = "";

	for (var i = 0; i < copies.length; i++) {
		queryValues += `(${copies[i].mNumber}, ${copies[i].bookId}, ${copies[i].lifecycle}),`;
	}
	queryValues = queryValues.slice(0, -1);

	query(
		`INSERT INTO copies (mNumber, bookId, lifecycle) VALUES ${queryValues};`,
		callback
	);
}
function getAllNumbers(callback) {
	query(`SELECT mNumber FROM copies`, callback);
}
function getBookFromId(id, callback) {
	query(`SELECT * FROM books WHERE id = ${id}`, callback);
}
function setCopyLifecycle(mNumber, lifecycle, callback) {
	query(
		`UPDATE copies SET lifecycle = ${lifecycle} WHERE mNUmber = ${mNumber}`,
		callback
	);
}
module.exports = {
	getAll,
	getByNumber,
	createNew,
	getAllNumbers,
	getBookFromId,
	setCopyLifecycle,
};
