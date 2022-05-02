const {
	getAll,
	getByNumber,
	createNew,
	updateExisting,
	getAllNumbers,
	getClass,
	getClasses,
	deleteUser,
} = require("./save");

function getAllAction(req, res) {
	getAll((err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/getAllAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}
function getNumberAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	getByNumber(req.params.bNumber, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/getNumberAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}
function getWithClassAction(req, res) {
	getByNumber(req.params.bNumber, (err, userResult) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/getWithClassAction",
				errorObject: err,
			};
		user = JSON.parse(JSON.stringify(userResult));

		getClass(user[0].classId, (err, classResult) => {
			if (err)
				throw {
					request: req,
					response: res,
					message: "Something went wrong",
					origin: "users/controller/getWithClassAction",
					errorObject: err,
				};
			user[0].class = JSON.parse(JSON.stringify(classResult[0]));
			res.status(200).send(user[0]);
		});
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	var user = {
		vorname: req.body.vorname,
		nachname: req.body.nachname,
		classId: req.body.classId,
	};
	createNew(user, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/createNewAction",
				errorObject: err,
			};
		user.id = JSON.parse(JSON.stringify(result)).insertId;
		getClass(user.classId, (err, classResult) => {
			if (err)
				throw {
					request: req,
					response: res,
					message: "Something went wrong",
					origin: "users/controller/getWithClassAction",
					errorObject: err,
				};
			user.class = JSON.parse(JSON.stringify(classResult[0]));
			res.status(200).send(user);
		});
	});
}
function updateAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	updateExisting(req.body, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/updateAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}

function getClassesAction(req, res) {
	getClasses((err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/getClassesAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}
function deleteAction(req, res) {
	deleteUser(req.params.id, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "users/controller/deleteAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}

module.exports = {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
	getWithClassAction,
	getClassesAction,
	deleteAction,
};
