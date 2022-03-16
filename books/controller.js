const { stringify } = require("nodemon/lib/utils");
const levenshtein = require("js-levenshtein");
const {
	getAll,
	getById,
	createNew,
	updateExisting,
	getCopiesFromBook,
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

			res.status(200).send(body);
		});
	});
}
function searchByTitleAction(req, res) {
	getAll((err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		const searchTerm = req.params.term;

		result = JSON.parse(JSON.stringify(result));
		body = [];
		maxOps = 0.4 * searchTerm.length + 3;
		result.forEach((element) => {
			var dist = levenshtein(element.title, searchTerm);
			if (dist <= maxOps) {
				body.push(element);
			}
		});
		res.status(200).send(body);
	});
}
function searchByAuthorAction(req, res) {
	getAll((err, result) => {
		if (err) {
			res.status(500).send("MySQL sucks!");
			throw err;
		}
		const searchTerm = req.params.term;

		result = JSON.parse(JSON.stringify(result));
		body = [];
		maxOps = 0.4 * searchTerm.length + 3;
		result.forEach((element) => {
			var dist = levenshtein(element.author, searchTerm);
			if (dist <= maxOps) {
				body.push(element);
			}
		});
		res.status(200).send(body);
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
	searchByTitleAction,
	searchByAuthorAction,
	deleteBookAction,
};
