const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getByNumberAction,
	createNewAction,
	setLifecycleAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/:mNumber", getByNumberAction);
router.post("/", createNewAction);
router.put("/", setLifecycleAction);

module.exports = router;
