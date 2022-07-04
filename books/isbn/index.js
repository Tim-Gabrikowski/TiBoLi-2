const router = require("express").Router();
const fetch = require("node-fetch");

router.get("/:isbn", (req, res) => {
	var isbn = req.params.isbn;
	fetch(
		"https://openlibrary.org/api/books?bibkeys=ISBN:" +
			isbn +
			"&format=json&jscmd=data"
	)
		.then((res) => res.json())
		.then((json) => {
			res.send(json["ISBN:" + isbn]);
		});
});

module.exports = router;
