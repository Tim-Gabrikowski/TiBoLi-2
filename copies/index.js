const express = require("express");
const router = express.Router();
const {
	getAllAction,
	getByNumberAction,
	createNewAction,
} = require("./controller");

router.get("/", getAllAction);
router.get("/:mNumber", getByNumberAction);
router.post("/", createNewAction);

module.exports = router;
