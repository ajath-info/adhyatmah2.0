// mui
import PropTypes from 'prop-types';
// styled
import RootStyled from './styled';
import { useTheme } from '@mui/material';

Popover.propTypes = {
  open: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  isDesktop: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

// ----------------------------------------------------------------------
export default function Popover({ ...props }) {
  const theme = useTheme();

  const { children, open, sx, isDesktop, ...other } = props;
  return (
    <RootStyled
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: isDesktop ? 'center' : 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: isDesktop ? 'center' : 'right'
      }}
      open={open}
      {...other}
      PaperProps={{
        className: isDesktop && 'is-desktop',
        sx: {
          ...sx,
          border: `1px solid ${theme.palette.divider}`
        }
      }}
    >
      {children}
    </RootStyled>
  );
}
