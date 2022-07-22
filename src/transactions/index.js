const express = require("express");
const router = express.Router();
const {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
	getTransactionByCustomerAction,
	getTransactionByCustomerWithBooksAction,
	extendTransactionAction,
} = require("./controller.js");

const { authenticateToken } = require("../auth");

router.get("/", authenticateToken, getAllAction);
router.get("/customer/:bNumber", authenticateToken, getTransactionByCustomerAction);
router.get("/customer/:bNumber/books", authenticateToken, getTransactionByCustomerWithBooksAction);
router.post("/lent", authenticateToken, newTransactionAction);
router.post("/back", authenticateToken, finnishTransactionAction);
router.put("/extend", authenticateToken, extendTransactionAction);

module.exports = router;
