const express = require("express");
const router = express.Router();
const controller = require("../controllers/token-controller");

router.get("/", controller.getAll);
router.post("/add_data", controller.addData);

module.exports = router;