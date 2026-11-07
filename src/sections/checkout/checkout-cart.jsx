import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutCartProductList } from './checkout-cart-product-list';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const checkout = useCheckoutContext();

  // Calculate the subtotal by summing the selling price * quantity for each item
  const subtotal = checkout.items.reduce((total, item) => {
    const quantity = item.stdPkg * item.noOfPkg;
    const itemTotal = parseFloat(item.sellingPrice) * quantity;
    return total + itemTotal;
  }, 0);

  // Calculate total only if discount is applied
  const total = checkout.discount && checkout.discount > 0 ? subtotal - checkout.discount : subtotal;

  const empty = !checkout.items.length;

  const handleCheckout = () => {
    // Validate that cart has items before proceeding
    if (empty) {
      return;
    }
    
    // Only allow next step if cart has items
    if (checkout.items.length > 0) {
      checkout.onNextStep();
    }
  };

  return (
    <Grid container spacing={3}>
      <Button
        component={RouterLink}
        href={paths.product.root}
        color="inherit"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
      >
        Continue shopping
      </Button>
      
      <Grid xs={12} md={12}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.items.length} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-cart.svg`}
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>
      </Grid>

      <Grid xs={12} md={12}>
        <CheckoutSummary
          total={total}
          discount={checkout.discount}
          subtotal={subtotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button 
            sx={{
              backgroundColor: 'var(--primary-color-3)',
              color: '#fff',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
            size="large"
            type="submit"
            variant="contained"
            disabled={empty}
            onClick={handleCheckout}
          >
            Check out
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
