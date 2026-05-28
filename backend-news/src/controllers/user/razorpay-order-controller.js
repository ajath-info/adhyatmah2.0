const Razorpay = require("razorpay");
const Settings = require("../../models/Settings");

/*    Create a Razorpay Order for General Payments  */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Get settings from database
    const settings = await Settings.findOne({});
    let razorpayKeyId,
      razorpayKeySecret,
      isActive = false;

    if (settings && settings.general && settings.general.razorpay) {
      const { razorpay } = settings.general;
      isActive = razorpay.isActive;
      razorpayKeyId = razorpay.keyId;
      razorpayKeySecret = razorpay.keySecret;
    }

    // Fallback to environment variables if database settings not available
    if (!razorpayKeyId || !razorpayKeySecret) {
      razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      isActive = true; // Enable if env vars are available
    }

    // Final fallback to hardcoded test credentials
    if (!razorpayKeyId || !razorpayKeySecret) {
      razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      isActive = true;
      console.log("[Razorpay] Using fallback test credentials");
    }

    // Check if Razorpay is active
    if (!isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Razorpay is not active" });
    }

    // Validate required credentials
    if (!razorpayKeyId || !razorpayKeySecret) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Razorpay credentials not configured",
        });
    }

    // Initialize Razorpay with credentials
    const razorpayInstance = new Razorpay({
      key_id: razorpayKeyId.trim(),
      key_secret: razorpayKeySecret.trim(),
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

      console.log(`[Razorpay] Order created successfully: ${order.id}`);

      return res.status(201).json({
        success: true,
        order_id: order.id,
        key_id: razorpayKeyId,
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

/*    Verify Razorpay Payment Signature  */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters",
      });
    }

    // Get settings
    const settings = await Settings.findOne({});
    let razorpayKeySecret = "XLboVz3YHI0FTt930ny3kT35"; // Default fallback

    if (
      settings &&
      settings.general &&
      settings.general.razorpay &&
      settings.general.razorpay.keySecret
    ) {
      razorpayKeySecret = settings.general.razorpay.keySecret;
    } else if (process.env.RAZORPAY_KEY_SECRET) {
      razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    }

    // Create signature for verification
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      console.log(
        `[Razorpay] Payment verified successfully: ${razorpay_payment_id}`
      );
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.log(`[Razorpay] Payment verification failed`);
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*    Test Razorpay Configuration  */
const testRazorpayConfig = async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    let razorpayKeyId,
      razorpayKeySecret,
      isActive = false;

    if (settings && settings.general && settings.general.razorpay) {
      const { razorpay } = settings.general;
      isActive = razorpay.isActive;
      razorpayKeyId = razorpay.keyId;
      razorpayKeySecret = razorpay.keySecret;
    }

    // Check environment variables
    const envKeyId = process.env.RAZORPAY_KEY_ID;
    const envKeySecret = process.env.RAZORPAY_KEY_SECRET;

    return res.status(200).json({
      success: true,
      message: "Razorpay configuration checked",
      data: {
        database: {
          isActive: isActive,
          hasKeyId: !!razorpayKeyId,
          hasKeySecret: !!razorpayKeySecret,
          keyIdPreview: razorpayKeyId
            ? `${razorpayKeyId.substring(0, 6)}...${razorpayKeyId.substring(
                -4
              )}`
            : null,
        },
        environment: {
          hasKeyId: !!envKeyId,
          hasKeySecret: !!envKeySecret,
          keyIdPreview: envKeyId
            ? `${envKeyId.substring(0, 6)}...${envKeyId.substring(-4)}`
            : null,
        },
        fallback: {
          usingDefault: !razorpayKeyId && !envKeyId,
          defaultKeyId: "rzp_test_RommAf968XGDuV",
        },
      },
    });
  } catch (error) {
    console.error("Error testing Razorpay config:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  testRazorpayConfig,
};
