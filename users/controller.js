const {
	getAll,
	getByNumber,
	createNew,
	updateExisting,
	getAllNumbers,
} = require("./save");

function getAllAction(req, res) {
	getAll((err, result) => {
		if (err) {
			res.status(500).send("Database fucked off");
			throw err;
		}
		res.status(200).send(result);
	});
}
function getNumberAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getByNumber(req.params.bNumber, (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		res.status(200).send(result);
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getAllNumbers((err, result) => {
		if (err) throw err;
		var numbers = JSON.stringify(result);
		var numbers = JSON.parse(numbers);
		var count = numbers.length;

		var userNumber = 11111 + count;
		var user = {
			bNumber: userNumber,
			vorname: req.body.vorname,
			nachname: req.body.nachname,
		};
		createNew(user, (err, result) => {
			if (err) {
				res.status(500).send("---Error! out of Phrases---");
				throw err;
			}
			res.status(200).send(user);
		});
	});
}
function updateAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	updateExisting(req.body, (err, result) => {
		if (err) {
			res.status(500).send("WHY am I doing that?");
			throw err;
		}
		res.status(200).send(result);
	});
}

module.exports = {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
};
