const database = require("../database");

function getAllAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getAllCustomers().then((customers) => {
		res.send(customers);
	});
}
function getNumberAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getCustomerById(req.params.bNumber).then((customers) => {
		res.send(customers[0]);
	});
}
function getWithClassAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.getCustomerById(req.params.bNumber).then((customers) => {
		var customer = customers[0];
		database.getClassById(customer.classId).then((classes) => {
			var usersClass = classes[0];

			database.getUserByCustomer(customer.id).then((users) => {
				if (users.length == 0) {
					var back = {
						id: customer.id,
						name: customer.name,
						lastname: customer.lastname,
						createdAt: customer.createdAt,
						updatedAt: customer.updatedAt,
						deletedAt: customer.deletedAt,
						classId: customer.classId,
						class: usersClass,
					};
				} else {
					var user = users[0];
					var back = {
						id: customer.id,
						name: customer.name,
						lastname: customer.lastname,
						createdAt: customer.createdAt,
						updatedAt: customer.updatedAt,
						deletedAt: customer.deletedAt,
						classId: customer.classId,
						class: {
							id: usersClass.id,
							year: usersClass.year,
							letter: usersClass.letter,
						},
						user: user,
					};
				}
				res.send(back);
			});
		});
	});
}
function createNewAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	var customer = {
		name: req.body.name,
		lastname: req.body.lastname,
		classId: req.body.classId,
	};
	database.createNewCustomer(customer).then((newCustomer) => {
		customer = newCustomer;
		database.getClassById(customer.classId).then((classes) => {
			var customersClass = classes[0];

			var back = {
				id: customer.id,
				name: customer.name,
				lastname: customer.lastname,
				classId: customer.classId,
				class: customersClass,
			};

			res.send(back);
		});
	});
}
function updateAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	res.set("Access-Control-Allow-Origin", "*");
	var customer = {
		id: req.body.id,
		name: req.body.name,
		lastname: req.body.lastname,
		classId: req.body.classId,
	};
	database.updateCustomer(customer).then((editCustomer) => {
		res.send(editCustomer);
	});
}

function deleteAction(req, res) {
	if (req.user.perm_group < 3)
		return res.status(403).send({ message: "not allowed" });

	database.deleteCustomer(req.params.id).then((result) => {
		res.send("ok");
	});
}

module.exports = {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
	getWithClassAction,
	deleteAction,
};
