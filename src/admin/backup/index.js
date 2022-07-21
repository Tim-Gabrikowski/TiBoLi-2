const database = require("../../database");
const fs = require("fs");
const AdmZip = require("adm-zip");

const progress_default = {
	books: false,
	copies: false,
	customers: false,
	classes: false,
	transactions: false,
	wishes: false,
	users: false,
};
var progress = progress_default;

function backup() {
	progress = progress_default;
	//backup to file
	database.getAllBooks().then((books) => {
		fs.writeFile("./src/admin/backup/data/books.json", JSON.stringify(books), (err) => {
			if (err) throw err;
			progress.books = true;
		});
	});
	database.getAllCopies().then((copies) => {
		fs.writeFile("./src/admin/backup/data/copies.json", JSON.stringify(copies), (err) => {
			if (err) throw err;
			progress.copies = true;
		});
	});
	database.getAllCustomers().then((customers) => {
		fs.writeFile("./src/admin/backup/data/customers.json", JSON.stringify(customers), (err) => {
			if (err) throw err;
			progress.customers = true;
		});
	});
	database.getAllClasses().then((classes) => {
		fs.writeFile("./src/admin/backup/data/classes.json", JSON.stringify(classes), (err) => {
			if (err) throw err;
			progress.classes = true;
		});
	});
	database.getAllTransactions().then((transactions) => {
		fs.writeFile("./src/admin/backup/data/transactions.json", JSON.stringify(transactions), (err) => {
			if (err) throw err;
			progress.transactions = true;
		});
	});
	database.getWishes().then((wishes) => {
		fs.writeFile("./src/admin/backup/data/wishes.json", JSON.stringify(wishes), (err) => {
			if (err) throw err;
			progress.wishes = true;
		});
	});
	database.getAllUsers().then((users) => {
		fs.writeFile("./src/admin/backup/data/users.json", JSON.stringify(users), (err) => {
			if (err) throw err;
			progress.users = true;
		});
	});
}

function getProgress() {
	return progress;
}
async function createZipArchive() {
	if (!checkDone()) return null;
	const zip = new AdmZip();
	const outputFile = "./src/admin/backup/backup.zip";
	zip.addLocalFolder("./src/admin/backup/data");
	zip.writeZip(outputFile);
	console.log(`Created ${outputFile} successfully`);
	return outputFile;
}
function checkDone() {
	return (
		progress.books &&
		progress.copies &&
		progress.classes &&
		progress.customers &&
		progress.transactions &&
		progress.users &&
		progress.wishes
	);
}

module.exports = {
	backup,
	getProgress,
	createZipArchive,
};
