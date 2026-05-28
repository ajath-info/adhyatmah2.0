import React from 'react';
import { fCurrency } from '@/utils/format-number';

import { Stack, TextField, Typography, InputAdornment, CardContent } from '@mui/material';
export default function SimpleProduct({ formik }) {
  const { getFieldProps, touched, errors, values } = formik;
  const isDigital = values.deliveryType === 'digital';
  return (
    <CardContent>
      <Stack gap={2}>
        <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gridGap: 16 }}>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="stockQuantity">
              Stock Quantity
            </Typography>
            <TextField
              id="stockQuantity"
              fullWidth
              type="number"
              {...getFieldProps('stockQuantity')}
              error={Boolean(touched.stockQuantity && errors.stockQuantity)}
              helperText={touched.stockQuantity && errors.stockQuantity}
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="regular-price">
              {'Regular Price'}
            </Typography>
            <TextField
              id="regular-price"
              fullWidth
              placeholder="0.00"
              {...getFieldProps('price')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {fCurrency(0)
                      .replace(/\d+(\.\d+)?/g, '')
                      .trim()}
                  </InputAdornment>
                ),
                type: 'number'
              }}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="sale-price">
              {'Sale Price'}
            </Typography>
            <TextField
              id="sale-price"
              fullWidth
              placeholder="0.00"
              {...getFieldProps('salePrice')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {fCurrency(0)
                      .replace(/\d+(\.\d+)?/g, '')
                      .trim()}
                  </InputAdornment>
                ),
                type: 'number'
              }}
              error={Boolean(touched.salePrice && errors.salePrice)}
              helperText={touched.salePrice && errors.salePrice}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="sku">
              {'SKU'}
            </Typography>
            <TextField
              id="sku"
              fullWidth
              {...getFieldProps('sku')}
              error={Boolean(touched.sku && errors.sku)}
              helperText={touched.sku && errors.sku}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="width">
              {'Width'}
            </Typography>
            <TextField
              id="width"
              fullWidth
              {...getFieldProps('width')}
              error={Boolean(touched.width && errors.width)}
              helperText={touched.width && errors.width}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="height">
              {'Height'}
            </Typography>
            <TextField
              id="height"
              fullWidth
              {...getFieldProps('height')}
              error={Boolean(touched.height && errors.height)}
              helperText={touched.height && errors.height}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="length">
              {'Length'}
            </Typography>
            <TextField
              id="length"
              fullWidth
              {...getFieldProps('length')}
              error={Boolean(touched.length && errors.length)}
              helperText={touched.length && errors.length}
            />
          </Stack>
          {isDigital ? (
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="downloadLink">
                {'Download Link'}
              </Typography>
              <TextField
                id="downloadLink"
                fullWidth
                {...getFieldProps('downloadLink')}
                error={Boolean(touched.downloadLink && errors.downloadLink)}
                helperText={touched.downloadLink && errors.downloadLink}
              />
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </CardContent>
  );
}
