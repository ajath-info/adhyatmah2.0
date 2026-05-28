const express = require("express");
const router = express.Router();
const razorpayOrderController = require("../../controllers/user/razorpay-order-controller");
const verifyToken = require("../../middlewares/jwt-middleware");

// Razorpay Order Creation Route (matching frontend expectation)
router.post(
  "/razorpay-orders",
  verifyToken,
  razorpayOrderController.createRazorpayOrder
);

// Razorpay Payment Verification Route
router.post(
  "/verify-razorpay-payment",
  verifyToken,
  razorpayOrderController.verifyRazorpayPayment
);

// Test Razorpay Configuration Route (NO TOKEN REQUIRED)
router.get("/test-razorpay", razorpayOrderController.testRazorpayConfig);

// Simple Razorpay Order Test (NO TOKEN REQUIRED)
router.post("/razorpay-test", razorpayOrderController.createRazorpayOrder);

module.exports = router;
