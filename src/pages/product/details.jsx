import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';

import { useParams } from 'src/routes/hooks';
import { PageSeo } from 'src/components/seo';
import { CONFIG } from 'src/config-global';
import { ProductShopDetailsView } from 'src/sections/product/view';
import { ProductDetailsSkeleton } from 'src/sections/product/product-skeleton';
import {
  fetchProductsFailure,
  fetchProductsStart,
  fetchProductsSuccess,
} from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi';

// ----------------------------------------------------------------------

function stripHtml(html = '') {
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function Page() {
  const { id = '' } = useParams();
  const dispatch = useDispatch();

  const ProductData = useSelector((state) => state.product.items.data) || [];
  const ProductLoading = useSelector((state) => state.product.loading);
  const product = ProductData.find((item) => item.id === id) || null;

  useEffect(() => {
    const getProducts = async () => {
      dispatch(fetchProductsStart());
      try {
        const data = await fetchItems();
        dispatch(fetchProductsSuccess(data));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
      }
    };

    if (ProductData.length === 0) {
      getProducts();
    }
  }, [ProductData.length, dispatch]);

  const seo = useMemo(() => {
    const name = product?.itemName?.trim() || 'Product details';
    const rawDesc = stripHtml(product?.description || '');
    const description =
      rawDesc.slice(0, 155) ||
      `Buy ${name} on Intecomart. View specs, pricing, and request a quote from trusted industrial suppliers.`;
    const image =
      (Array.isArray(product?.productImages) && product.productImages[0]) ||
      product?.productImages ||
      CONFIG.site.ogImage;
    let imageUrl = typeof image === 'string' ? image : CONFIG.site.ogImage;
    // WhatsApp needs absolute image URL
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${CONFIG.site.url.replace(/\/$/, '')}${imageUrl}`;
    }
    const price = product?.salePrice || product?.price || product?.mrp;

    const jsonLd = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name,
          description: rawDesc || description,
          image: imageUrl,
          sku: product?.itemCode || product?.id || id,
          brand: {
            '@type': 'Brand',
            name: CONFIG.site.name,
          },
          offers: {
            '@type': 'Offer',
            url: `${CONFIG.site.url}/product/${id}`,
            priceCurrency: 'INR',
            ...(price ? { price: String(price) } : {}),
            availability: 'https://schema.org/InStock',
          },
        }
      : null;

    return {
      title: name,
      description,
      image: imageUrl,
      path: `/product/${id}`,
      price,
      jsonLd,
    };
  }, [product, id]);

  if (ProductLoading) {
    return (
      <>
        <PageSeo
          title="Product details"
          description="Loading product details on Intecomart."
          path={`/product/${id}`}
        />
        <Container sx={{ mt: 5, mb: 10 }}>
          <ProductDetailsSkeleton />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={seo.image}
        type="product"
        price={seo.price}
        jsonLd={seo.jsonLd}
      />
      <ProductShopDetailsView product={product} />
    </>
  );
}
