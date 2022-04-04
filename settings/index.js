const router = require("express").Router();
const settings = require("../appSettings.json");
const levensthein = require("js-levenshtein");

router.post("/login", (req, res) => {
	const input = `${req.body.password}`;

	var dist = levensthein(input, settings.login.password);
	console.log("Login?", req.body, "Distance:", dist);

	if (req.body.password == settings.login.password) {
		console.log("ok");
		res.status(200).send({ ok: true });
	} else {
		res.send({ ok: false });
	}
});

module.exports = router;
