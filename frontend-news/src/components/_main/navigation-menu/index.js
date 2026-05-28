'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// MUI
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';

import { FiMenu } from 'react-icons/fi';

// Theme
import { useTheme } from '@mui/material/styles';

/* ---------------- DATA ---------------- */

const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Pandit Ji', href: '/book-pandit-online' },
  { label: 'Products', href: '/puja-products-online-store' },
  { label: 'Services', href: '/online-puja-services' }, 
  { label: 'Brands', href: '/puja-product-brands-online' },
  { label: 'Reach Us', href: '/contact-us' }
];

/* ---------------- COMPONENT ---------------- */

export default function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const navigate = (href) => {
    router.push(href);
    setMobileOpen(false);
  };

  /* ---------------- MOBILE DRAWER ---------------- */

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={toggleMobile}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={800}>
          Menu
        </Typography>
      </Box>

      <List disablePadding>
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.href)}
                sx={{
                  py: 1.75,
                  px: 3,
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: 1,
                  bgcolor: isActive ? '#fb8b05' : 'transparent',
                  color: isActive ? '#ffffff' : 'text.primary',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: '#fb8b05',
                    color: '#ffffff'
                  }
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 800 : 600,
                    color: 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );

  /* ---------------- DESKTOP MENU ---------------- */

  const DesktopNavigation = () => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              px: 2.5,
              py: 1.5,
              fontSize: '14px',
              fontWeight: isActive ? 800 : 600,
              letterSpacing: '1.2px',
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              color: isActive ? '#ffffff' : 'text.primary',
              zIndex: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: '#fb8b05',
                borderRadius: 8,
                transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.35s ease',
                zIndex: -1
              },
              '&:hover::before': {
                transform: 'translateX(0)'
              },
              '&:hover': {
                color: '#ffffff'
              }
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );

  /* ---------------- RENDER ---------------- */

  return (
    <>
      {isMobile && (
        <IconButton onClick={toggleMobile}>
          <FiMenu size={20} />
        </IconButton>
      )}

      {!isMobile && <DesktopNavigation />}

      {isMobile && <MobileDrawer />}
    </>
  );
}