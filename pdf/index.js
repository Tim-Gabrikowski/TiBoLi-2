const app = require("express").Router();
const pdfService = require("./service");

app.get("/style/books", (req, res) => {
	res.sendFile(__dirname + "/template/books/templateStyle.css");
});
app.get("/style/customers", (req, res) => {
	res.sendFile(__dirname + "/template/customers/templateStyle.css");
});

app.get("/contract/:contractID", (req, res) => {
	res.send(pdfService.getContractPage(Number(req.params.contractID)));
});
app.post("/books", (req, res) => {
	pdfService.createBookPDF(req.body, (pdf) => {
		res.set({
			"Content-Type": "application/pdf",
			"Content-Length": pdf.length,
		});
		res.send(pdf);
	});
});
app.post("/customers", (req, res) => {
	pdfService.createCustomerPDF(req.body, (pdf) => {
		res.set({
			"Content-Type": "application/pdf",
			"Content-Length": pdf.length,
		});
		res.send(pdf);
	});
});

module.exports = app;
