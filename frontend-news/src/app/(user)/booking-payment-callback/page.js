'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
export default function BookingPaymentCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Stripe parameters
    const payment_intent = params.get('payment_intent');
    const payment_intent_client_secret = params.get('payment_intent_client_secret');

    // Razorpay parameters
    const razorpay_payment_id = params.get('razorpay_payment_id');
    const razorpay_order_id = params.get('razorpay_order_id');
    const razorpay_signature = params.get('razorpay_signature');
    const razorpay_payment_link_id = params.get('razorpay_payment_link_id');
    const razorpay_payment_link_status = params.get('razorpay_payment_link_status');
    const razorpay_payment_link_reference_id = params.get('razorpay_payment_link_reference_id');

    // Booking ID
    const booking_id = params.get('booking_id');

    // Determine which payment provider
    const isStripe = !!payment_intent;
    const isRazorpay = !!razorpay_payment_id;

    if (!isStripe && !isRazorpay) {
      setStatus('error');
      setMessage('Missing payment information in callback.');
      return;
    }

    if (!booking_id) {
      setStatus('error');
      setMessage('Missing booking ID in callback.');
      return;
    }

    async function verifyPayment() {
      try {
        setStatus('verifying');

        if (isStripe) {
          setPaymentProvider('Stripe');
        } else if (isRazorpay) {
          setPaymentProvider('Razorpay');
        }

        const backendBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

        // Get access token
        const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');

        // Prepare request body
        const requestBody = {
          booking_id: booking_id
        };

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

        console.log('Verifying booking payment with:', requestBody);

        const resp = await fetch(`${backendBase}/api/verifyBookingPayment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(requestBody)
        });

        const data = await resp.json();

        if (resp.ok && data && data.status === 1) {
          setStatus('success');
          setMessage(data.message || 'Booking payment verified successfully.');
          setBookingData(data.payload?.booking || null);

          // Redirect to booking success page
          setTimeout(() => {
            if (data.payload?.booking?.id) {
              router.push(`/booking-success?bookingId=${data.payload.booking.id}`);
            } else {
              router.push('/bookings');
            }
          }, 2500);
        } else {
          setStatus('error');
          setMessage(data.message || 'Booking payment verification failed.');
        }
      } catch (err) {
        console.error('Booking payment verification error:', err);
        setStatus('error');
        setMessage(err.message || 'Network error during verification.');
      }
    }

    verifyPayment();
  }, [params, router]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <div>
            <div style={styles.loadingSpinner}>⏳</div>
            <h3 style={styles.loadingText}>Waiting for payment details...</h3>
          </div>
        )}

        {status === 'verifying' && (
          <div>
            <div style={styles.loadingSpinner}>🔄</div>
            <h3 style={styles.title}>Verifying {paymentProvider} Payment...</h3>
            <p style={styles.subtitle}>Please wait, do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={styles.successIcon}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="4" fill="#f0fdf4" />
                <path
                  d="M25 40L35 50L55 30"
                  stroke="#22c55e"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 style={styles.successTitle}>Payment Successful! 🎉</h2>
            <p style={styles.subtitle}>{message}</p>

            {bookingData && (
              <div style={styles.bookingInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Booking ID:</span>
                  <span style={styles.infoValue}>{bookingData.bookingID || bookingData.id}</span>
                </div>
                {bookingData.poojaType && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Pooja Type:</span>
                    <span style={styles.infoValue}>{bookingData.poojaType}</span>
                  </div>
                )}
                {bookingData.paymentAmount && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Amount Paid:</span>
                    <span style={styles.infoValueLarge}>₹{bookingData.paymentAmount}</span>
                  </div>
                )}
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Status:</span>
                  <span style={styles.badge}>{bookingData.status || 'Confirmed'}</span>
                </div>
              </div>
            )}

            <p style={styles.redirectText}>Redirecting to booking details...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={styles.errorIcon}>❌</div>
            <h2 style={styles.errorTitle}>Payment Verification Failed</h2>
            <p style={styles.errorText}>{message}</p>
            <div style={styles.buttonGroup}>
              <button onClick={() => window.location.reload()} style={styles.primaryButton}>
                Try Again
              </button>
              <button onClick={() => router.push('/bookings')} style={styles.secondaryButton}>
                View Bookings
              </button>
              <button onClick={() => router.push('/')} style={styles.secondaryButton}>
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  loadingSpinner: {
    fontSize: '48px',
    marginBottom: '16px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    marginTop: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '12px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  successIcon: {
    marginBottom: '24px',
    animation: 'scaleIn 0.5s ease-out'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: '12px'
  },
  bookingInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    marginBottom: '24px',
    textAlign: 'left'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280'
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  infoValueLarge: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#22c55e'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: '#dcfce7',
    color: '#16a34a'
  },
  redirectText: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '16px'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: '12px'
  },
  errorText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
};
