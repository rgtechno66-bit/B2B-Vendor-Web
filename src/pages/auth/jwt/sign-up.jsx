import { PageSeo } from 'src/components/seo';
import { JwtSignUpView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Sign Up"
        description="Create an Intecomart account to buy industrial products wholesale online."
        path="/auth/jwt/sign-up"
        noIndex
      />
      <JwtSignUpView />
    </>
  );
}
