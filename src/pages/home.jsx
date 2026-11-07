import { PageSeo } from 'src/components/seo';
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="B2B Industrial Marketplace"
        description="Shop industrial and wholesale products on Intecomart. Connect with trusted suppliers, browse categories, and streamline B2B procurement online."
        path="/"
      />
      <HomeView />
    </>
  );
}
