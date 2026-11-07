import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';

import { fCurrency } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';
import {
  getProductDisplayImage,
  handleProductImageError,
} from 'src/utils/product-image';
import { useCheckoutContext } from '../checkout/context';

const cardSx = {
  width: '100%',
  border: '2px solid #FF6600',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    border: '3px solid #FF6600',
    '& .add-cart-btn': { opacity: 1 },
  },
};

const imageBoxSx = {
  width: '100%',
  height: { xs: 110, sm: 125, md: 135 },
  minHeight: { xs: 110, sm: 125, md: 135 },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  bgcolor: '#fff',
  position: 'relative',
  p: 0.75,
};

export function ProductItem({ product }) {
  const navigate = useNavigate();
  const checkout = useCheckoutContext();

  const {
    id,
    itemName,
    productImages,
    stdPkg,
    sellingPrice,
    description,
    group,
    subGroup1,
  } = product;

  const available = 5;
  const categoryLabel = group || subGroup1 || 'INTECO ITEMS';
  const safeDescription = description || '';
  const limitedDescription =
    safeDescription.length > 50
      ? `${safeDescription.slice(0, 50)}...`
      : safeDescription || 'Description Not Available';

  const handleAddCart = (event) => {
    event.stopPropagation();

    try {
      checkout.onAddToCart({
        id,
        itemName,
        productImages,
        stdPkg,
        available,
        sellingPrice,
        quantity: 1,
        noOfPkg: 1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={cardSx} onClick={() => navigate(`/product/${id}`)}>
      <Box sx={imageBoxSx}>
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 12,
            bottom: 12,
            zIndex: 10,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('opacity', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>

        <Box
          component="img"
          src={getProductDisplayImage(productImages)}
          alt={itemName || 'Product'}
          onError={handleProductImageError}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            ...(!available && { opacity: 0.8, filter: 'grayscale(1)' }),
          }}
        />
      </Box>

      <Divider />

      <CardContent
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0.25,
          width: '100%',
          textAlign: 'left',
          p: { xs: 1, sm: 1.25 },
          '&:last-child': { pb: { xs: 1, sm: 1.25 } },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            width: '100%',
            fontWeight: 700,
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: { xs: '0.75rem', sm: '0.82rem', md: '0.875rem' },
            lineHeight: 1.3,
          }}
        >
          {itemName || 'Item Name Not Available'}
        </Typography>

        <Typography
          sx={{
            width: '100%',
            textAlign: 'left',
            fontSize: '11px',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {categoryLabel}
        </Typography>

        <Typography
          sx={{
            width: '100%',
            textAlign: 'left',
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {sellingPrice ? fCurrency(sellingPrice) : 'Price Not Available'}
        </Typography>

        <Typography
          sx={{
            width: '100%',
            textAlign: 'left',
            fontSize: '11px',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {limitedDescription}
        </Typography>
      </CardContent>
    </Card>
  );
}
