'use client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// mui

import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton,
  RadioGroup,
  Radio,
  FormControlLabel,
  Collapse,
  Tooltip,
  IconButton,
  InputAdornment
} from '@mui/material';
// api
import * as api from 'src/services';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import { IoInformationCircle } from 'react-icons/io5';
import { currencySchema } from '@/validations';

const currencies = [
  { name: 'US Dollar', code: 'INR', country: 'United States' },
  { name: 'UAE Dirham', code: 'AED', country: 'United Arab Emirates' },
  { name: 'Afghan Afghani', code: 'AFN', country: 'Afghanistan' },
  { name: 'Albanian Lek', code: 'ALL', country: 'Albania' },
  { name: 'Armenian Dram', code: 'AMD', country: 'Armenia' },
  { name: 'Netherlands Antillean Guilder', code: 'ANG', country: 'Netherlands Antilles' },
  { name: 'Angolan Kwanza', code: 'AOA', country: 'Angola' },
  { name: 'Argentine Peso', code: 'ARS', country: 'Argentina' },
  { name: 'Australian Dollar', code: 'AUD', country: 'Australia' },
  { name: 'Aruban Florin', code: 'AWG', country: 'Aruba' },
  { name: 'Azerbaijani Manat', code: 'AZN', country: 'Azerbaijan' },
  { name: 'Bosnia-Herzegovina Convertible Mark', code: 'BAM', country: 'Bosnia and Herzegovina' },
  { name: 'Barbadian Dollar', code: 'BBD', country: 'Barbados' },
  { name: 'Bangladeshi Taka', code: 'BDT', country: 'Bangladesh' },
  { name: 'Bulgarian Lev', code: 'BGN', country: 'Bulgaria' },
  { name: 'Bahraini Dinar', code: 'BHD', country: 'Bahrain' },
  { name: 'Burundian Franc', code: 'BIF', country: 'Burundi' },
  { name: 'Bermudian Dollar', code: 'BMD', country: 'Bermuda' },
  { name: 'Brunei Dollar', code: 'BND', country: 'Brunei' },
  { name: 'Bolivian Boliviano', code: 'BOB', country: 'Bolivia' },
  { name: 'Brazilian Real', code: 'BRL', country: 'Brazil' },
  { name: 'Bahamian Dollar', code: 'BSD', country: 'Bahamas' },
  { name: 'Bhutanese Ngultrum', code: 'BTN', country: 'Bhutan' },
  { name: 'Botswana Pula', code: 'BWP', country: 'Botswana' },
  { name: 'Belarusian Ruble', code: 'BYN', country: 'Belarus' },
  { name: 'Belize Dollar', code: 'BZD', country: 'Belize' },
  { name: 'Canadian Dollar', code: 'CAD', country: 'Canada' },
  { name: 'Congolese Franc', code: 'CDF', country: 'Democratic Republic of the Congo' },
  { name: 'Swiss Franc', code: 'CHF', country: 'Switzerland' },
  { name: 'Chilean Peso', code: 'CLP', country: 'Chile' },
  { name: 'Chinese Yuan', code: 'CNY', country: 'China' },
  { name: 'Colombian Peso', code: 'COP', country: 'Colombia' },
  { name: 'Costa Rican Colón', code: 'CRC', country: 'Costa Rica' },
  { name: 'Cuban Peso', code: 'CUP', country: 'Cuba' },
  { name: 'Cape Verdean Escudo', code: 'CVE', country: 'Cape Verde' },
  { name: 'Czech Koruna', code: 'CZK', country: 'Czech Republic' },
  { name: 'Djiboutian Franc', code: 'DJF', country: 'Djibouti' },
  { name: 'Danish Krone', code: 'DKK', country: 'Denmark' },
  { name: 'Dominican Peso', code: 'DOP', country: 'Dominican Republic' },
  { name: 'Algerian Dinar', code: 'DZD', country: 'Algeria' },
  { name: 'Egyptian Pound', code: 'EGP', country: 'Egypt' },
  { name: 'Eritrean Nakfa', code: 'ERN', country: 'Eritrea' },
  { name: 'Ethiopian Birr', code: 'ETB', country: 'Ethiopia' },
  { name: 'Euro', code: 'EUR', country: 'European Union' },
  { name: 'Fijian Dollar', code: 'FJD', country: 'Fiji' },
  { name: 'Falkland Islands Pound', code: 'FKP', country: 'Falkland Islands' },
  { name: 'Faroese Króna', code: 'FOK', country: 'Faroe Islands' },
  { name: 'British Pound Sterling', code: 'GBP', country: 'United Kingdom' },
  { name: 'Georgian Lari', code: 'GEL', country: 'Georgia' },
  { name: 'Guernsey Pound', code: 'GGP', country: 'Guernsey' },
  { name: 'Ghanaian Cedi', code: 'GHS', country: 'Ghana' },
  { name: 'Gibraltar Pound', code: 'GIP', country: 'Gibraltar' },
  { name: 'Gambian Dalasi', code: 'GMD', country: 'Gambia' },
  { name: 'Guinean Franc', code: 'GNF', country: 'Guinea' },
  { name: 'Guatemalan Quetzal', code: 'GTQ', country: 'Guatemala' },
  { name: 'Guyanaese Dollar', code: 'GYD', country: 'Guyana' },
  { name: 'Hong Kong Dollar', code: 'HKD', country: 'Hong Kong' },
  { name: 'Honduran Lempira', code: 'HNL', country: 'Honduras' },
  { name: 'Croatian Kuna', code: 'HRK', country: 'Croatia' },
  { name: 'Haitian Gourde', code: 'HTG', country: 'Haiti' },
  { name: 'Hungarian Forint', code: 'HUF', country: 'Hungary' },
  { name: 'Indonesian Rupiah', code: 'IDR', country: 'Indonesia' },
  { name: 'Israeli New Shekel', code: 'ILS', country: 'Israel' },
  { name: 'Isle of Man Pound', code: 'IMP', country: 'Isle of Man' },
  { name: 'Indian Rupee', code: 'INR', country: 'India' },
  { name: 'Iraqi Dinar', code: 'IQD', country: 'Iraq' },
  { name: 'Iranian Rial', code: 'IRR', country: 'Iran' },
  { name: 'Icelandic Króna', code: 'ISK', country: 'Iceland' },
  { name: 'Jersey Pound', code: 'JEP', country: 'Jersey' },
  { name: 'Jamaican Dollar', code: 'JMD', country: 'Jamaica' },
  { name: 'Jordanian Dinar', code: 'JOD', country: 'Jordan' },
  { name: 'Japanese Yen', code: 'JPY', country: 'Japan' },
  { name: 'Kenyan Shilling', code: 'KES', country: 'Kenya' },
  { name: 'Kyrgyzstani Som', code: 'KGS', country: 'Kyrgyzstan' },
  { name: 'Cambodian Riel', code: 'KHR', country: 'Cambodia' },
  { name: 'Kiribati Dollar', code: 'KID', country: 'Kiribati' },
  { name: 'Comorian Franc', code: 'KMF', country: 'Comoros' },
  { name: 'South Korean Won', code: 'KRW', country: 'South Korea' },
  { name: 'Kuwaiti Dinar', code: 'KWD', country: 'Kuwait' },
  { name: 'Cayman Islands Dollar', code: 'KYD', country: 'Cayman Islands' },
  { name: 'Kazakhstani Tenge', code: 'KZT', country: 'Kazakhstan' },
  { name: 'Laotian Kip', code: 'LAK', country: 'Laos' },
  { name: 'Lebanese Pound', code: 'LBP', country: 'Lebanon' },
  { name: 'Sri Lankan Rupee', code: 'LKR', country: 'Sri Lanka' },
  { name: 'Liberian Dollar', code: 'LRD', country: 'Liberia' },
  { name: 'Lesotho Loti', code: 'LSL', country: 'Lesotho' },
  { name: 'Libyan Dinar', code: 'LYD', country: 'Libya' },
  { name: 'Moroccan Dirham', code: 'MAD', country: 'Morocco' },
  { name: 'Moldovan Leu', code: 'MDL', country: 'Moldova' },
  { name: 'Malagasy Ariary', code: 'MGA', country: 'Madagascar' },
  { name: 'Macedonian Denar', code: 'MKD', country: 'North Macedonia' },
  { name: 'Myanmar Kyat', code: 'MMK', country: 'Myanmar' },
  { name: 'Mongolian Tugrik', code: 'MNT', country: 'Mongolia' },
  { name: 'Macanese Pataca', code: 'MOP', country: 'Macau' },
  { name: 'Mauritanian Ouguiya', code: 'MRU', country: 'Mauritania' },
  { name: 'Mauritian Rupee', code: 'MUR', country: 'Mauritius' },
  { name: 'Maldivian Rufiyaa', code: 'MVR', country: 'Maldives' },
  { name: 'Malawian Kwacha', code: 'MWK', country: 'Malawi' },
  { name: 'Mexican Peso', code: 'MXN', country: 'Mexico' },
  { name: 'Malaysian Ringgit', code: 'MYR', country: 'Malaysia' },
  { name: 'Mozambican Metical', code: 'MZN', country: 'Mozambique' },
  { name: 'Namibian Dollar', code: 'NAD', country: 'Namibia' },
  { name: 'Nigerian Naira', code: 'NGN', country: 'Nigeria' },
  { name: 'Nicaraguan Córdoba', code: 'NIO', country: 'Nicaragua' },
  { name: 'Norwegian Krone', code: 'NOK', country: 'Norway' },
  { name: 'Nepalese Rupee', code: 'NPR', country: 'Nepal' },
  { name: 'New Zealand Dollar', code: 'NZD', country: 'New Zealand' },
  { name: 'Omani Rial', code: 'OMR', country: 'Oman' },
  { name: 'Panamanian Balboa', code: 'PAB', country: 'Panama' },
  { name: 'Peruvian Nuevo Sol', code: 'PEN', country: 'Peru' },
  { name: 'Papua New Guinean Kina', code: 'PGK', country: 'Papua New Guinea' },
  { name: 'Philippine Peso', code: 'PHP', country: 'Philippines' },
  { name: 'Pakistani Rupee', code: 'PKR', country: 'Pakistan' },
  { name: 'Polish Zloty', code: 'PLN', country: 'Poland' },
  { name: 'Paraguayan Guarani', code: 'PYG', country: 'Paraguay' },
  { name: 'Qatari Riyal', code: 'QAR', country: 'Qatar' },
  { name: 'Romanian Leu', code: 'RON', country: 'Romania' },
  { name: 'Serbian Dinar', code: 'RSD', country: 'Serbia' },
  { name: 'Russian Ruble', code: 'RUB', country: 'Russia' },
  { name: 'Rwandan Franc', code: 'RWF', country: 'Rwanda' },
  { name: 'Saudi Riyal', code: 'SAR', country: 'Saudi Arabia' },
  { name: 'Solomon Islands Dollar', code: 'SBD', country: 'Solomon Islands' },
  { name: 'Seychellois Rupee', code: 'SCR', country: 'Seychelles' },
  { name: 'Sudanese Pound', code: 'SDG', country: 'Sudan' },
  { name: 'Swedish Krona', code: 'SEK', country: 'Sweden' },
  { name: 'Singapore Dollar', code: 'SGD', country: 'Singapore' },
  { name: 'Saint Helena Pound', code: 'SHP', country: 'Saint Helena' },
  { name: 'Sierra Leonean Leone', code: 'SLE', country: 'Sierra Leone' },
  { name: 'Sierra Leonean Leone', code: 'SLL', country: 'Sierra Leone' },
  { name: 'Somali Shilling', code: 'SOS', country: 'Somalia' },
  { name: 'Surinamese Dollar', code: 'SRD', country: 'Suriname' },
  { name: 'South Sudanese Pound', code: 'SSP', country: 'South Sudan' },
  { name: 'São Tomé and Príncipe Dobra', code: 'STN', country: 'São Tomé and Príncipe' },
  { name: 'Syrian Pound', code: 'SYP', country: 'Syria' },
  { name: 'Swazi Lilangeni', code: 'SZL', country: 'Swaziland' },
  { name: 'Thai Baht', code: 'THB', country: 'Thailand' },
  { name: 'Tajikistani Somoni', code: 'TJS', country: 'Tajikistan' },
  { name: 'Turkmenistani Manat', code: 'TMT', country: 'Turkmenistan' },
  { name: 'Tunisian Dinar', code: 'TND', country: 'Tunisia' },
  { name: 'Tongan Paʻanga', code: 'TOP', country: 'Tonga' },
  { name: 'Turkish Lira', code: 'TRY', country: 'Turkey' },
  { name: 'Trinidad and Tobago Dollar', code: 'TTD', country: 'Trinidad and Tobago' },
  { name: 'Tuvaluan Dollar', code: 'TVD', country: 'Tuvalu' },
  { name: 'New Taiwan Dollar', code: 'TWD', country: 'Taiwan' },
  { name: 'Tanzanian Shilling', code: 'TZS', country: 'Tanzania' },
  { name: 'Ukrainian Hryvnia', code: 'UAH', country: 'Ukraine' },
  { name: 'Ugandan Shilling', code: 'UGX', country: 'Uganda' },
  { name: 'Uruguayan Peso', code: 'UYU', country: 'Uruguay' },
  { name: 'Uzbekistan Som', code: 'UZS', country: 'Uzbekistan' },
  { name: 'Venezuelan Bolívar', code: 'VES', country: 'Venezuela' },
  { name: 'Vietnamese Dong', code: 'VND', country: 'Vietnam' },
  { name: 'Vanuatu Vatu', code: 'VUV', country: 'Vanuatu' },
  { name: 'Samoan Tala', code: 'WST', country: 'Samoa' },
  { name: 'Central African CFA Franc', code: 'XAF', country: 'Central African Republic' },
  { name: 'East Caribbean Dollar', code: 'XCD', country: 'Eastern Caribbean' },
  { name: 'Special Drawing Rights', code: 'XDR', country: 'International Monetary Fund' },
  { name: 'West African CFA Franc', code: 'XOF', country: 'West African Economic and Monetary Union' },
  { name: 'CFP Franc', code: 'XPF', country: 'French Polynesia' },
  { name: 'Yemeni Rial', code: 'YER', country: 'Yemen' },
  { name: 'South African Rand', code: 'ZAR', country: 'South Africa' },
  { name: 'Zambian Kwacha', code: 'ZMW', country: 'Zambia' },
  { name: 'Zimbabwean Dollar', code: 'ZWL', country: 'Zimbabwe' }
];

const STATUS_OPTIONS = ['active', 'inactive'];

export default function BrandsForm({ data: currentCurrency, isLoading: currencyLoading, handleClose, handleCancel }) {
  const [value, setValue] = React.useState('default');
  const isCustom = value === 'custom';

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const mutationFn = currentCurrency ? api.updateCurrencyByAdmin : api.addCurrencyByAdmin;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      handleClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  const formik = useFormik({
    initialValues: {
      currency: currentCurrency?.code || currencies[0].code,
      rate: currentCurrency?.rate || '',
      base: currentCurrency?.base,
      status: currentCurrency?.status || 'active'
    },
    enableReinitialize: true,
    validationSchema: currencySchema,
    onSubmit: async (values) => {
      try {
        const { currency, rate, ...others } = values;
        mutate({
          ...others,
          ...currencies.find((cur) => cur.code === currency),
          rate: isCustom ? rate : null,
          ...(currentCurrency && { _id: currentCurrency._id })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  useEffect(() => {
    if (currentCurrency) {
      setValue(Boolean(currentCurrency.rate) ? 'custom' : 'default');
    }
  }, [currentCurrency]);

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 12, xs: 12 }}>
              <Stack spacing={3}>
                <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                  <Stack gap={1}>
                    {currencyLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <Typography variant="overline" htmlFor="currency" color="text.primary" component={'label'}>
                        Currency
                      </Typography>
                    )}

                    {currencyLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <Select
                        id="currency"
                        native
                        {...getFieldProps('currency')}
                        error={Boolean(touched.currency && errors.currency)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code} style={{ textTransform: 'capitalize' }}>
                            {currency.name} ({currency.code})
                          </option>
                        ))}
                      </Select>
                    )}
                    {touched.currency && errors.currency && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.currency && errors.currency}
                      </FormHelperText>
                    )}
                  </Stack>
                </FormControl>
                <FormControl>
                  <Typography htmlFor="base-type">
                    {currencyLoading ? (
                      <Skeleton variant="text" width={200} />
                    ) : (
                      <>
                        <Typography variant="overline" color="text.primary" component={'label'}>
                          Base Currency
                        </Typography>

                        <Tooltip arrow title={'Base currency is defualt currency'} placement="right">
                          <IconButton size="small" color="inherit" aria-label="info">
                            <IoInformationCircle />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Typography>
                  {currencyLoading ? (
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
                      id="base-type"
                      value={values.base ? 'yes' : 'no'}
                      onChange={(e) => setFieldValue('base', Boolean(e.target.value === 'yes'))}
                    >
                      <FormControlLabel disabled={currentCurrency?.base} value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel disabled={currentCurrency?.base} value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                </FormControl>
                <Collapse in={!values.base}>
                  <div>
                    <FormControl>
                      <Typography component={'label'}>
                        {currencyLoading ? (
                          <Skeleton variant="text" width={200} />
                        ) : (
                          <Typography variant="overline" htmlFor="rate-type" color="text.primary">
                            Rate Type
                          </Typography>
                        )}
                      </Typography>

                      {currencyLoading ? (
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
                        <RadioGroup row id="rate-type" value={value} onChange={handleChange}>
                          <FormControlLabel value="default" control={<Radio />} label="Default" />
                          <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                        </RadioGroup>
                      )}
                    </FormControl>

                    <Collapse in={isCustom}>
                      <Stack gap={1}>
                        {currencyLoading ? (
                          <Skeleton variant="text" width={140} />
                        ) : (
                          <Typography variant="overline" component={'label'} htmlFor="currency-rate">
                            Currency rate
                          </Typography>
                        )}
                        {currencyLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="currency-rate"
                            fullWidth
                            type="number"
                            {...getFieldProps('rate')}
                            error={Boolean(touched.rate && errors.rate)}
                            helperText={touched.rate && errors.rate}
                            InputProps={{
                              endAdornment: <InputAdornment position="start">{values?.currency}</InputAdornment>
                            }}
                          />
                        )}
                      </Stack>
                    </Collapse>
                  </div>
                </Collapse>

                <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                  <Stack gap={1}>
                    {currencyLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <Typography variant="overline" component={'label'} htmlFor="brand-status">
                        Status
                      </Typography>
                    )}
                    {currencyLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <Select
                        id="brand-status"
                        native
                        {...getFieldProps('status')}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} style={{ textTransform: 'capitalize' }}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Stack>
                  {touched.status && errors.status && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.status && errors.status}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Box sx={{ ml: 'auto' }}>
              <Stack direction={'row'} gap={2}>
                {currencyLoading ? (
                  <Skeleton variant="rounded" width="151px" height={56} sx={{ mt: 3 }} />
                ) : (
                  <Button variant="outlined" size="large" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                {currencyLoading ? (
                  <Skeleton variant="rounded" width="151px" height={56} sx={{ mt: 3 }} />
                ) : (
                  <Button type="submit" variant="contained" size="large" loading={isLoading}>
                    {currentCurrency ? 'Update Currency' : 'Create Curreny'}
                  </Button>
                )}
              </Stack>
            </Box>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
BrandsForm.propTypes = { data: PropTypes.object, isLoading: PropTypes.bool };
