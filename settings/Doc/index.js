const router = require("express").Router();
const chapters = require("./chapters.json");

router.get("/", (req, res) => {
	res.send(chapters);
});
router.get("/chapter/:id", (req, res) => {
	var cpt = chapters.find((element) => element.id == Number(req.params.id));
	res.sendFile(__dirname + "/assets/" + cpt.filename);
});

module.exports = router;
