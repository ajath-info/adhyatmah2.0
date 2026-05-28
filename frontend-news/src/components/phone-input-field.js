import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Box, Typography } from '@mui/material';

function PhoneInputField({ ...props }) {
  const { value, onChange, error } = props;
  const [focus, setFocus] = React.useState(false);
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        '& .phone-input': {
          p: '0!important',
          width: '100%',
          height: '56px', // MUI TextField default height
          borderRadius: '8px', // MUI TextField default border radius
          bgcolor: 'background.paper',
          fontSize: '16px',
          outline: 'none',
          border: (theme) =>
            focus
              ? '1px solid ' + theme.palette.primary.main
              : error
                ? '1px solid ' + theme.palette.error.main
                : '1px solid ' + theme.palette.divider,
          ...(focus && {
            outline: (theme) => '1px solid ' + theme.palette.primary.main
          }),
          '&:hover': {
            border: (theme) =>
              focus
                ? '1px solid ' + theme.palette.primary.main
                : error
                  ? '1px solid ' + theme.palette.error.main
                  : '1px solid ' + theme.palette.divider
          }
        },
        input: {
          fontSize: 16,
          color: 'text.primary',
          bgcolor: 'background.paper',
          p: '16.5px 8px !important',
          borderRadius: '0px 4px 4px 0px',
          borderWidth: '0!important',
          '&:focus': {
            outline: '0!important'
          }
        },
        '& .PhoneInputCountry': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          bgcolor: 'background.paper',
          borderRadius: '8px 0 0 8px',
          borderRight: (theme) =>
            focus ? '1px solid ' + theme.palette.primary.main : '1px solid ' + theme.palette.divider,
          pl: '8px',
          '& .PhoneInputCountryIcon': {
            ml: '-8px',
            fontSize: 14
          },
          '& .PhoneInputCountrySelectArrow': {
            width: 8,
            height: 8,
            borderBottom: (theme) => '1.5px solid ' + theme.palette.text.primary,
            borderRight: (theme) => '1.5px solid ' + theme.palette.text.primary,
            marginLeft: '8px',
            marginBottom: '4px'
          }
        }
      }}
    >
      <PhoneInput
        international
        defaultCountry="IN"
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={`phone-input ${error ? 'error' : ''}`}
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: '8px', fontSize: '0.625rem', ml: '14px' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default PhoneInputField;
