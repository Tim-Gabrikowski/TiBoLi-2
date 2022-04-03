const router = require("express").Router();
const settings = require("../appSettings.json");

router.post("/login", (req, res) => {
	console.log("login?", req.body);
	if (req.body.password == settings.login.password) {
		console.log("ok");
		res.status(200).send({ ok: true });
	} else {
		res.send({ ok: false });
	}
});

module.exports = router;
