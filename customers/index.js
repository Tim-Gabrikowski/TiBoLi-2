const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
	getWithClassAction,
	deleteAction,
} = require("./controller");

const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, getAllAction);
router.get("/:bNumber", authenticateToken, getNumberAction);
router.get("/:bNumber/class", authenticateToken, getWithClassAction);
router.put("/", authenticateToken, (req, res) => {
	if (req.body.id === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});
router.delete("/:id", authenticateToken, deleteAction);

module.exports = router;
