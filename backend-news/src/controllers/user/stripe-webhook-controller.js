const Stripe = require('stripe');
const Booking = require('../../models/Booking');
const Settings = require('../../models/Settings');

/**
 * Stripe Webhook Handler for Booking Payments
 * This handles Stripe webhook events to automatically update booking status
 */
const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

    // Get Stripe settings
    const settings = await Settings.findOne({});
    if (!settings || !settings.general || !settings.general.stripe) {
      console.error('Stripe settings not found');
      return res.status(400).send('Stripe settings not found');
    }

    const stripeSecretKey = settings.general.stripe.secretKey;
    const stripe = new Stripe(stripeSecretKey);

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).send('Webhook handler error');
  }
};

/**
 * Handle successful payment intent
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    console.log('Payment succeeded:', paymentIntent.id);

    // Check if this is a booking payment
    if (paymentIntent.metadata.paymentType === 'booking' && paymentIntent.metadata.bookingId) {
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Find and update the booking
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.status = 'upcoming'; // Payment confirmed, booking is now upcoming
        await booking.save();
        
        console.log(`Booking ${booking.bookingID} status updated to 'upcoming' after successful payment`);
        
        // Here you could also send confirmation emails, notifications, etc.
        // await sendBookingConfirmationEmail(booking);
        // await sendVendorNotification(booking);
      } else {
        console.error(`Booking not found for ID: ${bookingId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
};

/**
 * Handle failed payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    console.log('Payment failed:', paymentIntent.id);

    // Check if this is a booking payment
    if (paymentIntent.metadata.paymentType === 'booking' && paymentIntent.metadata.bookingId) {
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (booking) {
        // Keep booking status as 'pending' for failed payments
        // You might want to send a notification to the customer
        console.log(`Payment failed for booking ${booking.bookingID}`);
        
        // Here you could send a payment failed notification
        // await sendPaymentFailedNotification(booking);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
};

/**
 * Handle canceled payment intent
 */
const handlePaymentIntentCanceled = async (paymentIntent) => {
  try {
    console.log('Payment canceled:', paymentIntent.id);

    // Check if this is a booking payment
    if (paymentIntent.metadata.paymentType === 'booking' && paymentIntent.metadata.bookingId) {
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (booking) {
        // Keep booking status as 'pending' for canceled payments
        console.log(`Payment canceled for booking ${booking.bookingID}`);
        
        // Here you could send a payment canceled notification
        // await sendPaymentCanceledNotification(booking);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent canceled:', error);
  }
};

module.exports = {
  handleStripeWebhook
};
