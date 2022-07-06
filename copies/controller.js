const database = require("../database");

const dataTemplate = {
	mNumber: 123456789,
	bookId: 1,
	lifecycle: 1,
	_LINK: {
		book: {
			id: 1,
			title: "title",
			author: "author",
		},
	},
};

function getAllAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getAllCopies().then((copies) => {
		res.send(copies);
	});
}
function getByNumberAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getCopyByNumber(req.params.mNumber).then((copies) => {
		var copy = copies[0];
		database.getBookById(copy[0].bookId).then((books) => {
			var book = books[0];

			var obj = dataTemplate;
			obj.mNumber = copy.mNumber;
			obj.bookId = copy.bookId;
			obj.lifecycle = copy.lifecycle;

			obj._LINK.book.title = book.title;
			obj._LINK.book.author = book.author;

			res.status(200).send(obj);
		});
	});
}
function createNewAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	var amount = req.body.amount;
	var bookId = req.body.bookId;
	var totalDone = 0;
	var copies = [];

	for (var i = 0; i < amount; i++) {
		database.createNewCopy(bookId).then((copy) => {
			copies.push(copy);
			totalDone++;
			if (totalDone == amount) {
				res.send(copies);
			}
		});
	}
}
function setLifecycleAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database
		.updateCopyLifecycle(req.body.mNumber, req.body.lifecycle)
		.then((copy) => {
			database.getCopyByNumber(req.body.mNumber).then((copies) => {
				res.send(copies[0]);
			});
		});
}
module.exports = {
	getAllAction,
	getByNumberAction,
	createNewAction,
	setLifecycleAction,
};
