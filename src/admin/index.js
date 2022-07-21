const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../auth");
const database = require("../database");
const fs = require("fs");
const { backup, getProgress, createZipArchive } = require("./backup");

router.get("/", (req, res) => {
	res.send({ message: "ok" });
});

router.post("/import/books", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "not allowed" });

	const filename = req.body.filename;

	fs.readFile("src/admin/files/" + filename, (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ message: "file not found" });
		}
		const inputData = JSON.parse(data);

		inputData.forEach((element) => {
			var book = {
				title: element.title,
				subtitle: element.subtitle,
				author: element.author,
				isbn: element.isbn,
				publisher: element.publisher,
				year: element.year,
			};
			database.createNewBook(book).then((newBook) => {
				element.mNums.forEach((num) => {
					database.createNewCopy(newBook.id, Number(num));
				});
			});
		});
	});
});
router.post("/import/customers", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "not allowed" });

	const filename = req.body.filename;

	fs.readFile("src/admin/files/" + filename, (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ message: "file not found" });
		}
		const inputData = JSON.parse(data);

		inputData.forEach((element) => {
			var book = {
				title: element.title,
				subtitle: element.subtitle,
				author: element.author,
				isbn: element.isbn,
				publisher: element.publisher,
				year: element.year,
			};
			database.createNewBook(book).then((newBook) => {
				element.mNums.forEach((num) => {
					database.createNewCopy(newBook.id, Number(num));
				});
			});
		});
	});
});

router.post("/upload", async (req, res) => {
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: "No file uploaded",
			});
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let books = req.files.books;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			books.mv("src/admin/files/" + books.name);

			//send response
			res.send({
				status: true,
				message: "File is uploaded",
				data: {
					name: books.name,
					mimetype: books.mimetype,
					size: books.size,
				},
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/backup", (req, res) => {
	backup();
	res.send({ message: "will do so" });
});
router.get("/backup/progress", (req, res) => {
	res.send(getProgress());
});
router.get("/backup/file", async (req, res) => {
	await createZipArchive();
	res.sendFile(__dirname + "/backup/backup.zip");
});

module.exports = router;
