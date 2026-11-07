import { PageSeo } from 'src/components/seo';
import { CheckoutView } from 'src/sections/checkout/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Checkout"
        description="Review your Intecomart cart and complete your wholesale order checkout."
        path="/product/checkout"
        noIndex
      />
      <CheckoutView />
    </>
  );
}
