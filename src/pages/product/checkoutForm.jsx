import { PageSeo } from 'src/components/seo';
import { FormView } from 'src/sections/checkout/form/view/form-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Order Form"
        description="Complete your Intecomart order details and delivery information."
        path="/product/form"
        noIndex
      />
      <FormView />
    </>
  );
}
