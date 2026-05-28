'use client';
import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Stack, TextField, Card, CardHeader, Typography, FormControlLabel, Checkbox } from '@mui/material';
// countries
import countries from 'src/data/countries.json';
import PhoneInputField from '../phone-input-field';

export default function CheckoutGuestForm({
  getFieldProps,
  touched,
  errors,
  handleChangeShipping,
  checked,
  setFieldValue,
  phone
}) {
  return (
    <Card>
      <CardHeader title={<Typography variant="h4">Billing Detail</Typography>} />
      <Stack spacing={{ xs: 2, sm: 3 }} p={3} mt={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="firstName" component={'label'}>
              First Name
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              type="text"
            />
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="lastName" component={'label'}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              type="text"
            />
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="email" component={'label'}>
              Email
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>

          <Stack gap={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="phone" component={'label'}>
              Phone
            </Typography>
            <PhoneInputField
              error={touched?.phone && errors?.phone}
              onChange={(val) => setFieldValue('phone', val)}
              value={phone}
            />
          </Stack>
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="overline" color="text.primary" htmlFor="address" component={'label'}>
            Address
          </Typography>
          <TextField
            fullWidth
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="city" component={'label'}>
              Town City
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="state" component={'label'}>
              State
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('state')}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && errors.state}
            />
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="zip" component={'label'}>
              Zip/Postal Code
            </Typography>
            <TextField
              fullWidth
              {...getFieldProps('zip')}
              error={Boolean(touched.zip && errors.zip)}
              helperText={touched.zip && errors.zip}
              type="number"
            />
          </Stack>
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="overline" color="text.primary" htmlFor="country" component={'label'}>
            Country
          </Typography>
          <TextField
            select
            fullWidth
            placeholder="Country"
            {...getFieldProps('country')}
            SelectProps={{ native: true }}
            error={Boolean(touched.country && errors.country)}
            helperText={touched.country && errors.country}
          >
            {countries.map((option) => (
              <option key={option.code} value={option.label}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="overline" color="text.primary" htmlFor="note" component={'label'}>
            Note
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            id="note"
            {...getFieldProps('note')}
            error={Boolean(touched.note && errors.note)}
            helperText={touched.note && errors.note}
            type="text"
          />
        </Stack>
        <FormControlLabel
          control={<Checkbox onChange={handleChangeShipping} checked={checked} />}
          label="Ship to a different address?"
        />
      </Stack>
    </Card>
  );
}
CheckoutGuestForm.propTypes = {
  getFieldProps: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
