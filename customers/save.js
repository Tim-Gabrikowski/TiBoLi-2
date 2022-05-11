var mysql = require("mysql8.0");

const dbConf = require("../db.conf.json");

var con = mysql.createPool(dbConf);

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

//ACTIONS:
function getAll(callback) {
	query(`SELECT * FROM customers`, callback);
}
function getByNumber(bNumber, callback) {
	query(`SELECT * FROM customers WHERE id = ${bNumber}`, callback);
}
function createNew(customer, callback) {
	query(
		`INSERT INTO customers (vorname, nachname, classId) VALUES ( '${customer.vorname}', '${customer.nachname}', ${customer.classId})`,
		callback
	);
}
function getClass(classID, callback) {
	query(`SELECT * FROM classes WHERE id = ${classID} `, callback);
}
function updateExisting(customer, callback) {
	query(
		`UPDATE customers SET vorname = '${customer.vorname}', nachname = '${customer.nachname}', classId = ${customer.classId} WHERE id = ${customer.id}`,
		callback
	);
}
function getAllNumbers(callback) {
	query(`SELECT id FROM customers`, callback);
}
function getClasses(callback) {
	query(`SELECT * FROM classes`, callback);
}
function deleteCustomer(id, callback) {
	query(`DELETE FROM customers WHERE id = ${id}`, callback);
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
