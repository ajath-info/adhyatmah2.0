import React from 'react';
import { useSelector, useDispatch } from '@/redux';
import { setDirection } from '@/redux/slices/settings';

// MUI
import { Stack, Tooltip, Typography } from '@mui/material';

import { FiAlignRight, FiAlignLeft } from 'react-icons/fi';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const modes = [
  { value: 'ltr', icon: <FiAlignLeft /> },
  { value: 'rtl', icon: <FiAlignRight /> }
];

export default function ThemeMode() {
  const dispatch = useDispatch();
  const { direction } = useSelector((state) => state.settings);
  const handleChange = (event, val) => {
    dispatch(setDirection(Boolean(val) ? val : direction));
  };
  return (
    <div>
      <Typography variant="overline" color="inherit" gutterBottom>
        Direction
      </Typography>

      <Stack direction="row" gap={1}>
        <ToggleButtonGroup
          value={direction}
          exclusive
          size="large"
          fullWidth
          onChange={handleChange}
          aria-label="text alignment"
          sx={{ height: 56, svg: { fontSize: 30 } }}
        >
          {modes.map(({ value, icon }) => {
            return (
              <Tooltip key={value} title={value === 'ltr' ? 'Left To Right' : 'Right To Left'}>
                <ToggleButton value={value} aria-label="left aligned" color="primary" variant="contained">
                  {icon}
                </ToggleButton>
              </Tooltip>
            );
          })}
        </ToggleButtonGroup>
      </Stack>
    </div>
  );
}
