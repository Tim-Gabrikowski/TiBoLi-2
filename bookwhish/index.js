const router = require("express").Router();
const database = require("../database");

router.get("/", (req, res) => {
	database.getWhishes().then((whishes) => {
		res.send(whishes);
	});
});
router.post("/", (req, res) => {
	const { title, author, hint } = req.body;
	var whish = {
		title: title,
		author: author,
		hint: hint,
	};
	database.createWhish(whish).then((result) => {
		res.send(result);
	});
});

module.exports = router;
