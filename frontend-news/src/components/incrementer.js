// mui
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// mui
import { Typography, Stack, IconButton } from '@mui/material';

// icons
import { IoIosRemove } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

const IncrementerStyle = styled('div')(({ theme }) => ({
  border: '1px solid ' + theme.palette.divider,
  borderRadius: 27,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  svg: {
    fontSize: 22
  }
}));

function Incrementer({ ...props }) {
  const { stockQuantity, quantity, onIncrease, onDecrease, cart } = props;

  return (
    <Stack gap={0.5}>
      <IncrementerStyle
        sx={{
          gap: cart ? 0.5 : 1,
          p: cart ? 0.2 : 0.5
        }}
      >
        <IconButton size="small" color="primary" onClick={onDecrease} disabled={quantity <= 1}>
          <IoIosRemove />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary">
          {quantity}
        </Typography>

        <IconButton size="small" color="primary" onClick={onIncrease} disabled={quantity >= stockQuantity}>
          <IoIosAdd />
        </IconButton>
      </IncrementerStyle>
      {cart && (
        <Typography variant="caption" color="text.secondary">
          Available: {stockQuantity}
        </Typography>
      )}
    </Stack>
  );
}

export default Incrementer;
Incrementer.propTypes = {
  stockQuantity: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired
};
