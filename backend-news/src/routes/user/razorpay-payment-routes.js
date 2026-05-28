const express = require("express");
const router = express.Router();
const razorpayPaymentController = require("../../controllers/user/razorpay-payment-controller");
const razorpayWebhookController = require("../../controllers/user/razorpay-webhook-controller");
const verifyToken = require("../../middlewares/jwt-middleware");

// Razorpay Booking Payment Routes
router.post("/createBookingPayment", verifyToken, razorpayPaymentController.createBookingPayment);
router.post("/verifyBookingPayment", verifyToken, razorpayPaymentController.verifyBookingPayment);
router.get("/getBookingPaymentStatus", verifyToken, razorpayPaymentController.getBookingPaymentStatus);

// Razorpay Webhook Route (no authentication required)
router.post("/razorpay-webhook", razorpayWebhookController.handleRazorpayWebhook);

module.exports = router;
