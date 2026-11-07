import { PageSeo } from 'src/components/seo';
import { FaqsView } from 'src/sections/faqs/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="FAQs"
        description="Find answers to frequently asked questions about Intecomart orders, accounts, shipping, payments, and wholesale purchasing."
        path="/faqs"
      />
      <FaqsView />
    </>
  );
}
