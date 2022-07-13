const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../auth");

const {
	getClassesAction,
	getClassByIdAction,
	createNewClassAction,
	updateClassAction,
} = require("./controller");

router.get("/", authenticateToken, getClassesAction);
router.get("/:id", authenticateToken, getClassByIdAction);
router.post("/", authenticateToken, createNewClassAction);
router.put("/", authenticateToken, updateClassAction);

module.exports = router;
