const express = require("express");
const router = express.Router();
const {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByUserAction,
	getTransactionByUserWithBooksAction,
} = require("./controller.js");

const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, getAllAction);
router.get("/user/:bNumber", authenticateToken, getTransactionByUserAction);
router.get(
	"/user/:bNumber/books",
	authenticateToken,
	getTransactionByUserWithBooksAction
);
router.post("/lent", authenticateToken, newTransactionAction);
router.post("/back", authenticateToken, finnishTransactionAction);

module.exports = router;
