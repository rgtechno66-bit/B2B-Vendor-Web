import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';
import { SplashScreen } from 'src/components/loading-screen';

const FaqsPage = lazy(() => import('src/pages/faqs'));
const ExternalRedirect = lazy(() => import('src/pages/redirect'));

const AboutPage = lazy(() => import('src/pages/about-us'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
const DealerPage = lazy(() => import('src/pages/dealer'));
const ResourcePage = lazy(() => import('src/pages/resource'));
const GalleryPage = lazy(() => import('src/pages/resource/gallery'));
const CertificatePage = lazy(() => import('src/pages/resource/certificate'));
const TermsPage = lazy(() => import('src/pages/termsandcondition'));
const PrivacyPage = lazy(() => import('src/pages/privacypolicy'));

// Product
const ProductListPage = lazy(() => import('src/pages/product/list'));
const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));
const ProductCheckoutFormPage = lazy(() => import('src/pages/product/checkoutForm'));
// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));


export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          {
            path: 'about-us',
            element: <AboutPage />,
          },
          {
            path: 'contact-us',
            element: <ContactPage />,
          },

          {
            path: 'dealer',
            element: <DealerPage />,
          },

          {
            path: 'resource',
            element: <ResourcePage />,
          },
          {
            path: 'gallery',
            element: <GalleryPage />,
          },

          {
            path: 'certificate',
            element: <CertificatePage />,
          },

          {
            path: 'terms-and-condition',
            element: <TermsPage />,
          },
          {
            path: 'privacy-policy',
            element: <PrivacyPage />,
          },
          {
            path: 'faqs',
            element: <FaqsPage />,
          },

          {
            path: 'redirect',
            element: <ExternalRedirect url="https://admin.intecomart.com" />,
          },

          {
            path: 'product',
            children: [
              { element: <ProductListPage />, index: true },
              { path: 'list', element: <ProductListPage /> },
              { path: ':id', element: <ProductDetailsPage /> },
              { path: 'checkout', element: <ProductCheckoutPage /> },
              { path: 'form', element: <ProductCheckoutFormPage /> },
            ],
          },
        ],
      },

      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
