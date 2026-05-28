const Razorpay = require('razorpay');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const Service = require('../../models/Service');
const Settings = require('../../models/Settings');

/**
 * Create Razorpay Order for Booking Payment
 * This API generates a Razorpay order for booking payments
 */
const createBookingPayment = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: 'Unauthorized: No user data found. Please provide a valid token.',
      });
    }

    const { bookingId, currency = 'INR' } = req.body;

    // Validate required fields
    if (!bookingId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Booking ID is required',
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('customer', 'firstName lastName email phone')
      .populate('vendor', 'firstName lastName email phone')
      .populate('service', 'poojaType description price');

    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: 'Booking not found',
      });
    }

    // Check if user has permission to pay for this booking
    if (booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: 'You can only pay for your own bookings',
      });
    }

    // Check if booking is already paid or completed
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Cannot process payment for completed or cancelled bookings',
      });
    }

    // Get Razorpay settings
    const settings = await Settings.findOne({});
    if (!settings || !settings.general || !settings.general.razorpay || !settings.general.razorpay.isActive) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Razorpay payment is not configured',
      });
    }

    const razorpayKeyId = settings.general.razorpay.keyId;
    const razorpayKeySecret = settings.general.razorpay.keySecret;

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Convert amount to paise (Razorpay uses paise for INR)
    const amountInPaise = Math.round(booking.paymentAmount * 100);

    // Generate unique receipt ID
    const receiptId = `booking_${booking.bookingID}_${Date.now()}`;

    // Create Razorpay Order
    const orderOptions = {
      amount: amountInPaise,
      currency: currency,
      receipt: receiptId,
      notes: {
        bookingId: booking._id.toString(),
        bookingID: booking.bookingID,
        customerId: booking.customer._id.toString(),
        vendorId: booking.vendor._id.toString(),
        serviceId: booking.service._id.toString(),
        poojaType: booking.poojaType,
        paymentType: 'booking'
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    // Check if order was created successfully
    if (!order || !order.id) {
      throw new Error('Invalid response from Razorpay API');
    }

    // Return order details for frontend
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: 'Razorpay order created successfully',
      payload: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
        bookingId: booking._id,
        bookingID: booking.bookingID,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phone,
        serviceName: booking.poojaType,
        amountInRupees: booking.paymentAmount,
        receiptId: receiptId
      }
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message || 'Failed to create Razorpay order',
    });
  }
};

/**
 * Verify Razorpay Payment for Booking
 * This API verifies the payment signature and updates booking status
 */
const verifyBookingPayment = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: 'Unauthorized: No user data found. Please provide a valid token.',
      });
    }

    const { orderId, paymentId, signature, bookingId } = req.body;

    // Validate required fields
    if (!orderId || !paymentId || !signature || !bookingId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Order ID, Payment ID, Signature, and Booking ID are required',
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('customer', 'firstName lastName email phone')
      .populate('vendor', 'firstName lastName email phone')
      .populate('service', 'poojaType description price');

    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: 'Booking not found',
      });
    }

    // Check if user has permission to verify payment for this booking
    if (booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: 'You can only verify payment for your own bookings',
      });
    }

    // Get Razorpay settings
    const settings = await Settings.findOne({});
    if (!settings || !settings.general || !settings.general.razorpay) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Razorpay settings not found',
      });
    }

    const razorpayKeySecret = settings.general.razorpay.keySecret;

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: settings.general.razorpay.keyId,
      key_secret: razorpayKeySecret,
    });

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Invalid payment signature',
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Payment not captured',
      });
    }

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.paymentMethod = 'razorpay';
    booking.paymentId = paymentId;
    booking.orderId = orderId;
    booking.status = 'confirmed';
    booking.paidAt = new Date();

    await booking.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: 'Payment verified and booking confirmed successfully',
      payload: {
        booking: booking,
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          capturedAt: payment.captured_at
        }
      }
    });

  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message || 'Failed to verify payment',
    });
  }
};

/**
 * Get Booking Payment Status
 * This API returns the current payment status of a booking
 */
const getBookingPaymentStatus = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: 'Unauthorized: No user data found. Please provide a valid token.',
      });
    }

    const { bookingId } = req.query;

    // Validate required fields
    if (!bookingId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: 'Booking ID is required',
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('customer', 'firstName lastName email phone')
      .populate('vendor', 'firstName lastName email phone')
      .populate('service', 'poojaType description price');

    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: 'Booking not found',
      });
    }

    // Check if user has permission to view this booking
    if (booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: 'You can only view your own bookings',
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: 'Booking payment status retrieved successfully',
      payload: {
        bookingId: booking._id,
        bookingID: booking.bookingID,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        paymentId: booking.paymentId,
        orderId: booking.orderId,
        amount: booking.paymentAmount,
        paidAt: booking.paidAt,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        serviceName: booking.poojaType
      }
    });

  } catch (error) {
    console.error('Error getting booking payment status:', error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message || 'Failed to get booking payment status',
    });
  }
};

module.exports = {
  createBookingPayment,
  verifyBookingPayment,
  getBookingPaymentStatus,
};
