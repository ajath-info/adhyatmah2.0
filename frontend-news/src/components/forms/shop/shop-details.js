import React from 'react';
import { Box, Grid, Stack, TextField, Typography, FormHelperText, Skeleton } from '@mui/material';

// Custom components
import UploadAvatar from '@/components/upload/upload-avatar';
import countries from 'src/data/countries.json';
import PhoneInputField from 'src/components/phone-input-field';
export default function ShopDetailsForm({ handleDrop, formik, state, handleNameChange, isLoading }) {
  const { values, errors, touched, getFieldProps, setFieldValue } = formik;

  const renderLabel = (label) =>
    isLoading ? (
      <Skeleton width={100} height={30} />
    ) : (
      <Typography variant="overline" component="label">
        {label}
      </Typography>
    );

  const renderTextField = (id, props = {}) =>
    isLoading ? <Skeleton variant="rounded" height={56} width="100%" /> : <TextField id={id} fullWidth {...props} />;

  return (
    <Box>
      <Stack spacing={1}>
        {isLoading ? (
          <Skeleton variant="circular" width={100} height={100} sx={{ mx: 2 }} />
        ) : (
          <UploadAvatar
            title="Upload pandit photo"
            accept="image/*"
            file={values?.logo?.url}
            loading={state.logoLoading}
            maxSize={3145728}
            onDrop={(v) => handleDrop(v, 'logo')}
            error={Boolean(touched?.logo && errors?.logo)}
          />
        )}
        {!isLoading && touched?.logo && errors?.logo && (
          <FormHelperText error sx={{ px: 2 }}>
            {errors.logo}
          </FormHelperText>
        )}
      </Stack>

      <Stack mt={3} spacing={3}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <Stack gap={3}>
              <Stack gap={1}>
                {renderLabel('Pandit Name')}
                {renderTextField('name', {
                  ...getFieldProps('name'),
                  onChange: handleNameChange,
                  error: Boolean(touched?.name && errors?.name),
                  helperText: touched?.name && errors?.name
                })}
              </Stack>
              <Stack gap={1}>
                {renderLabel('Slug')}
                {renderTextField('slug', {
                  ...getFieldProps('slug'),
                  error: Boolean(touched?.slug && errors?.slug),
                  helperText: touched?.slug && errors?.slug
                })}
              </Stack>
              <Stack gap={1}>
                {renderLabel('Contact Person')}
                {renderTextField('contactPerson', {
                  ...getFieldProps('contactPerson'),
                  error: Boolean(touched?.contactPerson && errors?.contactPerson),
                  helperText: touched?.contactPerson && errors?.contactPerson
                })}
              </Stack>
              <Stack gap={1}>
                {renderLabel('Registration Number')}
                {renderTextField('registrationNumber', {
                  ...getFieldProps('registrationNumber'),
                  error: Boolean(touched?.registrationNumber && errors?.registrationNumber),
                  helperText: touched?.registrationNumber && errors?.registrationNumber
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('Country')}
                {isLoading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                ) : (
                  <TextField
                    id="country"
                    select
                    fullWidth
                    {...getFieldProps('address.country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched?.address?.country && errors?.address?.country)}
                    helperText={touched?.address?.country && errors?.address?.country}
                  >
                    <option value="">Select Country</option>
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                )}
              </Stack>

              <Stack gap={1}>
                {renderLabel('City')}
                {renderTextField('address.city', {
                  ...getFieldProps('address.city'),
                  error: Boolean(touched?.address?.city && errors?.address?.city),
                  helperText: touched?.address?.city && errors?.address?.city
                })}
              </Stack>
              <Stack gap={1}>
                {renderLabel('VAT Registration Number')}
                {renderTextField('vatRegistrationNumber', {
                  ...getFieldProps('vatRegistrationNumber'),
                  error: Boolean(touched?.vatRegistrationNumber && errors?.vatRegistrationNumber),
                  helperText: touched?.vatRegistrationNumber && errors?.vatRegistrationNumber
                })}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <Stack gap={3}>
              <Stack gap={1}>
                {renderLabel('Meta Title')}
                {renderTextField('metaTitle', {
                  ...getFieldProps('metaTitle'),
                  error: Boolean(touched?.metaTitle && errors?.metaTitle),
                  helperText: touched?.metaTitle && errors?.metaTitle
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('Pandit Email')}
                {renderTextField('shopEmail', {
                  ...getFieldProps('shopEmail'),
                  error: Boolean(touched?.shopEmail && errors?.shopEmail),
                  helperText: touched?.shopEmail && errors?.shopEmail
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('Pandit Phone')}
                {isLoading ? (
                  <Skeleton variant="rounded" height={56} width="100%" />
                ) : (
                  <PhoneInputField
                    error={touched?.shopPhone && errors?.shopPhone}
                    onChange={(val) => setFieldValue('shopPhone', val)}
                    value={values.shopPhone}
                  />
                )}
              </Stack>

              <Stack gap={1}>
                {renderLabel('Website')}
                {renderTextField('website', {
                  ...getFieldProps('website'),
                  error: Boolean(touched?.website && errors?.website),
                  helperText: touched?.website && errors?.website
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('State')}
                {renderTextField('address.state', {
                  ...getFieldProps('address.state'),
                  error: Boolean(touched?.address?.state && errors?.address?.state),
                  helperText: touched?.address?.state && errors?.address?.state
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('Street Address')}
                {renderTextField('address.streetAddress', {
                  ...getFieldProps('address.streetAddress'),
                  error: Boolean(touched?.address?.streetAddress && errors?.address?.streetAddress),
                  helperText: touched?.address?.streetAddress && errors?.address?.streetAddress
                })}
              </Stack>

              <Stack gap={1}>
                {renderLabel('TAX Identification Number')}
                {renderTextField('taxIdentificationNumber', {
                  ...getFieldProps('taxIdentificationNumber'),
                  error: Boolean(touched?.taxIdentificationNumber && errors?.taxIdentificationNumber),
                  helperText: touched?.taxIdentificationNumber && errors?.taxIdentificationNumber
                })}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Stack gap={1}>
          {renderLabel('Description')}
          {isLoading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          ) : (
            <TextField
              id="description"
              fullWidth
              multiline
              rows={4}
              {...getFieldProps('description')}
              error={Boolean(touched?.description && errors?.description)}
              helperText={touched?.description && errors?.description}
            />
          )}
        </Stack>

        <Stack gap={1}>
          {renderLabel('Meta Description')}
          {isLoading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          ) : (
            <TextField
              id="metaDescription"
              fullWidth
              multiline
              rows={4}
              {...getFieldProps('metaDescription')}
              error={Boolean(touched?.metaDescription && errors?.metaDescription)}
              helperText={touched?.metaDescription && errors?.metaDescription}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
