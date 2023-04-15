const express = require("express");
const router = express.Router();
const controller = require("../controllers/related-metrics-controller");

router.post("/nft", controller.setRelatedNFTLists);
router.post("/token", controller.setRelatedTokenLists);
router.get("/nft/:project", controller.getRelatedNFTHolderStats);
router.get("/token/:project", controller.getRelatedTokenHolderStats);


module.exports = router;