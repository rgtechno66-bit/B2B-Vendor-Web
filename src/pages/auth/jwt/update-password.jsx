import { PageSeo } from 'src/components/seo';
import { SupabaseUpdatePasswordView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Update Password"
        description="Update your Intecomart account password."
        path="/auth/jwt/update-password"
        noIndex
      />
      <SupabaseUpdatePasswordView />
    </>
  );
}
