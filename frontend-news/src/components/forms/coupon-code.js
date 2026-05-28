'use client';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import {
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  Grid,
  Skeleton,
  FormControlLabel,
  Radio,
  InputAdornment,
  RadioGroup
} from '@mui/material';
// api
import * as api from 'src/services';
// next
import { useRouter } from '@bprogress/next';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { couponCodeSchema } from '@/validations';

export default function CouponCodeForm({ data: currentCouponCode, isLoading: categoryLoading }) {
  const router = useRouter();
  const fCurrency = useCurrencyFormat('base');
  const mutationFn = currentCouponCode ? api.updateCouponCodeByAdmin : api.addCouponCodeByAdmin;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/admin/coupon-codes');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  const formik = useFormik({
    initialValues: {
      name: currentCouponCode?.name || '',
      code: currentCouponCode?.code || '',
      type: currentCouponCode?.type || 'fixed',
      discount: currentCouponCode?.discount || '',
      expire: currentCouponCode?.expire?.split('T')[0] || '',
      description: currentCouponCode?.description || ''
    },
    enableReinitialize: true,
    validationSchema: couponCodeSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({ ...rest, ...(currentCouponCode && { currentId: currentCouponCode?._id }) });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 8, xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <Typography variant="overline" htmlFor="name" color="text.primary" component={'label'}>
                        Name
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="name"
                        fullWidth
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography variant="overline" htmlFor="coupon-code" color="text.primary" component={'label'}>
                        Coupon Code
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="coupen-code"
                        fullWidth
                        {...getFieldProps('code')}
                        error={Boolean(touched.code && errors.code)}
                        helperText={touched.code && errors.code}
                      />
                    )}
                  </Stack>
                  <div>
                    <FormControl>
                      <Typography variant="overline" component={'label'} htmlFor="discount-type">
                        {categoryLoading ? <Skeleton variant="text" width={100} /> : 'Discount type'}
                      </Typography>
                      {categoryLoading ? (
                        <Stack direction="row" gap={1}>
                          <Stack direction="row" gap={1} alignItems="center">
                            <Skeleton variant="circular" height={42} width={42} />
                            <Skeleton variant="text" height={22} width={140} />
                          </Stack>
                          <Stack direction="row" gap={1} alignItems="center">
                            <Skeleton variant="circular" height={42} width={42} />
                            <Skeleton variant="text" height={22} width={140} />
                          </Stack>
                        </Stack>
                      ) : (
                        <RadioGroup
                          row
                          name="row-radio-buttons-group"
                          value={values.type}
                          onChange={(e) => setFieldValue('type', e.target.value)}
                        >
                          <FormControlLabel value="fixed" control={<Radio />} label="Fixed amount" />
                          <FormControlLabel value="percent" control={<Radio />} label="Percentage" />
                        </RadioGroup>
                      )}
                    </FormControl>
                  </div>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <Typography variant="overline" htmlFor="discount" color="text.primary" component={'label'}>
                        Discount
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="discount"
                        fullWidth
                        {...getFieldProps('discount')}
                        error={Boolean(touched.discount && errors.discount)}
                        helperText={touched.discount && errors.discount}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {values.type === 'fixed'
                                ? fCurrency(0)
                                  ? fCurrency(0)
                                      ?.replace(/\d+(\.\d+)?/g, '')
                                      .trim()
                                  : null
                                : '%'}
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              <div style={{ position: '-webkit-sticky', position: 'sticky', top: 0 }}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Stack gap={1}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <Typography variant="overline" htmlFor="description" color="text.primary" component={'label'}>
                            Description
                          </Typography>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rounded" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="description"
                            fullWidth
                            {...getFieldProps('description')}
                            error={Boolean(touched.description && errors.description)}
                            helperText={touched.description && errors.description}
                            rows={9}
                            multiline
                          />
                        )}
                      </Stack>
                      <Stack gap={1}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <Typography variant="overline" htmlFor="expiry-date" color="text.primary" component={'label'}>
                            Expiry Date
                          </Typography>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="expiry-date"
                            type="date"
                            fullWidth
                            {...getFieldProps('expire')}
                            error={Boolean(touched.expire && errors.expire)}
                            helperText={touched.expire && errors.expire}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Card>
                  {categoryLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={{ ml: 'auto', mt: 3 }}
                    >
                      {currentCouponCode ? 'Update' : 'Create'}
                    </Button>
                  )}
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
CouponCodeForm.propTypes = {
  data: PropTypes.object, // Adjust the type accordingly based on the actual data type
  isLoading: PropTypes.bool
};
