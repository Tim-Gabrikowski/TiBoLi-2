const { Op } = require("sequelize");
const Secuelize = require("sequelize");
require("dotenv").config();

var con = new Secuelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{
		port: process.env.DATABASE_PORT,
		host: process.env.DATABASE_HOST,
		logging: console.log,
		dialect: "mysql",
	}
);

/* Models */
const Book = con.define(
	"book",
	{
		title: Secuelize.STRING,
		author: Secuelize.STRING,
	},
	{ paranoid: true }
);
const Copy = con.define(
	"copy",
	{
		id: {
			type: Secuelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		lifecycle: Secuelize.INTEGER,
	},
	{ paranoid: true, initialAutoIncrement: 1111 }
);
const Customer = con.define(
	"customer",
	{
		name: Secuelize.STRING,
		lastname: Secuelize.STRING,
	},
	{ paranoid: true }
);
const Class = con.define(
	"class",
	{
		year: Secuelize.INTEGER,
		letter: Secuelize.STRING,
	},
	{ paranoid: true }
);
const Transaction = con.define(
	"transaction",
	{
		lentDate: Secuelize.BIGINT,
		backDate: Secuelize.BIGINT,
	},
	{ paranoid: true }
);
const User = con.define(
	"user",
	{
		username: {
			type: Secuelize.STRING,
			unique: true,
			allowNull: false,
		},
		password_hash: {
			type: Secuelize.STRING,
			allowNull: false,
		},
		perm_group: {
			type: Secuelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{ paranoid: true }
);

/* Connections */

// Book - Copy
Book.hasMany(Copy);
Copy.belongsTo(Book);

// Copy - Transaction
Copy.hasMany(Transaction);
Transaction.belongsTo(Copy);

// Customer - Transaction
Customer.hasMany(Transaction);
Transaction.belongsTo(Customer);

// Customer - Class
Class.hasMany(Customer);
Customer.belongsTo(Class);

//Customer - User
Customer.hasOne(User);
User.belongsTo(Customer);

con.sync({ alter: true });

/* books */
function getAllBooks() {
	return Book.findAll();
}
function getBookById(id) {
	return Book.findAll({ where: { id: id } });
}
function createNewBook(book) {
	return Book.create(book);
}
function updateExistingBook(newBook) {
	return Book.update(
		{ title: newBook.title, author: newBook.author },
		{
			where: {
				id: newBook.id,
			},
		}
	);
}
function deleteBook(id) {
	return Book.destroy({ where: { id: id } });
}

/* copies */
function getAllCopies() {
	return Copy.findAll({
		where: {
			lifecycle: {
				[Op.ne]: 5,
			},
		},
	});
}
function getCopiesFromBook(bookId) {
	return Copy.findAll({ where: { bookId: bookId } });
}
function getCopyByNumber(mNumber) {
	return Copy.findAll({ where: { id: mNumber } });
}
function createNewCopy(bookId) {
	return Copy.create({ bookId: bookId, lifecycle: 1 });
}
function updateCopyLifecycle(copyId, lifecycle) {
	return Copy.update({ lifecycle: lifecycle }, { where: { id: copyId } });
}

/* Customers */
function getAllCustomers() {
	return Customer.findAll({
		attributes: ["id", "name", "lastname", "classid"],
	});
}
function getCustomerById(id) {
	return Customer.findAll({
		where: { id: id },
	});
}
function createNewCustomer(customer) {
	return Customer.create({
		name: customer.name,
		lastname: customer.lastname,
		classId: customer.classId,
	});
}
function updateCustomer(customer) {
	return Customer.update(
		{
			name: customer.name,
			lastname: customer.lastname,
			classId: customer.classId,
		},
		{ where: { id: customer.id } }
	);
}
function deleteCustomer(id) {
	return Customer.destroy({ where: { id: id } });
}

/* Classes */
function getAllClasses() {
	return Class.findAll({ attributes: ["id", "year", "letter"] });
}
function getClassById(id) {
	return Class.findAll({ where: { id: id } });
}

/* Transactions */
function getAllTransactions() {
	return Transaction.findAll();
}
function getTransactionsByCustomer(bNum) {
	return Transaction.findAll({ where: { customerId: bNum } });
}
function getTransactionByCustomerWithBooks(bNum) {
	return Transaction.findAll({
		where: { customerId: bNum },
		include: [{ model: Copy, include: [Book] }],
	});
}
function countUnfinnishedTransactions(mNum) {
	return Transaction.count({
		where: { copyId: mNum, backdate: { [Op.is]: null } },
	});
}
function createNewTransaction(transaction) {
	return Transaction.create({
		lentDate: transaction.lentDate,
		copyId: transaction.copy,
		customerId: transaction.customer,
	});
}
function finnishTransaction(mNum, date) {
	return Transaction.update(
		{ backDate: date },
		{ where: { copyId: mNum, backDate: { [Op.is]: null } } }
	);
}

/* Users */
function getUserByUsername(username) {
	return User.findAll({ where: { username: username } });
}
function getUserByCustomer(customerId) {
	return User.findAll({
		where: { customerId: customerId },
		attributes: ["id", "username", "perm_group", "customerId"],
	});
}
function createNewUser(user) {
	return User.create(user);
}
function updateUser(user) {
	return User.update(user, { where: { id: user.id } });
}

module.exports = {
	//books
	getAllBooks,
	getBookById,
	createNewBook,
	updateExistingBook,
	deleteBook,
	//copies
	getAllCopies,
	getCopiesFromBook,
	getCopyByNumber,
	createNewCopy,
	updateCopyLifecycle,
	//customers
	getAllCustomers,
	getCustomerById,
	createNewCustomer,
	updateCustomer,
	deleteCustomer,
	//classes
	getAllClasses,
	getClassById,
	//transactions:
	getAllTransactions,
	getTransactionsByCustomer,
	getTransactionByCustomerWithBooks,
	countUnfinnishedTransactions,
	createNewTransaction,
	finnishTransaction,
	//users:
	getUserByUsername,
	createNewUser,
	getUserByCustomer,
	updateUser,
};
