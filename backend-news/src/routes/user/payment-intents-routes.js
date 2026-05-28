const express = require("express");
const router = express.Router();
const paymentIntents = require("../../controllers/user/payment-intents-controller");
const razorpayIntents = require("../../controllers/user/razorpay-intents-controller");

router.post("/payment-intents", paymentIntents.createPaymentIntent);
router.post("/razorpay-orders", razorpayIntents.createRazorpayOrder);

module.exports = router;
