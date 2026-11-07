import { PageSeo } from 'src/components/seo';
import { ResourceView } from 'src/sections/resource/view/resourceView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Certificates"
        description="View Intecomart quality certifications and compliance documents for industrial products and manufacturing standards."
        path="/certificate"
      />
      <ResourceView />
    </>
  );
}
