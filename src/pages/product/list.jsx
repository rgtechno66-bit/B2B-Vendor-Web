import { Divider } from '@mui/material';

import { PageSeo } from 'src/components/seo';
import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <PageSeo
        title="Products"
        description="Browse Intecomart industrial and wholesale products. Filter by category, search items, and request quotes from verified suppliers."
        path="/product"
      />
      <Divider />
      <ProductShopView />
    </>
  );
}
