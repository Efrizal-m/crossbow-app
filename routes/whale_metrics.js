const express = require("express");
const router = express.Router();
const controller = require("../controllers/whale-controller");

router.get("/metrics/:project", controller.getMetrics);

module.exports = router;