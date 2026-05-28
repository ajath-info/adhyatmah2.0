const express = require("express");
const router = express.Router();
const unifiedHome = require("../../controllers/user/unified-home-controller");

// Single unified endpoint for all homepage data
router.get("/home/unified", unifiedHome.getUnifiedHomeData);

module.exports = router;
