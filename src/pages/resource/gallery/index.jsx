import { PageSeo } from 'src/components/seo';
import { Gallery } from 'src/sections/resource/gallery/galleryView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Gallery"
        description="Browse the Intecomart product and company gallery — industrial solutions, facilities, and product showcases."
        path="/gallery"
      />
      <Gallery />
    </>
  );
}
