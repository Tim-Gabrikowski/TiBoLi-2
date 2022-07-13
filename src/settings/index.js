const router = require("express").Router();

const documentationRouter = require("./Doc");

router.use("/documentation", documentationRouter);

module.exports = router;
