const { randomInt } = require("crypto");
var fs = require("fs");
const puppeteer = require("puppeteer");
require("dotenv").config();

// var testBook = {
// 	mNumber: 123456789,
// 	title: "Der Marsianer",
// 	author: "Andy Weir",
// };
// startAt = "13";

var contracts = [];

async function printPDF(contractID) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(
		"http://" + process.env.HOST_NAME + "/pdf/contract/" + contractID,
		{
			waitUntil: "networkidle0",
		}
	);
	const pdf = await page.pdf({ format: "A4" });

	await browser.close();
	return pdf;
}

module.exports = {
	createBookPDF(inputData, callback) {
		//generate contractID for filename
		const contractID = randomInt(99999);
		const data = {
			books: [],
		};

		for (var i = 0; i < inputData.books.length; i++) {
			var element = inputData.books[i];

			var row = Math.floor((inputData.startAt + i) / 3);
			var cell = (inputData.startAt + i) % 3;
			element.position = `${row}${cell}`;

			data.books.push(element);
		}

		//read Template and replace Placeholders with Data:
		var html = fs.readFileSync(
			__dirname + "/template/books/template.html",
			"utf8"
		);
		html = html.replace('"-INPUT-"', JSON.stringify(data));
		html = html.replace("--HOST--", process.env.HOST_NAME);

		contracts.push({
			id: contractID,
			page: html,
		});
		//generate pdf to file with contractID as part of name
		printPDF(contractID).then((res) => {
			//return filename to callback
			callback(res);
		});
	},
	createCustomerPDF(inputData, callback) {
		//generate contractID for filename
		const contractID = randomInt(99999);
		const data = {
			customers: [],
		};

		for (var i = 0; i < inputData.customers.length; i++) {
			var element = inputData.customers[i];

			var row = Math.floor((inputData.startAt + i) / 3);
			var cell = (inputData.startAt + i) % 3;
			element.position = `${row}${cell}`;

			data.customers.push(element);
		}

		//read Template and replace Placeholders with Data:
		var html = fs.readFileSync(
			__dirname + "/template/customers/template.html",
			"utf8"
		);
		html = html.replace('"-INPUT-"', JSON.stringify(data));
		html = html.replace("--HOST--", process.env.HOST_NAME);

		contracts.push({
			id: contractID,
			page: html,
		});
		//generate pdf to file with contractID as part of name
		printPDF(contractID).then((res) => {
			//return filename to callback
			callback(res);
		});
	},
	getContractPage(contractID) {
		fContracts = contracts.filter((contract) => contract.id == contractID);
		contracts = contracts.filter((contract) => contract.id != contractID);

		return fContracts[0].page;
	},
};
