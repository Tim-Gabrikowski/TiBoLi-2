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
	query(`SELECT * FROM users`, callback);
}
function getByNumber(bNumber, callback) {
	query(`SELECT * FROM users WHERE bNumber = ${bNumber}`, callback);
}
function createNew(user, callback) {
	query(
		`INSERT INTO users (bNumber, vorname, nachname) VALUES (${user.bNumber}, '${user.vorname}', '${user.nachname}')`,
		callback
	);
}
function updateExisting(user, callback) {
	query(
		`UPDATE users SET vorname = '${user.vorname}', nachname = '${user.nachname}' WHERE bNumber = ${user.bNumber}`,
		callback
	);
}
function getAllNumbers(callback) {
	query(`SELECT bNumber FROM users`, callback);
}
module.exports = {
	getAll,
	getByNumber,
	createNew,
	updateExisting,
	getAllNumbers,
};
