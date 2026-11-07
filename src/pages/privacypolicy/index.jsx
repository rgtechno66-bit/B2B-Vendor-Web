import { PageSeo } from 'src/components/seo';
import { PrivacyPolicyView } from 'src/sections/privacypolicy/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Privacy Policy"
        description="Intecomart privacy policy explains how we collect, use, and protect your personal and business data on our B2B platform."
        path="/privacy-policy"
      />
      <PrivacyPolicyView />
    </>
  );
}
