const express = require("express");
const router = express.Router();
const {
	getAllAction,
	newTransactionAction,
	finnishTransactionAction,
} = require("./controller.js");

router.get("/", getAllAction);
router.post("/lent", newTransactionAction);
router.post("/back", finnishTransactionAction);

module.exports = router;
