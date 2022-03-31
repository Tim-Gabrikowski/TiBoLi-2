var mysql = require("mysql8.0");

const dbConf = require("../db.conf.json");

var con = mysql.createConnection(dbConf);

con.connect(function (err) {
	if (err) throw err;
	console.log("User connected!");
});

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

//ACTIONS:
function getAll(callback) {
	query(`SELECT * FROM users`, callback);
}
function getByNumber(bNumber, callback) {
	query(`SELECT * FROM users WHERE id = ${bNumber}`, callback);
}
function createNew(user, callback) {
	query(
		`INSERT INTO users (vorname, nachname, classId) VALUES ( '${user.vorname}', '${user.nachname}', ${user.classId})`,
		callback
	);
}
function getClass(classID, callback) {
	query(`SELECT * FROM classes WHERE id = ${classID} `, callback);
}
function updateExisting(user, callback) {
	query(
		`UPDATE users SET vorname = '${user.vorname}', nachname = '${user.nachname}', classId = ${user.classId} WHERE id = ${user.id}`,
		callback
	);
}
function getAllNumbers(callback) {
	query(`SELECT id FROM users`, callback);
}
function getClasses(callback) {
	query(`SELECT * FROM classes`, callback);
}
function deleteUser(id, callback) {
	query(`DELETE FROM users WHERE id = ${id}`, callback);
}
module.exports = {
	getAll,
	getByNumber,
	createNew,
	updateExisting,
	getAllNumbers,
	getClass,
	getClasses,
	deleteUser,
};
