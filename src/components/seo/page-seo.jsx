import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

/**
 * Sets page <title>, meta description, Open Graph, Twitter, and canonical.
 * WhatsApp / Telegram / Facebook read og:* tags for link previews.
 */
export function PageSeo({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  type = 'website',
  jsonLd,
  price,
  currency = 'INR',
}) {
  const siteName = CONFIG.site.name;
  const siteUrl = CONFIG.site.url;
  const fullTitle = title?.includes(siteName) ? title : `${title} | ${siteName}`;
  const metaDescription = (description || CONFIG.site.defaultDescription).slice(0, 160);
  const canonicalUrl = path.startsWith('http')
    ? path
    : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image || CONFIG.site.ogImage;
  const isProduct = type === 'product' || type === 'og:product';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph — used by WhatsApp / Facebook link preview */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={isProduct ? 'product' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {isProduct && price != null && price !== '' && (
        <>
          <meta property="product:price:amount" content={String(price)} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

PageSeo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  noIndex: PropTypes.bool,
  type: PropTypes.string,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
};
