const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getIdAction,
	createNewAction,
	updateAction,
	getCopiesAction,
	searchByTitleAction,
	searchByAuthorAction,
	deleteBookAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/search/title/:term", searchByTitleAction);
router.get("/search/author/:term", searchByAuthorAction);
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
