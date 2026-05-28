'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
// mui
import { AppBar, Container, Button, Popover, alpha, Stack, Typography } from '@mui/material';
// icons
import { RxDashboard } from 'react-icons/rx';
import { FaAngleDown } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import DesktopMenuList from '@/components/lists/desktop-menu-list';

// ----------------------------------------------------------------------

const navlinks = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Brands', path: '/brands' },
  { title: 'Products', path: '/products' },
  { title: 'Pandits', path: '/shops' },
  { title: 'Reach Us', path: '/contact' }
];

export default function Navbar({ categories }) {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    if (anchorEl) {
      setAnchorEl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        position: 'sticky',
        top: 110,
        zIndex: 999,
        bgcolor: (theme) => theme.palette.primary.main,
        display: { md: 'flex', xs: 'none' },
        pr: '0px!important'
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          sx={{
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClick}
            sx={{
              boxShadow: 'none',
              borderRadius: 0,
              width: 280,
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.1),
              '& .arrow-icon': {
                transition: 'transform 0.3s ease',
                transform: open ? 'rotate(-180deg)' : 'rotate(0deg)'
              }
            }}
            startIcon={<RxDashboard />}
            endIcon={<FaAngleDown size={14} className="arrow-icon" />}
          >
            Categories
          </Button>

          <Stack gap={2} direction="row">
            {navlinks.map((item) => (
              <Typography
                key={item.title}
                variant="subtitle1"
                color="common.white"
                component={Link}
                href={item.path}
                size="large"
                sx={{ textDecoration: 'none' }}
                fontWeight={700}
              >
                {item.title}
              </Typography>
            ))}
          </Stack>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <DesktopMenuList data={categories} onClose={handleClose} />
          </Popover>
        </Stack>
      </Container>
    </AppBar>
  );
}

Navbar.propTypes = {
  categories: PropTypes.array.isRequired
};
