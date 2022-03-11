const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/:bNumber", getNumberAction);
router.put("/", (req, res) => {
	if (req.body.bNumber === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});

module.exports = router;
