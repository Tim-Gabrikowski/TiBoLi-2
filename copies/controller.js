const {
	getAll,
	getByNumber,
	createNew,
	getAllNumbers,
	getBookFromId,
	setCopyLifecycle,
} = require("./save");

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
	res.set("Access-Control-Allow-Origin", "*");
	getAll((err, result) => {
		if (err) {
			res.status(500).send("Database fucked off");
			throw err;
		}

		res.status(200).send(result);
	});
}
function getByNumberAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getByNumber(req.params.mNumber, (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		result = JSON.parse(JSON.stringify(result));
		getBookFromId(result[0].bookId, (err, results) => {
			if (err) throw err;
			results = JSON.parse(JSON.stringify(results));
			var obj = dataTemplate;

			obj.mNumber = result[0].mNumber;
			obj.bookId = result[0].bookId;
			obj.lifecycle = result[0].lifecycle;

			obj._LINK.book.title = results[0].title;
			obj._LINK.book.author = results[0].author;

			res.status(200).send(obj);
		});
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	amount = req.body.amount;
	getAllNumbers((err, result) => {
		if (err) throw err;
		var numbers = JSON.stringify(result);
		var numbers = JSON.parse(numbers);
		var count = numbers.length;
		var copies = [];

		for (var i = 0; i < amount; i++) {
			var mediaNumber = 111111111 + count + i;

			var copy = {
				mNumber: mediaNumber,
				bookId: req.body.bookId,
				lifecycle: 1,
			};
			copies.push(copy);
		}
		createNew(copies, (err, result) => {
			if (err) {
				res.status(500).send("---Error! out of Phrases---");
				throw err;
			}
			res.status(200).send(copies);
		});
	});
}
function setLifecycleAction(req, res) {
	setCopyLifecycle(req.body.mNumber, req.body.lifecycle, (err, result) => {
		if (err) {
			res.status(500).send("---Error! out of Phrases---");
			throw err;
		}
		res.status(200).send(result);
	});
}
module.exports = {
	getAllAction,
	getByNumberAction,
	createNewAction,
	setLifecycleAction,
};
