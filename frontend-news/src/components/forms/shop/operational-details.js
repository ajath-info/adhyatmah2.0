import React from 'react';
import { Stack, Box, TextField, FormHelperText, Typography } from '@mui/material';

import UploadSingleFile from './UploadSingleFile'; // Adjust import if needed

// Styled label
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function OperationalDetailsForm({ formik }) {
  const { values, errors, touched, getFieldProps } = formik;

  return (
    <Stack spacing={2}>
      {/* Return Policy */}
      <div>
        <LabelStyle component="label" htmlFor="return-policy">
          Return Policy
        </LabelStyle>

        <TextField
          id="return-policy"
          fullWidth
          {...getFieldProps('operationalDetails.returnPolicy')}
          error={Boolean(touched?.operationalDetails?.returnPolicy && errors?.operationalDetails?.returnPolicy)}
          helperText={touched?.operationalDetails?.returnPolicy && errors?.operationalDetails?.returnPolicy}
        />
      </div>

      {/* Signed Vendor Agreement */}
      <Box>
        <Stack direction="row" justifyContent="space-between">
          <LabelStyle variant="body1" component="label" color="text.primary">
            Signed Vendor Agreement
          </LabelStyle>
        </Stack>

        <UploadSingleFile
          id="vendor-agreement"
          file={values?.vendorAgreementFile}
          onDrop={(v) => handleDrop(v, 'legalAgreements.vendorAgreement')}
          error={Boolean(touched?.legalAgreements?.vendorAgreement && errors?.legalAgreements?.vendorAgreement)}
          category
          accept="image/*"
          loading={values?.vendorAgreementLoading} // Assuming you're storing loading in Formik state
        />

        {touched?.legalAgreements?.vendorAgreement && errors?.legalAgreements?.vendorAgreement && (
          <FormHelperText error sx={{ px: 2, mx: 0 }}>
            {errors?.legalAgreements?.vendorAgreement}
          </FormHelperText>
        )}
      </Box>
    </Stack>
  );
}
