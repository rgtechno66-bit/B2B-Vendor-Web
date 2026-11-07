import { PageSeo } from 'src/components/seo';
import { DealerView } from 'src/sections/dealer/view/dealer-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Dealers"
        description="Find Intecomart dealers and partners near you. Locate authorized industrial product dealers across India."
        path="/dealer"
      />
      <DealerView />
    </>
  );
}
