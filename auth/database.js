var mysql = require("mysql8.0");

const dbConf = require("../db.conf.json");

var con = mysql.createPool(dbConf);

function query(sql, callback) {
	con.query(sql, (err, result) => callback(err, result));
}

function getUserByUsername(username, callback) {
	query(`SELECT * FROM users WHERE username = '${username}'`, callback);
}
function getUserById(id, callback) {
	query(
		`SELECT (id, username, mail, perm_group) FROM users WHERE id = ${id}`,
		callback
	);
}
function registerNewUser(user, callback) {
	query(
		`INSERT INTO users (username, password_hash, mail, perm_group) VALUES ('${user.username}', '${user.password_hash}', '${user.mail}', ${user.perm_group})`,
		callback
	);
}
function getAllUsernames(callback) {
	query(`SELECT (username) FROM users`, callback);
}

module.exports = {
	getUserByUsername,
	getUserById,
	registerNewUser,
	getAllUsernames,
};
