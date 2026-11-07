import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderAndAddressView } from 'src/sections/checkout/form/view';


// ----------------------------------------------------------------------

const metadata = { title: `CheckoutForm - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <div>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderAndAddressView />
    </div>
  );
}
