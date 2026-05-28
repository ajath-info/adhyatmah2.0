'use client';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';

// icons
import {
  MdShoppingBag,
  MdFlashOn,
  MdCreditCard,
  MdDeliveryDining,
  MdInventory2,
  MdCheckCircle,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdInfoOutline,
  MdReceipt
} from 'react-icons/md';

// api
import * as api from 'src/services';

export default function BookingPaymentDialog({ open, onClose, bookingData, onSuccess, onError }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [paymentMethods, setPaymentMethods] = useState(['razorpay']);

  const createBooking = useCallback(async () => {
    if (!bookingData) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await api.createBooking(bookingData);

      if (response.error === false) {
        setBookingCreated(true);
        setCreatedBookingId(response.payload.booking.id);
        return response.payload.booking;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create booking');
      setProcessing(false);
      throw err;
    }
  }, [bookingData]);

  const handlePayment = useCallback(async () => {
    if (!bookingData) return;

    try {
      const booking = await createBooking();

      const paymentData = {
        bookingId: booking.id,
        currency: 'INR',
        provider: selectedPaymentMethod
      };

      const paymentResponse = await api.createBookingPayment(paymentData);

      if (paymentResponse.error === false) {
        let paymentUrl;

        if (selectedPaymentMethod === 'stripe') {
          paymentUrl = paymentResponse.payload.stripe?.payment_url || paymentResponse.payload.payment_url;
        } else if (selectedPaymentMethod === 'razorpay') {
          paymentUrl =
            paymentResponse.payload.razorpay?.payment_link?.short_url ||
            paymentResponse.payload.payment_link?.short_url;
        }

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Payment URL not found');
        }
      } else {
        throw new Error(paymentResponse.message);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to initialize payment');
      setProcessing(false);
    }
  }, [bookingData, createBooking, selectedPaymentMethod]);

  const handleClose = () => {
    if (!processing) {
      setError(null);
      setBookingCreated(false);
      setCreatedBookingId(null);
      setSelectedPaymentMethod('razorpay');
      onClose();
    }
  };

  React.useEffect(() => {
    setPaymentMethods(['razorpay']);
  }, []);

  if (!bookingData) return null;

  const selectedPackage = bookingData.package;
  const advanceAmount = bookingData.paymentAmount;
  const totalAmount = bookingData.totalAmount;

  // ── Add-ons from bookingData ──
  // poojaKit: { name, price, quantity }
  const poojaKit = bookingData.addons?.poojaKit || null;

  // FIX: booking page sends `instantKit` (single object), dialog expects array.
  // Normalise both shapes: { name, price, quantity } OR array of items.
  const rawInstantKit = bookingData.addons?.instantKit || bookingData.addons?.instantItems || null;
  const instantItems = Array.isArray(rawInstantKit)
    ? rawInstantKit
    : rawInstantKit
      ? [rawInstantKit]
      : [];

  const hasAddons = poojaKit || instantItems.length > 0;

  // Correctly account for quantity in totals
  const poojaKitTotal = poojaKit ? poojaKit.price * (poojaKit.quantity || 1) : 0;
  const instantItemsTotal = instantItems.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0
  );
  const addonsTotal = poojaKitTotal + instantItemsTotal;

  // ✅ FIX: Grand total = base service amount + addons
  // totalAmount from props is the base service price (without addons)
  // We need to add addons to get the correct grand total
  const grandTotal = totalAmount + addonsTotal;

  // ✅ FIX: Remaining = grandTotal - advanceAmount (was: totalAmount - advanceAmount)
  const remainingAmount = grandTotal - advanceAmount;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableEscapeKeyDown={processing}>
      <DialogTitle>
        Complete Your Booking
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {bookingData.poojaType} - {selectedPackage}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>

          {/* ── Payment Summary ── */}
          <Box
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'rgba(249,115,22,0.35)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #f97316, #fb923c, #fdba74)'
              }
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MdReceipt size={17} color="#f97316" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1a1a1a', lineHeight: 1.2 }}>
                  Payment Summary
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>Breakdown of your order</Typography>
              </Box>
            </Stack>

            <Stack spacing={0.25} sx={{ px: 2.5, pb: 1.5 }}>

              {/* Service */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdShoppingBag size={16} color="#f97316" />
                  <Typography variant="body2" sx={{ color: '#555' }}>Service</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#1a1a1a' }}>{bookingData.poojaType}</Typography>
              </Stack>

              {/* Date & Time */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdAccessTime size={16} color="#a78bfa" />
                  <Typography variant="body2" sx={{ color: '#555' }}>Date & Time</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                  {new Date(bookingData.dateTime).toLocaleDateString('en-IN')} at{' '}
                  {new Date(bookingData.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Stack>

              {/* Duration */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdAccessTime size={16} color="#0ea5e9" />
                  <Typography variant="body2" sx={{ color: '#555' }}>Duration</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#1a1a1a' }}>{bookingData.duration}</Typography>
              </Stack>

              {/* Platform Fee */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdCreditCard size={16} color="#22c55e" />
                  <Typography variant="body2" sx={{ color: '#555' }}>Platform Fee</Typography>
                </Stack>
                <Chip
                  label="FREE"
                  size="small"
                  sx={{ height: 20, fontSize: 10, fontWeight: 'bold', bgcolor: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', '& .MuiChip-label': { px: 1 } }}
                />
              </Stack>

              {/* Delivery charge */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdDeliveryDining size={16} color="#6366f1" />
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Delivery charge
                  </Typography>
                </Stack>

                <Chip
                  label="FREE"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 'bold',
                    bgcolor: '#dcfce7',
                    color: '#16a34a',
                    border: '1px solid #86efac',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Stack>

              {/* Handling charge */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdInventory2 size={16} color="#0ea5e9" />
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Handling charge
                  </Typography>
                </Stack>

                <Chip
                  label="FREE"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 'bold',
                    bgcolor: '#dcfce7',
                    color: '#16a34a',
                    border: '1px solid #86efac',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Stack>

              {/* ── Pooja Kit add-on (with quantity) ── */}
              {poojaKit && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <MdCheckCircle size={16} color="#22c55e" />
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {poojaKit.name}{' '}
                      <Typography component="span" variant="caption" sx={{ color: '#f97316' }}>
                        (puja kit{poojaKit.quantity > 1 ? ` ×${poojaKit.quantity}` : ''})
                      </Typography>
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#1a1a1a' }}>
                    ₹{poojaKit.price * (poojaKit.quantity || 1)}
                  </Typography>
                </Stack>
              )}

              {/* ── Instant Kit items (with quantity) ── */}
              {instantItems.map((item, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <MdFlashOn size={16} color="#6366f1" />
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {item.name}{' '}
                      <Typography component="span" variant="caption" sx={{ color: '#6366f1' }}>
                        (instant kit{item.quantity > 1 ? ` ×${item.quantity}` : ''})
                      </Typography>
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#1a1a1a' }}>
                    ₹{item.price * (item.quantity || 1)}
                  </Typography>
                </Stack>
              ))}

              {/* ✅ FIX: Remaining on completion now uses grandTotal */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdAccessTime size={16} color="#a78bfa" />
                  <Typography variant="body2" sx={{ color: '#555' }}>Remaining (on completion)</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#888' }}>₹{remainingAmount}</Typography>
              </Stack>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(249,115,22,0.3)', mx: 2.5 }} />

            <Stack spacing={1} sx={{ px: 2.5, py: 1.5 }}>

              {/* Add-ons subtotal */}
              {hasAddons && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Add-ons ({(poojaKit ? 1 : 0) + instantItems.length} items)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>+ ₹{addonsTotal}</Typography>
                </Stack>
              )}

              {/* ✅ FIX: Total Amount now shows grandTotal (service + addons) */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: '#555' }}>Total Amount</Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#1a1a1a' }}>₹{grandTotal}</Typography>
              </Stack>

              {/* Paying Now */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MdAccountBalanceWallet size={18} color="#f97316" />
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#1a1a1a' }}>Paying Now</Typography>
                </Stack>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#f97316' }}>₹{advanceAmount}</Typography>
              </Stack>
            </Stack>

            {/* GST note */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mx: 2.5, mb: 2, p: 1.25, bgcolor: 'rgba(249,115,22,0.07)', borderRadius: 1.5, border: '1px dashed rgba(249,115,22,0.4)' }}>
              <MdInfoOutline size={15} color="#f97316" style={{ marginTop: 1, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#555' }} lineHeight={1.5}>
                <strong style={{ color: '#92400e' }}>GST Inclusive:</strong> All prices displayed are inclusive of applicable GST.
              </Typography>
            </Box>
          </Box>
          {/* ── End Payment Summary ── */}

          {/* Error Display */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Payment Method Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant={selectedPaymentMethod === 'razorpay' ? 'contained' : 'outlined'}
                disabled={processing}
                onClick={() => setSelectedPaymentMethod('razorpay')}
                sx={{
                  backgroundColor: selectedPaymentMethod === 'razorpay' ? 'primary.main' : 'transparent',
                  color: selectedPaymentMethod === 'razorpay' ? 'white' : 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: selectedPaymentMethod === 'razorpay' ? 'primary.dark' : 'primary.light',
                    color: 'white'
                  }
                }}
              >
                Razorpay
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Select your preferred payment method
            </Typography>
          </Box>

          {/* Processing Payment */}
          {processing && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={40} />
              <Typography variant="h6" sx={{ mt: 2 }}>Processing Payment...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait while we redirect you to the payment page.
              </Typography>
            </Box>
          )}

        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={processing}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={processing || !selectedPaymentMethod}
          sx={{ ml: 2 }}
        >
          {processing ? 'Processing...' : `Pay ₹${advanceAmount} with Razorpay`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BookingPaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingData: PropTypes.shape({
    vendorId: PropTypes.string.isRequired,
    serviceId: PropTypes.string.isRequired,
    poojaType: PropTypes.string.isRequired,
    package: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired,
    pujaSamagri: PropTypes.string.isRequired,
    paymentAmount: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    addons: PropTypes.shape({
      poojaKit: PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number
      }),
      // Supports both `instantKit` (single object) and `instantItems` (array)
      instantKit: PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number
      }),
      instantItems: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number
      }))
    })
  }),
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};