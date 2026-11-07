import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CheckoutCart } from '../checkout-cart';
import { useCheckoutContext } from '../context';
import { CheckoutOrderComplete } from '../checkout-order-complete';
import { FormView, OrderAndAddressView } from '../form/view';

// ----------------------------------------------------------------------

export function CheckoutView() {
  const checkout = useCheckoutContext();

  useEffect(() => {
    checkout.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Checkout
      </Typography>

      <div>

        {checkout.activeStep === 0 && <CheckoutCart />}
        {checkout.activeStep === 1 && <FormView />}
        {checkout.activeStep === 2 && <OrderAndAddressView />}
        {checkout.activeStep === 3 && <CheckoutOrderComplete open onReset={checkout.onReset} onDownloadPDF={() => { }} />}

        {checkout.completed && (
          <CheckoutOrderComplete open onReset={checkout.onReset} onDownloadPDF={() => { }} />
        )}
      </div>
    </Container>
  );
}
