const database = require("../database");

function getClassesAction(req, res) {
	database.getAllClasses().then((classes) => {
		res.send(classes);
	});
}
function getClassByIdAction(req, res) {
	database.getClassById(req.params.id).then((classes) => {
		res.send(classes);
	});
}
function createNewClassAction(req, res) {
	const { year, letter } = req.body;
	database.createClass({ year: year, letter: letter }).then((newClass) => {
		res.send(newClass);
	});
}
function updateClassAction(req, res) {
	const { id, year, letter } = req.body;
	database.updateClass({ id: id, year: year, letter: letter }).then((_) => {
		database.getClassById(id).then((newClass) => {
			res.send(newClass[0]);
		});
	});
}

module.exports = {
	getClassesAction,
	getClassByIdAction,
	createNewClassAction,
	updateClassAction,
};
