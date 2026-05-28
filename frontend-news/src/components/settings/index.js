'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import { SlSettings } from 'react-icons/sl';
import { Card, Typography, Divider, Box } from '@mui/material';
import ThemeMode from '@/components/settings/theme-mode';
import { CgClose } from 'react-icons/cg';
import CurrencySelect from '@/components/settings/currency';
import DirectionToggle from '@/components/settings/direction';

export default function Settings({ direction }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 320 }} dir={direction}>
      <Stack direction="row" justifyContent={'space-between'} alignItems={'center'} sx={{ p: 2 }}>
        <Typography variant="h5" color="inherit">
          Settings
        </Typography>
        <IconButton aria-label="close" onClick={toggleDrawer(false)}>
          <CgClose />
        </IconButton>
      </Stack>
      <Divider />
      <Stack gap={3} sx={{ mt: 1, p: 2 }}>
        <CurrencySelect />
        <ThemeMode />
        <DirectionToggle />
      </Stack>
    </Box>
  );

  return (
    <Card
      sx={{
        position: 'fixed',
        top: 180,
        right: 0,
        p: 0.5,
        pr: 1.5,
        borderRadius: '27px 0px 0px 27px',
        borderRightWidth: '0!important',
        zIndex: 999
      }}
    >
      <Fab
        name="wishlist"
        color="primary"
        size="small"
        sx={{
          svg: { fontSize: 22, animation: 'spin 4s linear infinite' },
          '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
        }}
        onClick={toggleDrawer(true)}
      >
        <SlSettings />
      </Fab>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </Card>
  );
}
