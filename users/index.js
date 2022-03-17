const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getNumberAction,
	createNewAction,
	updateAction,
	getWithClassAction,
	getClassesAction,
	deleteAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/classes", getClassesAction);
router.get("/:bNumber", getNumberAction);
router.get("/:bNumber/class", getWithClassAction);
router.put("/", (req, res) => {
	if (req.body.id === undefined) {
		createNewAction(req, res);
	} else {
		updateAction(req, res);
	}
});
router.delete("/:id", deleteAction);

module.exports = router;
