const express = require("express");
const router = express.Router();
const {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByUserAction,
} = require("./controller.js");

router.get("/", getAllAction);
router.get("/user/:bNumber", getTransactionByUserAction);
router.post("/lent", newTransactionAction);
router.post("/back", finnishTransactionAction);

module.exports = router;
