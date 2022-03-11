const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getIdAction,
	createNewAction,
	updateAction,
	getCopiesAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/:id", getIdAction);
router.put("/", (req, res) => {
	if (req.body.id === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});
router.get("/:id/copies", getCopiesAction);
module.exports = router;
