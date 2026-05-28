import React from 'react';
import PropTypes from 'prop-types';

// mui
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { Box, Tooltip } from '@mui/material';

// custom hooks
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { useCurrencyConvert } from '@/hooks/use-currency';

CustomizedSlider.propTypes = {
  prices: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

function ValueLabelComponent({ ...props }) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value} size="small">
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired
};

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginTop: 20,
  height: 27,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 27,
    width: 27,
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid currentColor',

    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  '& .MuiSlider-track': {
    height: 27,
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.main
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 27,
    borderRadius: '8px'
  }
}));

function AirbnbThumbComponent({ ...props }) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}
AirbnbThumbComponent.propTypes = {
  children: PropTypes.node
};

export default function CustomizedSlider({ ...props }) {
  const { filterPrices, onChangeCommitted, onChange, value } = props;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();

  return (
    <>
      <Box px={1} mt={1}>
        <AirbnbSlider
          valueLabelDisplay="on"
          onChangeCommitted={onChangeCommitted}
          valueLabelFormat={(x) => fCurrency(x)}
          max={cCurrency(filterPrices[1])}
          components={{ Thumb: AirbnbThumbComponent }}
          value={value}
          onChange={onChange}
          disableSwap
          // marks
        />
      </Box>
    </>
  );
}
