import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Typography,
  styled,
  Skeleton
} from '@mui/material';
import { FaPaypal } from 'react-icons/fa';
import { CiBank } from 'react-icons/ci';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function FinancialDetailsForm({ formik, isLoading }) {
  const { values, touched, errors, getFieldProps, setFieldValue } = formik;

  const [methodSelected, setMethodSelected] = useState(false);

  useEffect(() => {
    if (values?.financialDetails?.paymentMethod) {
      setMethodSelected(true);
    }
  }, [values?.financialDetails?.paymentMethod]);

  return (
    <Stack spacing={2}>
      {/* Payment Method Radio */}
      <div>
        {isLoading ? (
          <Stack direction="row" gap={1}>
            <Stack direction="row" gap={1} alignItems="center">
              <Skeleton variant="circular" height={42} width={42} />
              <Skeleton variant="text" height={22} width={70} />
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <Skeleton variant="circular" height={42} width={42} />
              <Skeleton variant="text" height={22} width={70} />
            </Stack>
          </Stack>
        ) : (
          <RadioGroup
            value={values?.financialDetails?.paymentMethod}
            onChange={(e) => {
              setFieldValue('financialDetails.paymentMethod', e.target.value);
              setMethodSelected(isLoading);
            }}
            sx={{ pl: 1 }}
            row
          >
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label={
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  ml={1}
                  sx={{
                    svg: {
                      color: values?.financialDetails?.paymentMethod === 'paypal' ? 'primary.main' : 'text.primary'
                    }
                  }}
                >
                  <FaPaypal size={20} />
                  <Typography variant="subtitle2">PayPal</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              value="bank"
              control={<Radio />}
              label={
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  ml={1}
                  sx={{
                    svg: {
                      color: values?.financialDetails?.paymentMethod === 'bank' ? 'primary.main' : 'text.primary'
                    }
                  }}
                >
                  <CiBank size={20} />
                  <Typography variant="subtitle2">Bank Transfer</Typography>
                </Stack>
              }
            />
          </RadioGroup>
        )}
      </div>

      {/* Paypal Fields */}
      <Collapse in={methodSelected && values?.financialDetails?.paymentMethod === 'paypal'}>
        <div>
          <LabelStyle component="label" htmlFor="paypal-email">
            {isLoading ? <Skeleton width={140} variant="text" /> : 'Paypal Email'}
          </LabelStyle>
          {isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <TextField
              id="paypal-email"
              fullWidth
              type="email"
              {...getFieldProps('financialDetails.paypal.email')}
              error={Boolean(touched?.financialDetails?.paypal?.email && errors?.financialDetails?.paypal?.email)}
              helperText={touched?.financialDetails?.paypal?.email && errors?.financialDetails?.paypal?.email}
            />
          )}
        </div>
      </Collapse>

      {/* Bank Fields */}
      <Collapse in={methodSelected && values?.financialDetails?.paymentMethod === 'bank'}>
        <>
          <div>
            <LabelStyle component="label" htmlFor="holder-name">
              Holder Name
            </LabelStyle>
            <TextField
              id="holder-name"
              fullWidth
              {...getFieldProps('financialDetails.bank.holderName')}
              error={Boolean(touched?.financialDetails?.bank?.holderName && errors?.financialDetails?.bank?.holderName)}
              helperText={touched?.financialDetails?.bank?.holderName && errors?.financialDetails?.bank?.holderName}
            />
          </div>

          <div>
            <LabelStyle component="label" htmlFor="holder-email">
              Holder Email
            </LabelStyle>
            <TextField
              id="holder-email"
              fullWidth
              {...getFieldProps('financialDetails.bank.holderEmail')}
              error={Boolean(
                touched?.financialDetails?.bank?.holderEmail && errors?.financialDetails?.bank?.holderEmail
              )}
              helperText={touched?.financialDetails?.bank?.holderEmail && errors?.financialDetails?.bank?.holderEmail}
            />
          </div>

          <div>
            <LabelStyle component="label" htmlFor="bank-name">
              Bank Name
            </LabelStyle>
            <TextField
              id="bank-name"
              fullWidth
              {...getFieldProps('financialDetails.bank.bankName')}
              error={Boolean(touched?.financialDetails?.bank?.bankName && errors?.financialDetails?.bank?.bankName)}
              helperText={touched?.financialDetails?.bank?.bankName && errors?.financialDetails?.bank?.bankName}
            />
          </div>

          <div>
            <LabelStyle component="label" htmlFor="account-number">
              Account Number
            </LabelStyle>
            <TextField
              id="account-number"
              fullWidth
              {...getFieldProps('financialDetails.bank.accountNumber')}
              error={Boolean(
                touched?.financialDetails?.bank?.accountNumber && errors?.financialDetails?.bank?.accountNumber
              )}
              helperText={
                touched?.financialDetails?.bank?.accountNumber && errors?.financialDetails?.bank?.accountNumber
              }
            />
          </div>

          <div>
            <LabelStyle component="label" htmlFor="routing-number">
              Routing Number
            </LabelStyle>
            <TextField
              id="routing-number"
              fullWidth
              {...getFieldProps('financialDetails.bank.routingNumber')}
              error={Boolean(
                touched?.financialDetails?.bank?.routingNumber && errors?.financialDetails?.bank?.routingNumber
              )}
              helperText={
                touched?.financialDetails?.bank?.routingNumber && errors?.financialDetails?.bank?.routingNumber
              }
            />
          </div>

          <div>
            <LabelStyle component="label" htmlFor="swift-code">
              Swift Code
            </LabelStyle>
            <TextField
              id="swift-code"
              fullWidth
              {...getFieldProps('financialDetails.bank.swiftCode')}
              error={Boolean(touched?.financialDetails?.bank?.swiftCode && errors?.financialDetails?.bank?.swiftCode)}
              helperText={touched?.financialDetails?.bank?.swiftCode && errors?.financialDetails?.bank?.swiftCode}
            />
          </div>
        </>
      </Collapse>
    </Stack>
  );
}
