import Link from 'next/link';
import PropTypes from 'prop-types';

// mui
import { Box, useTheme } from '@mui/material';
import Image from 'next/image';

const Logo = ({ branding }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  // src={isDarkMode?darkekt:}
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Box sx={{ position: 'relative', width: 150, height: 60 }}>
        <Image
          src={
            isDarkMode
              ? branding?.logoDark?.url || '/fallback-dark.png'
              : branding?.logoLight?.url || '/fallback-light.png'
          }
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          draggable="false"
        />
      </Box>
    </Link>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool
};
export default Logo;
