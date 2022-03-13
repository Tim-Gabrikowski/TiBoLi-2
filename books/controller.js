const { stringify } = require("nodemon/lib/utils");
const {
	getAll,
	getById,
	createNew,
	updateExisting,
	getCopiesFromBook,
	getSearched,
	deleteBook,
} = require("./save");

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
function getIdAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getById(req.params.id, (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		res.status(200).send(result);
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	createNew(req.body, (err, result) => {
		if (err) {
			res.status(500).send("I hate MySQL!");
			throw err;
		}
		res.status(200).send(result);
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
function getCopiesAction(req, res) {
	console.log("getCOpiesAction");
	res.set("Access-Control-Allow-Origin", "*");
	getById(req.params.id, (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		var data = JSON.parse(JSON.stringify(result));

		var body = {
			id: data[0].id,
			title: data[0].title,
			author: data[0].author,
			copies: [],
		};
		getCopiesFromBook(req.params.id, (err, results) => {
			if (err) throw err;
			body.copies = JSON.parse(JSON.stringify(results));

			console.log(body);
			res.status(200).send(body);
		});
	});
}
function getSearchTermAction(req, res) {
	getSearched(stringify(req.params.term), (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		} else {
			res.status(200).send(result);
		}
	});
}
function deleteBookAction(req, res) {
	console.log("deleteBook");
	deleteBook(req.params.id, (err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		} else {
			res.status(200).send(result);
		}
	});
}

module.exports = {
	getAllAction,
	getIdAction,
	createNewAction,
	updateAction,
	getCopiesAction,
	getSearchTermAction,
	deleteBookAction,
};
