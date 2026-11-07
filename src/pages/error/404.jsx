import { PageSeo } from 'src/components/seo';
import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Page Not Found"
        description="The page you are looking for does not exist on Intecomart."
        path="/404"
        noIndex
      />
      <NotFoundView />
    </>
  );
}
