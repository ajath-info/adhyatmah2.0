import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';

export default function CustomerSupportForm({ formik }) {
  const { getFieldProps, touched, errors } = formik;

  return (
    <Stack spacing={2}>
      <Stack gap={1}>
        <Typography variant="overline" component="label" htmlFor="customer-support">
          Support Contact
        </Typography>
        <TextField
          id="customer-support"
          fullWidth
          {...getFieldProps('customerSupport.supportContact')}
          error={Boolean(touched.customerSupport?.supportContact && errors.customerSupport?.supportContact)}
          helperText={touched.customerSupport?.supportContact && errors.customerSupport?.supportContact}
        />
      </Stack>
      <Stack gap={1}>
        <Typography variant="overline" component="label" htmlFor="support-hours">
          Support Hours
        </Typography>
        <TextField
          id="support-hours"
          fullWidth
          {...getFieldProps('customerSupport.supportHours')}
          error={Boolean(touched.customerSupport?.supportHours && errors.customerSupport?.supportHours)}
          helperText={touched.customerSupport?.supportHours && errors.customerSupport?.supportHours}
        />
      </Stack>
    </Stack>
  );
}
