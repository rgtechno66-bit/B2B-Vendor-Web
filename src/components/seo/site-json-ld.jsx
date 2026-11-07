import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

/**
 * Global Organization + WebSite JSON-LD.
 * Helps Google understand brand identity (logo, site name, search).
 * Note: Sitelinks (Amazon-style links under result) are chosen by Google, not forced by code.
 */
export function SiteJsonLd() {
  const siteUrl = CONFIG.site.url.replace(/\/$/, '');
  const logoUrl = `${siteUrl}/favicon/android-chrome-192x192.png`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: CONFIG.site.name,
    alternateName: 'Intecomart Industrial',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      width: 192,
      height: 192,
    },
    image: logoUrl,
    description: CONFIG.site.defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9811068569',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: CONFIG.site.name,
    url: siteUrl,
    description: CONFIG.site.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: CONFIG.site.name,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/product?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  );
}
