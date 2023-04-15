const express = require("express");
const router = express.Router();

// Routes
const relatedRouter = require("./related_metrics");
const whaleRouter = require("./whale_metrics");
const tokenRouter = require("./token");

router.get("/", (req,res) => {res.status(200).json('in')});
router.use("/related", relatedRouter);
router.use("/whale", whaleRouter);
router.use("/token", tokenRouter);

module.exports = router;