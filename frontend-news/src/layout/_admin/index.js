'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'src/redux';
import { toggleSidebar } from 'src/redux/slices/settings';

// mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// components
import DashboardAppbar from './topbar';
import DashboardSidebar from './sidebar';
import { useSelector } from 'react-redux';

// styles
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function MiniDrawer({ children, branding }) {
  const { openSidebar } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardAppbar branding={branding} open={openSidebar} handleDrawerToggle={handleDrawerToggle} />

      <DashboardSidebar handleDrawerToggle={handleDrawerToggle} open={openSidebar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative', overflow: 'hidden' }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
MiniDrawer.propTypes = {
  children: PropTypes.node.isRequired
};
