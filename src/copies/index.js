const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getByNumberAction,
	createNewAction,
	setLifecycleAction,
} = require("./controller");
const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, getAllAction);
router.get("/:mNumber", authenticateToken, getByNumberAction);
router.post("/", authenticateToken, createNewAction);
router.put("/", authenticateToken, setLifecycleAction);

module.exports = router;
