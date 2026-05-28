# Booking Payment API Documentation

This document describes the new Stripe-based payment API for booking payments in the Panditji application.

## Overview

The booking payment API provides three main endpoints:
1. **Create Booking Payment** - Generates a Stripe web view URL for payment
2. **Verify Booking Payment** - Verifies payment status after completion
3. **Get Booking Payment Status** - Retrieves current payment status

## API Endpoints

### 1. Create Booking Payment

**Endpoint:** `POST /api/createBookingPayment`

**Description:** Creates a Stripe payment link for a booking and returns a web view URL.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookingId": "64a1b2c3d4e5f6789012345",
  "currency": "INR"
}
```

**Parameters:**
- `bookingId` (required): The MongoDB ObjectId of the booking
- `currency` (optional): Currency code (default: "INR")

**Response (Success):**
```json
{
  "error": false,
  "code": 200,
  "status": 1,
  "message": "Booking payment initialized successfully",
  "payload": {
    "payment_url": "https://checkout.stripe.com/pay/cs_test_...",
    "payment_link_id": "plink_...",
    "payment_intent_id": "pi_...",
    "booking": {
      "id": "64a1b2c3d4e5f6789012345",
      "bookingID": "BOOK-1234567890-123",
      "poojaType": "Ganesh Puja",
      "package": "Premium",
      "dateTime": "2024-01-15T10:00:00.000Z",
      "duration": "2 hours",
      "paymentAmount": 2500,
      "status": "pending",
      "customer": {
        "id": "64a1b2c3d4e5f6789012346",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "vendor": {
        "id": "64a1b2c3d4e5f6789012347",
        "firstName": "Pandit",
        "lastName": "Sharma",
        "email": "pandit@example.com",
        "phone": "+919876543211"
      },
      "service": {
        "id": "64a1b2c3d4e5f6789012348",
        "poojaType": "Ganesh Puja",
        "description": "Complete Ganesh Puja with all rituals",
        "price": 2500
      }
    },
    "payment_details": {
      "amount": 2500,
      "currency": "INR",
      "receipt": "booking_BOOK-1234567890-123_1705123456789",
      "stripe_key": "pk_test_..."
    },
    "redirect_urls": {
      "success": "http://localhost:3000/booking-payment-success?payment_intent=pi_...&booking_id=64a1b2c3d4e5f6789012345",
      "cancel": "http://localhost:3000/booking-payment-cancel?booking_id=64a1b2c3d4e5f6789012345"
    }
  }
}
```

**Response (Error):**
```json
{
  "error": true,
  "code": 400,
  "status": 0,
  "message": "Booking not found"
}
```

### 2. Verify Booking Payment

**Endpoint:** `POST /api/verifyBookingPayment`

**Description:** Verifies the payment status after Stripe webhook or manual verification.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_intent_id": "pi_1234567890abcdef",
  "booking_id": "64a1b2c3d4e5f6789012345"
}
```

**Parameters:**
- `payment_intent_id` (required): Stripe payment intent ID
- `booking_id` (required): The MongoDB ObjectId of the booking

**Response (Success):**
```json
{
  "error": false,
  "code": 200,
  "status": 1,
  "message": "Payment verified successfully",
  "payload": {
    "payment_status": "succeeded",
    "booking": {
      "id": "64a1b2c3d4e5f6789012345",
      "bookingID": "BOOK-1234567890-123",
      "status": "upcoming",
      "paymentAmount": 2500,
      "poojaType": "Ganesh Puja",
      "dateTime": "2024-01-15T10:00:00.000Z",
      "customer": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "vendor": {
        "firstName": "Pandit",
        "lastName": "Sharma",
        "email": "pandit@example.com"
      }
    },
    "payment_details": {
      "payment_intent_id": "pi_1234567890abcdef",
      "amount": 2500,
      "currency": "INR",
      "status": "succeeded",
      "created": 1705123456
    }
  }
}
```

### 3. Get Booking Payment Status

**Endpoint:** `GET /api/getBookingPaymentStatus`

**Description:** Retrieves the current payment status for a booking.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `bookingId` (required): The MongoDB ObjectId of the booking

**Example URL:**
```
GET /api/getBookingPaymentStatus?bookingId=64a1b2c3d4e5f6789012345
```

**Response (Success):**
```json
{
  "error": false,
  "code": 200,
  "status": 1,
  "message": "Booking payment status retrieved successfully",
  "payload": {
    "booking": {
      "id": "64a1b2c3d4e5f6789012345",
      "bookingID": "BOOK-1234567890-123",
      "status": "upcoming",
      "paymentAmount": 2500,
      "poojaType": "Ganesh Puja",
      "dateTime": "2024-01-15T10:00:00.000Z",
      "customer": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "vendor": {
        "firstName": "Pandit",
        "lastName": "Sharma",
        "email": "pandit@example.com"
      }
    },
    "payment_status": "paid",
    "payment_amount": 2500,
    "currency": "INR"
  }
}
```

## Stripe Webhook

**Endpoint:** `POST /api/stripe-webhook`

**Description:** Handles Stripe webhook events to automatically update booking status.

**Note:** This endpoint doesn't require authentication as it's called by Stripe.

**Webhook Events Handled:**
- `payment_intent.succeeded` - Updates booking status to "upcoming"
- `payment_intent.payment_failed` - Logs payment failure
- `payment_intent.canceled` - Logs payment cancellation

## Frontend Integration

### 1. Create Payment Flow

```javascript
// Frontend code example
const createBookingPayment = async (bookingId) => {
  try {
    const response = await fetch('/api/createBookingPayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookingId: bookingId,
        currency: 'INR'
      })
    });

    const data = await response.json();
    
    if (data.error === false) {
      // Redirect to Stripe payment page
      window.location.href = data.payload.payment_url;
    } else {
      console.error('Payment initialization failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. Handle Payment Success

```javascript
// On payment success page
const verifyPayment = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentIntentId = urlParams.get('payment_intent');
  const bookingId = urlParams.get('booking_id');

  if (paymentIntentId && bookingId) {
    try {
      const response = await fetch('/api/verifyBookingPayment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          booking_id: bookingId
        })
      });

      const data = await response.json();
      
      if (data.error === false) {
        // Payment verified successfully
        console.log('Payment verified:', data.payload);
        // Redirect to booking confirmation page
      } else {
        console.error('Payment verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
```

## Environment Variables

Make sure to set the following environment variables:

```bash
# Stripe Configuration
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string
```

## Stripe Dashboard Configuration

1. **Enable Stripe Payment**: Set `isActive: true` in the Stripe settings
2. **Add Webhook Endpoint**: Add `https://yourdomain.com/api/stripe-webhook` to your Stripe dashboard
3. **Configure Webhook Events**: Enable `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled` events

## Error Handling

The API returns standardized error responses:

```json
{
  "error": true,
  "code": 400,
  "status": 0,
  "message": "Error description",
  "payload": {
    "error": "Detailed error message",
    "details": {
      "type": "error_type",
      "code": "error_code"
    }
  }
}
```

## Security Notes

1. **Authentication**: All endpoints (except webhook) require valid JWT tokens
2. **Authorization**: Users can only access their own booking payments
3. **Webhook Security**: Stripe webhook signature verification is implemented
4. **Data Validation**: All input parameters are validated before processing

## Testing

Use Stripe test cards for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

## Support

For any issues or questions regarding the booking payment API, please contact the development team.
