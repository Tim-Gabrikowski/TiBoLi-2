const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getIdAction,
	createNewAction,
	updateAction,
	getCopiesAction,
	getSearchTermAction,
	deleteBookAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/search/:term", getSearchTermAction);
router.get("/:id", getIdAction);
router.put("/", (req, res) => {
	if (req.body.id === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});
router.get("/:id/copies", getCopiesAction);
router.delete("/:id", deleteBookAction);

module.exports = router;
