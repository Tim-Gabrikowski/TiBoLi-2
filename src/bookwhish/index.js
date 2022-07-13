const router = require("express").Router();
const database = require("../database");
const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, (req, res) => {
	database.getWhishes().then((whishes) => {
		res.send(whishes);
	});
});
router.post("/", authenticateToken, (req, res) => {
	if (req.user.perm_group < 1)
		return res.status(403).send({ message: "not allowed" });
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
