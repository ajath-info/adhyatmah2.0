'use client';
import React from 'react';
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import { useSelector, useDispatch } from 'react-redux';
// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
import { verifyUser } from 'src/redux/slices/user';
// mui
import { Box, Card, Stack, Container, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Renderer callback with condition
const renderer = ({ minutes, seconds }) => {
  return (
    <>
      <Stack
        direction="row"
        gap={0.5}
        sx={{
          bgcolor: 'background.default',
          border: (theme) => '1px solid ' + theme.palette.divider,
          p: 1,
          borderRadius: '4px',
          maxWidth: 100,
          mx: 'auto',
          mt: 2,
          color: 'text.primary'
        }}
      >
        <Stack justifyContent="center" alignItems="center" gap={0} sx={{ height: 28, width: 28, borderRadius: '2px' }}>
          <Typography variant="body1" color="text.primary" fontWeight={800} fontSize={14} lineHeight={1}>
            {minutes}
          </Typography>
          <Typography variant="body1" color="text.primary" fontSize={8} fontWeight={400} lineHeight={1}>
            MIN
          </Typography>
        </Stack>
        <Typography variant="body1" color="common.white">
          :
        </Typography>
        <Stack justifyContent="center" alignItems="center" gap={0} sx={{ height: 28, width: 28, borderRadius: '2px' }}>
          <Typography variant="body1" color="text.primary" fontWeight={800} fontSize={14} lineHeight={1}>
            {seconds}
          </Typography>
          <Typography variant="body1" color="text.primary" fontSize={8} fontWeight={400} lineHeight={1}>
            SEC
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};
export default function VerifyOTPForm() {
  const router = useRouter();
  const theme = useTheme();

  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const redirect = searchParam.get('redirect');
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [complete, setComplete] = React.useState(false);
  const [countdownDate, setCountdownDate] = React.useState(Date.now() + 60000); // Add this state

  // Check if user is already verified
  React.useEffect(() => {
    if (user?.isVerified) {
      toast.success('Your email is already verified!');
      router.push(redirect || '/');
    }
  }, [user?.isVerified, router, redirect]);

  const onOtpChange = (value) => {
    setOtp(value);
    setComplete(false); // Reset complete state
  };
  const { mutate } = useMutation({
    mutationFn: api.verifyOTP,
    retry: false,
    onSuccess: async () => {
      dispatch(verifyUser());
      toast.success('OTP Verified');
      router.push(redirect || '/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // Resend OTP mutation
  const { mutate: ResendOTPMutate } = useMutation({
    mutationFn: api.resendOTP,
    retry: false,
    onSuccess: async () => {
      setComplete(false);
      toast.success('OTP resent');
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      if (errorMessage.includes('Already Verified')) {
        toast.success('Your email is already verified! Redirecting...');
        setTimeout(() => {
          router.push(redirect || '/');
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    },
    onSettled: () => {
      setResendLoading(false);
    }
  });

  const onResend = () => {
    setResendLoading(true);
    ResendOTPMutate({ email: user.email });
    setCountdownDate(Date.now() + 60000); // Reset countdown date on OTP change
  };
  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 3, my: 4 }}>
        <Stack>
          <Typography textAlign="center" mb={1} variant="h4" gutterBottom>
            Verify OTP
          </Typography>
          <Typography textAlign="center" color="text.secondary" mb={3}>
            Please enter OTP to continue
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              '& > div': {
                justifyContent: 'center'
              },
              span: {
                fontSize: 22,
                p: 0.5
              },
              input: {
                minWidth: 40,
                height: 80,
                borderRadius: '8px',
                fontSize: 24,
                fontWeight: 700,
                bgcolor: theme.palette.background.default,
                color: 'text.primary',
                border: `1px solid ${theme.palette.divider}`
              }
            }}
          >
            <OtpInput
              value={otp}
              onChange={onOtpChange}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              shouldAutoFocus
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ maxWidth: 300, mx: 'auto', mt: 2 }}
              loading={loading}
              disabled={otp.length < 6 || (complete && loading)}
              onClick={() => {
                setLoading(true);
                mutate({ otp, email: user.email });
              }}
            >
              Verify
            </Button>
          </Box>
          {complete && !user?.isVerified ? (
            <Button
              loading={resendLoading}
              onClick={onResend}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ maxWidth: 300, mx: 'auto', mt: 2 }}
            >
              Resend OTP
            </Button>
          ) : !user?.isVerified ? (
            <Countdown date={countdownDate} renderer={renderer} onComplete={() => setComplete(true)} />
          ) : null}
        </Stack>
      </Card>
    </Container>
  );
}
