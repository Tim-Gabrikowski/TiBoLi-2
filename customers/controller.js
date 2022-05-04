const {
	getAll,
	getByNumber,
	createNew,
	updateExisting,
	getAllNumbers,
	getClass,
	getClasses,
	deleteCustomer,
} = require("./save");

function getAllAction(req, res) {
	getAll((err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "customers/controller/getAllAction",
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
				origin: "customers/controller/getNumberAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}
function getWithClassAction(req, res) {
	getByNumber(req.params.bNumber, (err, customerResult) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "customers/controller/getWithClassAction",
				errorObject: err,
			};
		customer = JSON.parse(JSON.stringify(customerResult));

		getClass(customer[0].classId, (err, classResult) => {
			if (err)
				throw {
					request: req,
					response: res,
					message: "Something went wrong",
					origin: "customers/controller/getWithClassAction",
					errorObject: err,
				};
			customer[0].class = JSON.parse(JSON.stringify(classResult[0]));
			res.status(200).send(customer[0]);
		});
	});
}
function createNewAction(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	var customer = {
		vorname: req.body.vorname,
		nachname: req.body.nachname,
		classId: req.body.classId,
	};
	createNew(customer, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "customers/controller/createNewAction",
				errorObject: err,
			};
		customer.id = JSON.parse(JSON.stringify(result)).insertId;
		getClass(customer.classId, (err, classResult) => {
			if (err)
				throw {
					request: req,
					response: res,
					message: "Something went wrong",
					origin: "customers/controller/getWithClassAction",
					errorObject: err,
				};
			customer.class = JSON.parse(JSON.stringify(classResult[0]));
			res.status(200).send(customer);
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
				origin: "customers/controller/updateAction",
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
				origin: "customers/controller/getClassesAction",
				errorObject: err,
			};
		res.status(200).send(result);
	});
}
function deleteAction(req, res) {
	deleteCustomer(req.params.id, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "customers/controller/deleteAction",
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
