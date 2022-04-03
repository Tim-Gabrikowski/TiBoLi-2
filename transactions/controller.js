const { mysqlDate, mysqlDateToString } = require("./date");
const {
	getAll,
	newTransaction,
	finnishTransaction,
	countUnfinnishedTransactions,
	getTransactionsByBenutzerNumber,
	getTransactionsByUserWithBooks,
} = require("./save");

// gets  all Transactions from the db.
function getAllAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getAll((err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "transactions/controller/getAllAction",
				errorObject: err,
			};
		result = JSON.parse(JSON.stringify(result));

		res.send(result);
	});
}

function getTransactionByUserAction(req, res) {
	getTransactionsByBenutzerNumber(req.params.bNumber, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "transactions/controller/getTransactionsByUserAction",
				errorObject: err,
			};
		result = JSON.parse(JSON.stringify(result));

		res.send(result);
	});
}
function getTransactionByUserWithBooksAction(req, res) {
	getTransactionsByUserWithBooks(req.params.bNumber, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "transactions/controller/getTransactionByUserWithBooksAction",
				errorObject: err,
			};
		result = JSON.parse(JSON.stringify(result));

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
		lentDate: Date.now(),
	};
	countUnfinnishedTransactions(transaction.copy, (err, results) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "transactions/controller/newTransactionAction",
				errorObject: err,
			};

		results = JSON.parse(JSON.stringify(results));

		if (results[0].count != 0) {
			res.status(200).send({ status: 2, message: "ausgeliehen!" });
		} else {
			newTransaction(transaction, (err, result) => {
				if (err) {
					res.send({
						status: 4,
						message: "fehler ist aufgetreten",
					});
				}
				if (!err) {
					result = JSON.parse(JSON.stringify(result));

					transaction.transactionId = result.insertId;
					res.status(200).send({
						status: 0,
						message: "ok",
						transaction: transaction,
					});
				}
			});
		}
	});
}

//mark transition with backDate in db to mark it as back.
function finnishTransactionAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	const { mNumber } = req.body;
	finnishTransaction(mNumber, Date.now(), (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "transactions/controller/finnishTransactionAction",
				errorObject: err,
			};

		res.status(200).send({ status: 0, message: "ok" });
	});
}

module.exports = {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByUserAction,
	getTransactionByUserWithBooksAction,
};
