import { PageSeo } from 'src/components/seo';
import { JwtSignInView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Sign In"
        description="Sign in to your Intecomart account to manage orders and wholesale purchases."
        path="/auth/jwt/sign-in"
        noIndex
      />
      <JwtSignInView />
    </>
  );
}
