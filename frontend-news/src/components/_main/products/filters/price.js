import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from '@bprogress/next';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
import Slider from '@/components/slider';
import { Stack, Zoom, Button, Typography } from '@mui/material';

PriceRange.propTypes = {
  prices: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

export default function PriceRange({ prices: filterPrices, path }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const prices = searchParams.get('prices');
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const deleteQueryString = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (Boolean(prices)) {
      setPriceRange([cCurrency(Number(prices.split('_')[0])), cCurrency(Number(prices.split('_')[1]))]);
    } else {
      setPriceRange([0, 100000]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          color="text.primary"
        >
          Price Range
        </Typography>
        <Zoom in={Boolean(prices)}>
          <Button
            onClick={() => {
              setPriceRange([0, 10000]);
              router.replace(`${path}?${deleteQueryString('prices')}`, undefined, { scroll: false });
            }}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ float: 'right', mt: '-3px' }}
          >
            Reset
          </Button>
        </Zoom>
      </Stack>
      <Slider
        filterPrices={filterPrices}
        prices={prices}
        path={path}
        onChangeCommitted={(e, value) => {
          const prices = typeof value === 'object' && value.join('_');
          router.replace(`${path}?${createQueryString('prices', prices)}`, undefined, { scroll: false });
        }}
        onChange={(e, v) => setPriceRange(v)}
        value={priceRange}
      />
    </>
  );
}
