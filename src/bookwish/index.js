const router = require("express").Router();
const database = require("../database");
const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, (req, res) => {
	database.getWishes().then((wishes) => {
		res.send(wishes);
	});
});
router.post("/", authenticateToken, (req, res) => {
	if (req.user.perm_group < 1) return res.status(403).send({ message: "not allowed" });
	const { title, author, hint } = req.body;
	var wish = {
		title: title,
		author: author,
		hint: hint,
	};
	database.createWish(wish).then((result) => {
		res.send(result);
	});
});

module.exports = router;
