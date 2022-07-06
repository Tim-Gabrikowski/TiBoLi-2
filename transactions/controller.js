const database = require("../database");

// gets  all Transactions from the db.
function getAllAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	database.getAllTransactions().then((transactions) => {
		res.send(transactions);
	});
}

function getTransactionByCustomerAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database
		.getTransactionsByCustomer(req.params.bNumber)
		.then((transactions) => {
			res.send(transactions);
		});
}
function getTransactionByCustomerWithBooksAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database
		.getTransactionByCustomerWithBooks(req.params.bNumber)
		.then((transactions) => {
			res.send(transactions);
		});
}

//create new Transaction.
//create new Transaction object, check if copy is not given back yet.
//write new Transaction to db and send it back to client.
function newTransactionAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	var transaction = {
		transactionId: 0,
		customer: req.body.bNumber,
		copy: req.body.mNumber,
		lentDate: Date.now(),
	};
	database.countUnfinnishedTransactions(transaction.copy).then((count) => {
		if (count != 0) {
			res.send({ status: 2, message: "ausgeliehen!" });
			return;
		}
		database.createNewTransaction(transaction).then((newTransaction) => {
			res.send({
				status: 0,
				message: "ok",
				transaction: newTransaction,
			});
		});
	});
}

//mark transition with backDate in db to mark it as back.
function finnishTransactionAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	const { mNumber } = req.body;
	database.finnishTransaction(mNumber, Date.now()).then((result) => {
		res.status(200).send({ status: 0, message: "ok" });
	});
}

module.exports = {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByCustomerAction,
	getTransactionByCustomerWithBooksAction,
};
