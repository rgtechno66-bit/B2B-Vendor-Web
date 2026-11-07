import { PageSeo } from 'src/components/seo';
import { AboutView } from 'src/sections/about/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="About Us"
        description="Learn about Intecomart — a trusted B2B industrial marketplace connecting buyers with quality suppliers across diverse product categories."
        path="/about-us"
      />
      <AboutView />
    </>
  );
}
