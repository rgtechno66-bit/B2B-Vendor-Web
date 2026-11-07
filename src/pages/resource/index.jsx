import { PageSeo } from 'src/components/seo';
import { ResourceView } from 'src/sections/resource/view/resourceView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Resources"
        description="Explore Intecomart resources including product galleries, certificates, and industrial reference materials."
        path="/resource"
      />
      <ResourceView />
    </>
  );
}
