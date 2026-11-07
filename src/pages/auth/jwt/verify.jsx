import { PageSeo } from 'src/components/seo';
import { SupabaseVerifyView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Verify Account"
        description="Verify your Intecomart account to continue."
        path="/auth/jwt/verify"
        noIndex
      />
      <SupabaseVerifyView />
    </>
  );
}
