import { PageSeo } from 'src/components/seo';
import { TermsAndConditionView } from 'src/sections/termsandcondition/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Terms and Conditions"
        description="Read Intecomart terms and conditions for using our B2B industrial marketplace, including orders, payments, and user responsibilities."
        path="/terms-and-condition"
      />
      <TermsAndConditionView />
    </>
  );
}
