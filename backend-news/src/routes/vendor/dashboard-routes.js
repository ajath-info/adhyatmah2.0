const express = require("express");
const router = express.Router();
const dashboard = require("../../controllers/vendor/dashboard-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getVendor } = require("../../middlewares/getVendor-middleware");

router.get(
  "/vendor/dashboard-analytics",
  verifyToken,
  getVendor,
  dashboard.getVendorAnalytics
);
router.get(
  "/vendor/services",
  verifyToken,
  getVendor,
  dashboard.getVendorServices
);

module.exports = router;
