'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Card, Box, Typography, IconButton, Divider } from '@mui/material';
// icons
import { MdClear } from 'react-icons/md';

// components
import BrandsFilter from './brands';
import GenderFilter from './genders';
import ColorsFilter from './colors';
import SizesFilter from './others';
import PriceRange from './price';

Filter.propTypes = {
  onClose: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  data: PropTypes.array
};

export default function Filter({ ...props }) {
  const { onClose, pathname, filters } = props;

  const colors = filters?.attributes.find((item) => {
    const name = item?.name?.toLowerCase();
    return name === 'color' || name === 'colors';
  });

  const restVariants = filters?.attributes.filter((item) => {
    const name = item?.name?.toLowerCase();
    return name !== 'color' && name !== 'colors';
  });
  return (
    <Card sx={{ width: '300px', border: 'none !important', borderRadius: '0px !important' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h5" color="text.primary">
          Filter
        </Typography>

        <IconButton onClick={() => onClose()}>
          <MdClear />
        </IconButton>
      </Box>
      <Box sx={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
        {Boolean(filters?.brands?.length) && (
          <Box p={2}>
            <BrandsFilter brands={filters?.brands} path={pathname} />
          </Box>
        )}
        {Boolean(filters?.genders?.length) && (
          <>
            <Divider />
            <Box p={2}>
              <GenderFilter genders={filters?.genders} path={pathname} />
            </Box>
          </>
        )}
        {Boolean(colors?.values) && (
          <>
            <Divider />
            <Box p={2}>
              <ColorsFilter colors={colors.values} keyName={colors.name} path={pathname} />
            </Box>
          </>
        )}
        {restVariants.map((filter) => (
          <React.Fragment key={filter.name}>
            <Divider />
            <Box p={2}>
              <SizesFilter values={filter?.values} path={pathname} keyName={filter.name} />
            </Box>
          </React.Fragment>
        ))}
        <Divider />
        <Box p={2}>
          <PriceRange prices={filters?.prices} path={pathname} />
        </Box>
      </Box>
    </Card>
  );
}
