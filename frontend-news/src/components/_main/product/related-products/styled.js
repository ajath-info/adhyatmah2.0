'use client';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const RootStyled = styled(Box)(({ theme }) => ({
  '& .heading': {
    textAlign: 'left',
    marginTop: theme.spacing(5)
  },
  '& .description': {
    textTransform: 'capitalize',
    marginBottom: theme.spacing(5),
    textAlign: 'left'
  },
  '& .dialog-wrapper': {
    '& .MuiDialog-paper': {
      width: '100%!important',
      margin: 0,
      border: `1px solid ${theme.palette.divider}!important`
    }
  },
  '& .view-button': {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    svg: {
      transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'rotate(0deg)'
    }
  }
}));
export default RootStyled;
