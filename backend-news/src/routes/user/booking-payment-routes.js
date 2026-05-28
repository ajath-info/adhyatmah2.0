const express = require("express");
const router = express.Router();
const bookingPaymentController = require("../../controllers/user/booking-payment-controller");
const stripeWebhookController = require("../../controllers/user/stripe-webhook-controller");
const verifyToken = require("../../middlewares/jwt-middleware");

// Booking Payment Routes
router.post(
  "/createBookingPayment",
  verifyToken,
  bookingPaymentController.createBookingPayment
);
router.post(
  "/verifyBookingPayment",
  bookingPaymentController.verifyBookingPayment
);
router.get(
  "/getBookingPaymentStatus",
  verifyToken,
  bookingPaymentController.getBookingPaymentStatus
);

// Stripe Webhook Route (no authentication required)
router.post("/stripe-webhook", stripeWebhookController.handleStripeWebhook);

module.exports = router;
