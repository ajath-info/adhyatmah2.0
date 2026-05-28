import React from 'react';
import { Stack, Typography, FormHelperText, Skeleton } from '@mui/material';
import UploadSingleFile from '@/components/upload/upload-single-file'; // adjust path if needed

export default function IdentityVerificationForm({ formik, handleDrop, state, isLoading }) {
  const { values, errors, touched } = formik;

  return (
    <Stack spacing={3}>
      {/* Government ID Upload */}
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="overline" component="label" color="text.primary">
            {isLoading ? <Skeleton variant="text" width={100} /> : 'Government ID'}
          </Typography>
        </Stack>

        {isLoading ? (
          <Skeleton variant="rounded" height={240.5} />
        ) : (
          <>
            <UploadSingleFile
              id="government-id-upload"
              file={values?.identityVerification?.governmentId}
              onDrop={(v) => handleDrop(v, 'identityVerification.governmentId')}
              error={Boolean(touched?.identityVerification?.governmentId && errors?.identityVerification?.governmentId)}
              category
              accept="image/*"
              loading={state?.governmentIdLoading}
            />

            {touched?.identityVerification?.governmentId && errors?.identityVerification?.governmentId && (
              <FormHelperText error sx={{ px: 2 }}>
                {errors?.identityVerification?.governmentId}
              </FormHelperText>
            )}
          </>
        )}
      </Stack>

      {/* Proof of Address Upload */}
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="overline" component="label" color="text.primary">
            {isLoading ? <Skeleton variant="text" width={100} /> : '  Proof of Address'}
          </Typography>
        </Stack>

        {isLoading ? (
          <Skeleton variant="rounded" height={240.5} />
        ) : (
          <>
            <UploadSingleFile
              id="proof-of-address-upload"
              file={values?.identityVerification?.proofOfAddress}
              onDrop={(v) => handleDrop(v, 'identityVerification.proofOfAddress')}
              error={Boolean(
                touched?.identityVerification?.proofOfAddress && errors?.identityVerification?.proofOfAddress
              )}
              category
              accept="image/*"
              loading={state?.proofOfAddressLoading}
            />

            {touched?.identityVerification?.proofOfAddress && errors?.identityVerification?.proofOfAddress && (
              <FormHelperText error sx={{ px: 2 }}>
                {errors?.identityVerification?.proofOfAddress}
              </FormHelperText>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
