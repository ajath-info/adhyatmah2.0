import React, { Fragment } from 'react';
import Image from '@/components/blur-image';
import { Typography, Stack, Tooltip, Box, Button } from '@mui/material';
import { capitalize } from 'lodash';
export default function VariantSelection({ names = [], variants = [], product, selectedVariant, onChangeVariant }) {
  return (
    <Stack gap={0.5}>
      {names.map((name, index) => (
        <Fragment key={index}>
          <Typography variant="subtitle1" color="text.primary">
            {name}
          </Typography>

          <Stack direction="row" gap={2} sx={{ flexWrap: 'wrap' }}>
            {[...new Set(variants[index] || [])].map((variant, ind) =>
              name.toLowerCase() === 'color' ? (
                <Tooltip title={capitalize(variant)} key={variant}>
                  <Box
                    onClick={() => onChangeVariant(variant, index)}
                    sx={{
                      position: 'relative',
                      width: 60,
                      height: 60,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: (theme) =>
                        `2px solid ${
                          selectedVariant?.split('/')?.includes(variant)
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`
                    }}
                  >
                    <Image
                      src={product?.variants?.[ind]?.images?.[0]?.url || '/placeholder.png'}
                      alt={variant}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Tooltip>
              ) : (
                <Button
                  key={variant}
                  variant={selectedVariant?.split('/')?.includes(variant) ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ textTransform: 'uppercase' }}
                  onClick={() => onChangeVariant(variant, index)}
                >
                  {variant}
                </Button>
              )
            )}
          </Stack>
        </Fragment>
      ))}
    </Stack>
  );
}
