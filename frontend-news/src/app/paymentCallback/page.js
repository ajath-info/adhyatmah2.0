'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');

  useEffect(() => {
    // Stripe parameters
    const payment_intent = params.get('payment_intent');
    const payment_intent_client_secret = params.get('payment_intent_client_secret');
    const redirect_status = params.get('redirect_status');

    // Razorpay parameters
    const razorpay_payment_id = params.get('razorpay_payment_id');
    const razorpay_order_id = params.get('razorpay_order_id');
    const razorpay_signature = params.get('razorpay_signature');
    const razorpay_payment_link_id = params.get('razorpay_payment_link_id');
    const razorpay_payment_link_status = params.get('razorpay_payment_link_status');
    const razorpay_payment_link_reference_id = params.get('razorpay_payment_link_reference_id');

    // Determine which payment provider
    const isStripe = !!payment_intent;
    const isRazorpay = !!razorpay_payment_id;

    if (!isStripe && !isRazorpay) {
      setStatus('error');
      setMessage('Missing payment information in callback.');
      return;
    }

    async function verifyPayment() {
      try {
        setStatus('verifying');

        // Determine payment provider for display
        if (isStripe) {
          setPaymentProvider('Stripe');
        } else if (isRazorpay) {
          setPaymentProvider('Razorpay');
        }

        // Allow configuring backend base URL via env var
        const backendBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

        // Prepare request body based on payment provider
        const requestBody = {};

        if (isStripe) {
          requestBody.payment_intent_id = payment_intent;
          if (payment_intent_client_secret) {
            requestBody.payment_intent_client_secret = payment_intent_client_secret;
          }
        } else if (isRazorpay) {
          requestBody.razorpay_payment_id = razorpay_payment_id;
          if (razorpay_order_id) requestBody.razorpay_order_id = razorpay_order_id;
          if (razorpay_signature) requestBody.razorpay_signature = razorpay_signature;
          if (razorpay_payment_link_id) requestBody.razorpay_payment_link_id = razorpay_payment_link_id;
          if (razorpay_payment_link_status) requestBody.razorpay_payment_link_status = razorpay_payment_link_status;
          if (razorpay_payment_link_reference_id)
            requestBody.razorpay_payment_link_reference_id = razorpay_payment_link_reference_id;
        }

        console.log('Verifying payment with:', requestBody);

        const resp = await fetch(`${backendBase}/api/verifyPayment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const data = await resp.json();

        if (resp.ok && data && data.status === 1) {
          setStatus('success');
          setMessage(data.message || 'Payment verified successfully.');

          // Redirect to success page after a short delay
          setTimeout(() => {
            // Check if order data exists in response
            if (data.payload && data.payload.order) {
              router.push(`/order-success?orderId=${data.payload.order.id || data.payload.orderId}`);
            } else if (data.payload && data.payload.orderId) {
              router.push(`/order-success?orderId=${data.payload.orderId}`);
            } else {
              router.push('/orders');
            }
          }, 2500);
        } else {
          setStatus('error');
          setMessage((data && data.message) || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('error');
        setMessage(err.message || 'Network error during verification.');
      }
    }

    verifyPayment();
  }, [params, router]);

  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {status === 'loading' && (
        <div>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 1s linear infinite'
            }}
          >
            ⏳
          </div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Waiting for payment details...</h3>
        </div>
      )}

      {status === 'verifying' && (
        <div>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 1s linear infinite'
            }}
          >
            🔄
          </div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Verifying {paymentProvider} payment...</h3>
          <p style={{ color: '#666' }}>Please wait, do not close this window.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: '#22c55e', marginBottom: '12px' }}>Payment Successful!</h2>
          <p style={{ color: '#333', fontSize: '16px' }}>{message}</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '16px' }}>Redirecting to your order...</p>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Payment Verification Failed</h2>
          <p style={{ color: '#333', fontSize: '16px', marginBottom: '24px' }}>{message}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
