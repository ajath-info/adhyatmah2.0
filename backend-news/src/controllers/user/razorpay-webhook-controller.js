const Razorpay = require('razorpay');
const Booking = require('../../models/Booking');
const Settings = require('../../models/Settings');
const crypto = require('crypto');

/**
 * Razorpay Webhook Handler for Booking Payments
 * This handles Razorpay webhook events to automatically update booking status
 */
const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_99';

    // Get Razorpay settings
    const settings = await Settings.findOne({});
    if (!settings || !settings.general || !settings.general.razorpay) {
      console.error('Razorpay settings not found');
      return res.status(400).send('Razorpay settings not found');
    }

    const razorpayKeySecret = settings.general.razorpay.keySecret;
    const razorpayWebhookSecret = settings.general.razorpay.webhookSecret || webhookSecret;

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: settings.general.razorpay.keyId,
      key_secret: razorpayKeySecret,
    });

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayWebhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature verification failed');
      return res.status(400).send('Webhook signature verification failed');
    }

    const event = req.body;

    // Handle the event
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      default:
        console.log(`Unhandled event type ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error in Razorpay webhook handler:', error);
    res.status(500).send('Webhook handler error');
  }
};

/**
 * Handle successful payment capture
 */
const handlePaymentCaptured = async (payment) => {
  try {
    console.log('Payment captured:', payment.id);

    // Find booking by payment ID
    const booking = await Booking.findOne({ paymentId: payment.id });
    
    if (!booking) {
      console.log('No booking found for payment ID:', payment.id);
      return;
    }

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paidAt = new Date();

    await booking.save();
    console.log('Booking updated successfully:', booking._id);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

/**
 * Handle failed payment
 */
const handlePaymentFailed = async (payment) => {
  try {
    console.log('Payment failed:', payment.id);

    // Find booking by payment ID
    const booking = await Booking.findOne({ paymentId: payment.id });
    
    if (!booking) {
      console.log('No booking found for payment ID:', payment.id);
      return;
    }

    // Update booking status
    booking.paymentStatus = 'failed';
    booking.status = 'pending';

    await booking.save();
    console.log('Booking updated for failed payment:', booking._id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

/**
 * Handle order paid event
 */
const handleOrderPaid = async (order) => {
  try {
    console.log('Order paid:', order.id);

    // Find booking by order ID
    const booking = await Booking.findOne({ orderId: order.id });
    
    if (!booking) {
      console.log('No booking found for order ID:', order.id);
      return;
    }

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paidAt = new Date();

    await booking.save();
    console.log('Booking updated for order paid:', booking._id);
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
};

module.exports = {
  handleRazorpayWebhook,
};
