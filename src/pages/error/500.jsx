import { PageSeo } from 'src/components/seo';
import { View500 } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Server Error"
        description="Something went wrong on Intecomart. Please try again later."
        path="/500"
        noIndex
      />
      <View500 />
    </>
  );
}
