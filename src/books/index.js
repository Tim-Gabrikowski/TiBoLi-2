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
const { authenticateToken } = require("../auth");
const isbnRouter = require("./isbn");
router.use("/isbn", isbnRouter);

router.get("/", authenticateToken, getAllAction);
router.get("/search/title/:term", authenticateToken, searchByTitleAction);
router.get("/search/author/:term", authenticateToken, searchByAuthorAction);
router.get("/:id", authenticateToken, getIdAction);
router.put("/", authenticateToken, (req, res) => {
	if (req.body.id === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});
router.get("/:id/copies", authenticateToken, getCopiesAction);
router.delete("/:id", authenticateToken, deleteBookAction);

module.exports = router;
