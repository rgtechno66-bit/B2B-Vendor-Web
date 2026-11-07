import { PageSeo } from 'src/components/seo';
import { ContactView } from 'src/sections/contact/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Contact Us"
        description="Contact Intecomart for product inquiries, support, or partnership. Reach our Noida team by phone, email, or WhatsApp."
        path="/contact-us"
      />
      <ContactView />
    </>
  );
}
