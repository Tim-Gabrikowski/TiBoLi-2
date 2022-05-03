const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getByNumberAction,
	createNewAction,
	setLifecycleAction,
} = require("./controller");
const { authenticateToken } = require("../auth");

router.get("/", getAllAction);
router.get("/:mNumber", getByNumberAction);
router.post("/", authenticateToken, createNewAction);
router.put("/", authenticateToken, setLifecycleAction);

module.exports = router;
