import { PageSeo } from 'src/components/seo';
import { SupabaseResetPasswordView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Reset Password"
        description="Reset your Intecomart account password securely."
        path="/auth/jwt/reset-password"
        noIndex
      />
      <SupabaseResetPasswordView />
    </>
  );
}
