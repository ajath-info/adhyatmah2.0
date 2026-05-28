const Razorpay = require("razorpay");
const Settings = require("../../models/Settings");

/*    Create a Razorpay Order for General Payments  */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const settings = await Settings.findOne({});
    if (!settings || !settings.general || !settings.general.razorpay) {
      return res
        .status(400)
        .json({ success: false, message: "Razorpay settings not found" });
    }

    const { razorpay } = settings.general;

    // Check if Razorpay is active
    if (!razorpay.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Razorpay is not active" });
    }

    // Validate required credentials
    if (!razorpay.keyId || !razorpay.keySecret) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Razorpay credentials not configured",
        });
    }

    // Initialize Razorpay with dynamic credentials
    const razorpayInstance = new Razorpay({
      key_id: razorpay.keyId.trim(),
      key_secret: razorpay.keySecret.trim(),
    });

    // Convert amount to paise (Razorpay uses paise for INR)
    const amountInPaise = Math.round(amount * 100);

    // Generate unique receipt ID (max 40 characters for Razorpay)
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    const receiptId = `ORDER_${timestamp.slice(-8)}_${random}`;

    // Create Razorpay Order
    const orderOptions = {
      amount: amountInPaise,
      currency: currency,
      receipt: receiptId,
      notes: {
        paymentType: "general",
        userId: req.user?._id?.toString() || "anonymous",
        orderSource: "adhyatmah_app",
      },
    };

    try {
      const order = await razorpayInstance.orders.create(orderOptions);

      return res.status(201).json({
        success: true,
        order_id: order.id,
        key_id: razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        description: "Adhyatmah App Order Payment",
      });
    } catch (razorpayError) {
      console.error("Razorpay order creation error:", razorpayError);

      // Handle specific Razorpay errors
      if (razorpayError.statusCode === 401) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay authentication failed. Please check your API credentials.",
        });
      }

      if (razorpayError.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: `Razorpay error: ${
            razorpayError.error?.description || razorpayError.message
          }`,
        });
      }

      return res.status(400).json({
        success: false,
        message: `Failed to create Razorpay order: ${razorpayError.message}`,
      });
    }
  } catch (error) {
    console.error("Error in createRazorpayOrder:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
};
