import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

export const navData = [
  {
    title: 'Home',
    path: '/',
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />
  },
  {
    title: 'Products',
    path: paths.product.root, // Main shop or product listing page
    icon: <Iconify width={22} icon="solar:bag-bold-duotone" />,
  },
  {
    title: 'About Us',
    path: paths.about, // About us page
    icon: <Iconify width={22} icon="solar:info-circle-bold-duotone" />,
  },
  {
    title: 'Dealer',
    path: paths.dealer, // Frequently Asked Questions
    icon: <Iconify width={22} icon="solar:question-circle-bold-duotone" />,
  },

  {
    title: 'Resources',
    path: paths.resource, // Frequently Asked Questions
    icon: <Iconify width={22} icon="solar:question-circle-bold-duotone" />,
  },

  {
    title: 'Contact Us',
    path: paths.contact, // Contact page for customer support
    icon: <Iconify width={22} icon="solar:phone-bold-duotone" />,
  },
  {
    title: 'FAQs',
    path: paths.faqs, // Frequently Asked Questions
    icon: <Iconify width={22} icon="solar:question-circle-bold-duotone" />,
  },

  // {
  //   title: 'Login',
  //   path: 'redirect', // Special key for external links
  //   icon: <Iconify width={22} icon="solar:question-circle-bold-duotone" />,
  // },
];
