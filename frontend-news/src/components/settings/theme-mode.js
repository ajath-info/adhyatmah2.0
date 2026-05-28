import React from 'react';
import { useSelector, useDispatch } from '@/redux';
import { setThemeMode } from '@/redux/slices/settings';

// MUI
import { Stack, Tooltip, Typography } from '@mui/material';
import { IoSunny, IoMoonOutline } from 'react-icons/io5';
import { MdLaptopMac } from 'react-icons/md';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { capitalize } from 'lodash';
const modes = [
  { value: 'light', icon: <IoSunny /> },
  { value: 'dark', icon: <IoMoonOutline /> },
  { value: 'system', icon: <MdLaptopMac /> }
];

export default function ThemeMode() {
  const { themeMode } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const handleChange = (event, mode) => {
    if (mode !== null) {
      dispatch(setThemeMode(mode));
    }
  };
  return (
    <div>
      <Typography variant="overline" color="inherit" gutterBottom>
        Theme Mode
      </Typography>

      <Stack direction="row" gap={1}>
        <ToggleButtonGroup
          value={themeMode}
          exclusive
          size="large"
          fullWidth
          onChange={handleChange}
          aria-label="text alignment"
          sx={{ height: 56, svg: { fontSize: 30 } }}
        >
          {modes.map(({ value, icon }) => {
            return (
              <Tooltip title={capitalize(value) + ' Mode'} key={value}>
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
