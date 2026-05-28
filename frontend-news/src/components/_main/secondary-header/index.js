'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Box, Button, Stack, useMediaQuery, Popover, alpha } from '@mui/material';

// icons
import { RxDashboard } from 'react-icons/rx';
import { FaAngleDown } from 'react-icons/fa6';

// components
import SearchEnhanced from '@/components/widgets/search-enhanced';
import NestedList from '@/components/lists/desktop-menu-list';

// Theme
import { useTheme } from '@mui/material/styles';

export default function SecondaryHeader({ categories = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /* ---------------- ActionBar Category Button ---------------- */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ top: { xs: 56, md: 64 }, zIndex: 998 }}>
      <Box
        sx={{
          maxWidth: '1383px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}
      >
        {/* 🔥 ActionBar Categories Button */}
        {!isMobile && (
          <>
            <Stack>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleClick}
                sx={{
                  boxShadow: 'none',
                  borderRadius: 6,
                  width: 280,
                  bgcolor: (theme) => theme.palette.primary.main,
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
                <NestedList data={categories} onClose={handleClose} />
              </Popover>
            </Stack>
          </>
        )}

        {/* 🔍 Search (same as before) */}
        <Box sx={{ flex: 1, ml: isMobile ? 0 : 5 }}>
          <SearchEnhanced />
        </Box>

        <Box sx={{ minWidth: 160, display: { xs: 'none', md: 'block' } }} />
      </Box>
    </Box>
  );
}

SecondaryHeader.propTypes = {
  categories: PropTypes.array.isRequired
};
