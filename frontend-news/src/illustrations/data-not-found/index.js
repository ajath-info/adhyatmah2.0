'use client';

import PropTypes from 'prop-types';

// mui
import { useTheme } from '@mui/material/styles';
import RootStyled from './styled';

export default function NoDataFoundIllustration({ ...props }) {
  const { sx, ...other } = props;

  useTheme();

  return (
    <RootStyled
      sx={{
        ...sx
      }}
      {...other}
    >
      <img
        src="/upcoming.png"
        alt="Upcoming Illustration"
        style={{
          width: '700px',
          maxWidth: '700px',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }}
      />
    </RootStyled>
  );
}

NoDataFoundIllustration.propTypes = {
  message: PropTypes.string,
  sx: PropTypes.object
};
