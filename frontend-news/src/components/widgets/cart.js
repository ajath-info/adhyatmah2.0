import Link from 'next/link';
import PropTypes from 'prop-types';
import { sum } from 'lodash';
import { useSelector } from 'react-redux';

// mui
import { IconButton, Stack, Typography, alpha } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// custom hooks
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
export default function CartWidget() {
  const {
    checkout: { cart }
  } = useSelector(({ product }) => product);

  const totalItems = sum(cart?.map((item) => item.quantity));
  const subtotal = sum(cart?.map((product) => (product.salePrice || product.price) * product.quantity));
  const total = subtotal;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();
  return (
    <Stack
      component={Link}
      href="/cart"
      direction="row"
      spacing={1}
      alignItems="center"
      width="auto"
      sx={{
        cursor: 'pointer',
        '&:hover': {
          button: {
            bgcolor: 'primary.main',
            color: 'white',
            borderColor: 'primary.main'
          }
        }
      }}
    >
      <IconButton
        name="cart"
        disableRipple
        color="primary"
        sx={{
          outlineWidth: 1,
          outlineColor: 'primary',
          outlineStyle: 'solid',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <HiOutlineShoppingBag />
      </IconButton>
      <Stack gap={0.5}>
        <Typography lineHeight={1} variant="subtitle2" color="text.primary">
          Cart ({totalItems})
        </Typography>
        <Typography lineHeight={1} variant="body1" color="text.secondary">
          {fCurrency(cCurrency(total))}
        </Typography>
      </Stack>
    </Stack>
  );
}
CartWidget.propTypes = {
  checkout: PropTypes.object.isRequired
};
