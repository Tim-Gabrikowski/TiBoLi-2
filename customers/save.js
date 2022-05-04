var mysql = require("mysql8.0");

const dbConf = require("../db.conf.json");

var con = mysql.createPool(dbConf);

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
function createNew(customer, callback) {
	query(
		`INSERT INTO users (vorname, nachname, classId) VALUES ( '${customer.vorname}', '${customer.nachname}', ${customer.classId})`,
		callback
	);
}
function getClass(classID, callback) {
	query(`SELECT * FROM classes WHERE id = ${classID} `, callback);
}
function updateExisting(customer, callback) {
	query(
		`UPDATE users SET vorname = '${customer.vorname}', nachname = '${customer.nachname}', classId = ${customer.classId} WHERE id = ${customer.id}`,
		callback
	);
}
function getAllNumbers(callback) {
	query(`SELECT id FROM users`, callback);
}
function getClasses(callback) {
	query(`SELECT * FROM classes`, callback);
}
function deleteCustomer(id, callback) {
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
	deleteCustomer,
};
