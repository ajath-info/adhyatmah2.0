'use client';
import React from 'react';
// stripe for paymen get way
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// checkout main component import
import CheckoutMain from './checkout-main';

// Set up the Stripe promise with your public key

export default function Checkout({ data }) {
  // isactive is true or false, mode sandbox or live and publishableKey is key
  const { isActive: isActiveStripe, publishableKey } = data.stripe;
  const { isActive: isActivePaypal, clientId: paypalClientId } = data.paypal;
  const { isActive: isActiveRazorpay, keyId: razorpayKeyId } = data.razorpay;

  const stripePromise = isActiveStripe ? loadStripe(publishableKey) : null;

  return isActiveStripe ? (
    <Elements stripe={stripePromise}>
      <CheckoutMain 
        isActiveStripe={isActiveStripe} 
        isActivePaypal={isActivePaypal} 
        paypalClientId={paypalClientId}
        isActiveRazorpay={isActiveRazorpay}
        razorpayKeyId={razorpayKeyId}
      />
    </Elements>
  ) : (
    <CheckoutMain 
      isActivePaypal={isActivePaypal} 
      paypalClientId={paypalClientId}
      isActiveRazorpay={isActiveRazorpay}
      razorpayKeyId={razorpayKeyId}
    />
  );
}
