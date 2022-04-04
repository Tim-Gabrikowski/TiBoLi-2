const router = require("express").Router();
const settings = require("../appSettings.json");
const levensthein = require("js-levenshtein");

router.post("/login", (req, res) => {
	const input = `${req.body.password}`;

	var dist = levensthein(input, settings.login.password);

	if (req.body.password == settings.login.password) {
		console.log("Login?", "{ password: '*********'", "Distance:", dist);
		console.log("ok");
		res.status(200).send({ ok: true });
	} else {
		console.log("Login?", req.body, "Distance:", dist);
		console.log("no.");
		res.send({ ok: false });
	}
});

module.exports = router;
