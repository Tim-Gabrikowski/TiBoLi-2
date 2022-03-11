const { mysqlDate, mysqlDateToString } = require("./date");
const {
	getAll,
	newTransaction,
	finnishTransaction,
	countUnfinnishedTransactions,
} = require("./save");

// gets  all Transactions from the db.
function getAllAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getAll((err, result) => {
		if (err) {
			res.status(500).send("INTERNAL SERVER PROBLEMS");
		}
		result = JSON.parse(JSON.stringify(result));
		result.forEach((element) => {
			element.lentDate = mysqlDateToString(element.lentDate);
			element.backDate = mysqlDateToString(element.backDate);
		});
		res.send(result);
	});
}

//create new Transaction.
//create new Transaction object, check if copy is not given back yet.
//write new Transaction to db and send it back to client.
function newTransactionAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	var transaction = {
		transactionId: 0,
		user: req.body.bNumber,
		copy: req.body.mNumber,
		lentDate: mysqlDate(),
	};
	countUnfinnishedTransactions(transaction.copy, (err, results) => {
		if (err) throw err;

		results = JSON.parse(JSON.stringify(results));

		if (results[0].count != 0) {
			res.status(200).send("bereits geliehen");
		} else {
			newTransaction(transaction, (err, result) => {
				if (err) {
					res.status(500).send("Server fucked off!");
					throw err;
				}
				result = JSON.parse(JSON.stringify(result));

				transaction.transactionId = result.insertId;
				res.status(200).send(transaction);
			});
		}
	});
}

//mark transition with backDate in db to mark it as back.
function finnishTransactionAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	const { mNumber } = req.body;
	finnishTransaction(mNumber, mysqlDate(), (err, result) => {
		if (err) {
			res.status(500).send(
				"It might be, that the server is not working correctly."
			);
			throw err;
		}

		res.status(200).send(result);
	});
}

module.exports = {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
};
