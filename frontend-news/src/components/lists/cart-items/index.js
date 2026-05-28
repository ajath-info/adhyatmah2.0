import PropTypes from 'prop-types';
// mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Skeleton,
  Stack
} from '@mui/material';
import { IoClose } from 'react-icons/io5';

//components
import RootStyled from './styled';
import Incrementer from '@/components/incrementer';
// hooks
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import BlurImage from '@/components/blur-image';

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  marginRight: theme.spacing(2),
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden'
}));

// ----------------------------------------------------------------------

export default function CartItemsList({ ...props }) {
  const { onDelete, onIncreaseQuantity, onDecreaseQuantity, isLoading, cart } = props;

  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();
  return (
    <RootStyled>
      <Table>
        <TableHead>
          <TableRow className="table-head-row">
            <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : 'Product'}</TableCell>
            <TableCell align="center">
              {isLoading ? <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} /> : 'Type'}
            </TableCell>
            <TableCell align="center">
              {isLoading ? <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} /> : 'Price'}
            </TableCell>

            <TableCell align="center">
              {isLoading ? <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} /> : 'Quantity'}
            </TableCell>

            <TableCell align="center">
              {isLoading ? <Skeleton variant="text" width={63} sx={{ mx: 'auto' }} /> : 'Total Price'}
            </TableCell>
            <TableCell align="right">
              {isLoading ? <Skeleton variant="text" width={44} sx={{ ml: 'auto' }} /> : 'Action'}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cart.map((product) => {
            const {
              sku,
              name,
              type,
              variantName,
              variant,
              quantity,
              price,
              salePrice,
              image,
              deliveryType,
              stockQuantity
            } = product;

            return (
              <TableRow key={Math.random()}>
                <TableCell>
                  <Box className="product-sec">
                    {isLoading ? (
                      <Skeleton variant="rounded" width={56} height={56} sx={{ mr: 2 }} />
                    ) : (
                      <ThumbImgStyle>
                        <BlurImage priority fill alt="product image" src={image} />
                      </ThumbImgStyle>
                    )}
                    <Box>
                      <Typography
                        noWrap
                        variant="subtitle1"
                        className="subtitle"
                        lineHeight={1}
                        mb={0 + '!important'}
                        paddingY={0.7}
                      >
                        {isLoading ? <Skeleton variant="text" width={150} /> : name}
                      </Typography>

                      <Stack direction="row" gap={2}>
                        {isLoading ? (
                          <Skeleton variant="text" width={120} />
                        ) : type === 'simple' ? null : (
                          variantName.split('/').map((item, i) => (
                            <Typography key={item} variant="body2" sx={{ span: { textTransform: 'uppercase' } }}>
                              <b>{item}:</b> <span>{variant.split('/')[i]}</span>
                            </Typography>
                          ))
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {isLoading ? (
                    <Skeleton variant="text" width={52} sx={{ mx: 'auto' }} />
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.primary"
                      fontWeight={600}
                      sx={{
                        textTransform: 'capitalize'
                      }}
                    >
                      {deliveryType}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {isLoading ? (
                    <Skeleton variant="text" width={52} sx={{ mx: 'auto' }} />
                  ) : (
                    <Typography variant="body1" color="text.primary" fontWeight={600}>
                      {fCurrency(cCurrency(salePrice || price))}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    '& > div': {
                      mx: 'auto'
                    }
                  }}
                >
                  {isLoading ? (
                    <Stack width={96} sx={{ mx: 'auto' }}>
                      <Skeleton variant="rounded" width={96} height={36} />
                      <Skeleton variant="rounded" width={40} height={12} sx={{ ml: 'auto', mt: 0.5 }} />
                    </Stack>
                  ) : deliveryType === 'digital' ? (
                    '-'
                  ) : (
                    <Incrementer
                      cart
                      quantity={quantity}
                      stockQuantity={stockQuantity}
                      onDecrease={() => onDecreaseQuantity(sku)}
                      onIncrease={() => onIncreaseQuantity(sku)}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {isLoading ? (
                    <Skeleton variant="text" width={52} sx={{ mx: 'auto' }} />
                  ) : (
                    <Typography variant="body1" color="text.primary" fontWeight={600}>
                      {fCurrency(cCurrency(quantity * (salePrice || price)))}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} sx={{ ml: 'auto' }} />
                  ) : (
                    <IconButton aria-label="delete" color="inherit" onClick={() => onDelete(sku)} size="small">
                      <IoClose size={24} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </RootStyled>
  );
}
CartItemsList.propTypes = {
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
  isLoading: PropTypes.bool,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      sku: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      stockQuantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      salePrice: PropTypes.number,
      image: PropTypes.string.isRequired
    })
  )
};
