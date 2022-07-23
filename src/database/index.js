const { Op } = require("sequelize");
const Sequelize = require("sequelize");
require("dotenv").config();

var con = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
	port: process.env.DATABASE_PORT,
	host: process.env.DATABASE_HOST,
	logging: console.log,
	dialect: "mysql",
});

/* Models */
const Book = con.define(
	"book",
	{
		title: Sequelize.STRING,
		author: Sequelize.STRING,
		subtitle: Sequelize.STRING,
		isbn: Sequelize.STRING,
		publisher: Sequelize.STRING,
		year: Sequelize.STRING,
		age: Sequelize.STRING,
	},
	{ paranoid: true }
);
const Copy = con.define(
	"copy",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		lifecycle: Sequelize.INTEGER,
	},
	{ paranoid: true, initialAutoIncrement: 1111 }
);
const Customer = con.define(
	"customer",
	{
		name: Sequelize.STRING,
		lastname: Sequelize.STRING,
	},
	{ paranoid: true }
);
const Class = con.define(
	"class",
	{
		year: Sequelize.INTEGER,
		letter: Sequelize.STRING,
		teachers: Sequelize.STRING,
	},
	{ paranoid: true }
);
const Transaction = con.define(
	"transaction",
	{
		lentDate: Sequelize.BIGINT,
		backDate: Sequelize.BIGINT,
		maxBack: Sequelize.BIGINT,
	},
	{ paranoid: true }
);
const Wish = con.define(
	"wish",
	{
		title: {
			type: Sequelize.STRING,
		},
		author: {
			type: Sequelize.STRING,
		},
		hint: {
			type: Sequelize.TEXT,
		},
	},
	{ paranoid: false }
);
const User = con.define(
	"user",
	{
		username: {
			type: Sequelize.STRING,
			unique: "username",
			// allowNull: false,
		},
		password_hash: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		perm_group: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		mail: {
			type: Sequelize.STRING,
		},
	},
	{ paranoid: false }
);

const Setting = con.define("setting", {
	key: {
		type: Sequelize.STRING,
	},
	value: {
		type: Sequelize.STRING,
	},
});

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

// Customer - User
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
	return Book.update(newBook, { where: { id: newBook.id } });
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
		include: [Class],
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
	return Customer.update(customer, { where: { id: customer.id } });
}
function deleteCustomer(id) {
	return Customer.destroy({ where: { id: id } });
}

/* Classes */
function getAllClasses() {
	return Class.findAll({ attributes: ["id", "year", "letter"] });
}
function getClassById(id) {
	return Class.findAll({
		where: { id: id },
	});
}
function createClass(newClass) {
	return Class.create(newClass);
}
function updateClass(nClass) {
	return Class.update(nClass, { where: { id: nClass.id } });
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
function getUnfinnishedTransactions(mNum) {
	return Transaction.findAll({
		where: { copyId: mNum, backdate: { [Op.is]: null } },
	});
}
function createNewTransaction(transaction) {
	return Transaction.create(transaction);
}
function finnishTransaction(transaction) {
	return Transaction.update(
		{ backDate: transaction.backDate },
		{ where: { copyId: transaction.copyId, backDate: { [Op.is]: null } } }
	);
}
function extendTransaction(mNum, date) {
	return Transaction.update({ maxBack: date }, { where: { copyId: mNum, backDate: { [Op.is]: null } } });
}

/* Users */
function getAllUsers() {
	return User.findAll({
		attributes: ["id", "username", "perm_group", "customerId"],
	});
}
function getUserById(id) {
	return User.findAll({
		where: { id: id },
		include: [{ model: Customer, include: [Class] }],
	});
}
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
function deleteUser(id) {
	return User.destroy({ where: { id: id } });
}
/* Wishes */
function createWish(wish) {
	return Wish.create(wish);
}
function getWishes() {
	return Wish.findAll();
}

// delete everything
function clearDatabase() {
	return con.sync({ force: true });
}

// Settings
function getSetting(key) {
	return Setting.findAll({ where: { key: key } });
}
function createSetting(setting) {
	return Setting.create(setting);
}
function updateSetting(setting) {
	return Setting.update(setting, { where: { id: setting.id } });
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
	createClass,
	updateClass,
	//transactions:
	getAllTransactions,
	getTransactionsByCustomer,
	getTransactionByCustomerWithBooks,
	countUnfinnishedTransactions,
	getUnfinnishedTransactions,
	createNewTransaction,
	finnishTransaction,
	extendTransaction,
	//users:
	getAllUsers,
	getUserById,
	getUserByUsername,
	createNewUser,
	getUserByCustomer,
	updateUser,
	deleteUser,
	//wishes:
	createWish,
	getWishes,
	//admin stuff
	clearDatabase,
	getSetting,
	createSetting,
	updateSetting,
};
