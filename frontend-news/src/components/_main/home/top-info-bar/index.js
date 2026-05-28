'use client';
import { Box, Typography } from '@mui/material';

export default function TopInfoBar() {
  return (
    <Box
      sx={{
        bgcolor: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)',
        textAlign: 'center',
        py: 1.2,
        fontSize: 14,
        borderBottom: '1px solid rgba(249, 163, 74, 0.1)',
        boxShadow: '0 2px 4px rgba(249, 163, 74, 0.05)',
        position: 'sticky',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #F9A34A 0%, #FFB74D 50%, #F9A34A 100%)'
        }
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#8D6E63',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>⚡</span>
        <span>Wants to Explore Upcoming Deals on Weekends?</span>
      </Typography>
    </Box>
  );
}
