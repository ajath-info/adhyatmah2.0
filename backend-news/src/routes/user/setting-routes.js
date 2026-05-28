const express = require("express");
const settings = require("../../controllers/user/setting-controller");
const router = express.Router();

router.get("/settings/main", settings.getMainSettings);
router.get("/settings/branding", settings.getBrandingSettings);
router.get("/settings/home", settings.getHomeSettings);
router.get("/settings/general", settings.getGeneralSettings);
router.get("/settings/stripe-key", settings.getStripePublishableKey);
router.get("/settings/test-stripe", settings.testStripeConnection);

module.exports = router;
