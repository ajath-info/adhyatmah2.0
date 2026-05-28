'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';

// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Stack, AppBar, useMediaQuery, Container, Badge } from '@mui/material';
import {
  HiOutlineShoppingCart
} from 'react-icons/hi2';
import { FiUser } from 'react-icons/fi';

// components
import Logo from '@/components/logo';
import WishlistWidget from '@/components/widgets/wishlist';
//import CartWidget from '@/components/widgets/cart';
//import CompareWidget from '@/components/widgets/compare';
import UserSelect from '@/components/select/user-select';
import NavigationMenu from '@/components/_main/navigation-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher'; //Added
import { HiOutlineHeart } from 'react-icons/hi2';

// dynamic import
const MobileBar = dynamic(() => import('@/layout/_main/mobile-bar'));

export default function Navbar({ branding }) {
	
const { checkout } = useSelector(({ product }) => product);
const wishlist = useSelector((state) => state.wishlist.wishlist);
const { user, isAuthenticated } = useSelector(({ user }) => user);
	
  const isMobile = useMediaQuery('(max-width:992px)');
  const [hoverAccount, setHoverAccount] = React.useState(false);
  const [hoverCart, setHoverCart] = React.useState(false);
  const [hoverWishlist, setHoverWishlist] = React.useState(false);
	  
  const cartItemsCount =
  checkout?.cart?.reduce((total, item) => total + item.quantity, 0) || 0;

const wishlistItemsCount = wishlist?.length || 0;
  
  return (
    <>
      <AppBar
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          borderRadius: 0,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          display: { md: 'block', xs: 'none' },
          '& .toolbar': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            px: 3,
            py: 1.5
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className="toolbar">

            {/* Left - Logo */}
            <Stack direction="row" alignItems="center">
              <Logo branding={branding} />
            </Stack>

            {/* Center - Menu */}
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
              <NavigationMenu />
            </Stack>

            {/* Right - Language + Account + Cart */}
<Stack direction="row" alignItems="center" spacing={1.5}>

  {/* Language Switcher */}
  <Stack sx={{
    width: 'auto',
    flex: '0 0 auto', //IMPORTANT
    alignItems: 'center',
    justifyContent: 'center'
  }}
	  >
    <LanguageSwitcher />
  </Stack>

  {/* Wishlist */}
  <Stack
  component="a"
  href="/profile/wishlist"
  alignItems="center"
  justifyContent="center"
  onMouseEnter={() => setHoverWishlist(true)}
  onMouseLeave={() => setHoverWishlist(false)}
  sx={{
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid #F9A34A',
    transition: 'all .2s',
    backgroundColor: hoverWishlist ? '#F9A34A' : 'transparent'
  }}
>
  <Badge
  badgeContent={wishlistItemsCount}
  color="error"
  overlap="circular"
  sx={{
    '& .MuiBadge-badge': {
      fontSize: '0.65rem',
      minWidth: 16,
      height: 16,
      top: -2,
      right: -2
    }
  }}
>
  <HiOutlineHeart
    size={20}
    color={hoverWishlist ? '#fff' : '#F9A34A'}
  />
</Badge>
</Stack> 

  {/* My Account Icon */}
  {!isAuthenticated ? (
    <Stack
  alignItems="center"
  justifyContent="center"
  onMouseEnter={() => setHoverAccount(true)}
  onMouseLeave={() => setHoverAccount(false)}
  sx={{
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid #F9A34A',
    cursor: 'pointer',
    transition: 'all .2s',
    backgroundColor: hoverAccount ? '#F9A34A' : 'transparent'
  }}
  onClick={() => (window.location.href = '/auth/sign-in')}
>
  <FiUser
    size={20}
    color={hoverAccount ? '#fff' : '#F9A34A'}
  />
</Stack>
  ) : (
    <UserSelect />
  )}

  {/* Cart Icon */}
  <Stack
  component="a"
  href="/cart"
  alignItems="center"
  justifyContent="center"
  onMouseEnter={() => setHoverCart(true)}
  onMouseLeave={() => setHoverCart(false)}
  sx={{
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid #F9A34A',
    transition: 'all .2s',
    backgroundColor: hoverCart ? '#F9A34A' : 'transparent'
  }}
>
  <Badge badgeContent={cartItemsCount} color="error">
    <HiOutlineShoppingCart
      size={20}
      color={hoverCart ? '#fff' : '#F9A34A'}
    />
  </Badge>
</Stack>

</Stack>

          </Toolbar>
        </Container>
      </AppBar>

      {isMobile && <MobileBar />}
    </>
  );
}