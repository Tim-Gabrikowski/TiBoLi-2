const database = require("../database");

// gets  all Transactions from the db.
function getAllAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	database.getAllTransactions().then((transactions) => {
		res.send(transactions);
	});
}

function getTransactionByCustomerAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	database.getTransactionsByCustomer(req.params.bNumber).then((transactions) => {
		res.send(transactions);
	});
}
function getTransactionByCustomerWithBooksAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	database.getTransactionByCustomerWithBooks(req.params.bNumber).then((transactions) => {
		res.send(transactions);
	});
}

//create new Transaction.
//create new Transaction object, check if copy is not given back yet.
//write new Transaction to db and send it back to client.
function newTransactionAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");

	database.getSetting("maxLentTime").then((settings) => {
		if (settings.length < 1) return res.status(500).send({ message: "internal server error" });

		var setting = settings[0].dataValues;

		console.log(Number(setting.value));
		var transaction = {
			transactionId: 0,
			customerId: req.body.bNumber,
			copyId: req.body.mNumber,
			lentDate: Date.now(),
			maxBack: Date.now() + Number(setting.value + "000"),
		};
		database.countUnfinnishedTransactions(transaction.copyId).then((count) => {
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
	});
}

//mark transition with backDate in db to mark it as back.
function finnishTransactionAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	const { mNumber } = req.body;

	database.getUnfinnishedTransactions(mNumber).then((transactions) => {
		if (transactions.length < 1) return res.status(400).send({ message: "No transaction" });
		var transaction = transactions[0].dataValues;

		transaction.backDate = Date.now();

		database.finnishTransaction(transaction).then((result) => {
			var late = transaction.backDate > transaction.maxBack ? true : false;
			res.status(200).send({ status: 0, message: "ok", late: late });
		});
	});
}

function extendTransactionAction(req, res) {
	if (req.user.perm_group < 3) return res.status(403).send({ message: "not allowed" });

	const { mNumber } = req.body;

	database.getSetting("maxLentTime").then((settings) => {
		if (settings.length < 1) return res.status(500).send({ message: "internal server error" });
		var setting = settings[0].dataValues;

		database.extendTransaction(mNumber, Date.now() + Number(setting.value + "000")).then((_) => {
			res.send({ message: "ok", status: 0 });
		});
	});
}

module.exports = {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByCustomerAction,
	getTransactionByCustomerWithBooksAction,
	extendTransactionAction,
};
