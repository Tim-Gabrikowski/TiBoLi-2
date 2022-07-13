const database = require("../database");

function getClassesAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getAllClasses().then((classes) => {
		res.send(classes);
	});
}
function getClassByIdAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getClassById(req.params.id).then((classes) => {
		res.send(classes);
	});
}
function createNewClassAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	const { year, letter } = req.body;
	database.createClass({ year: year, letter: letter }).then((newClass) => {
		res.send(newClass);
	});
}
function updateClassAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

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
