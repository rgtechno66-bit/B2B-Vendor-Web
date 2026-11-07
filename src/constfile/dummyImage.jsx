/** Same default image used on product listing cards */
export const DUMMY_IMAGE =
  'https://t3.ftcdn.net/jpg/11/79/00/94/360_F_1179009439_5O7EUu8F9vs26WdmcQsRBC0ZfvnIKBOe.jpg';

/** Local backup if remote dummy fails to load */
export const DUMMY_IMAGE_FALLBACK = '/assets/default/product-placeholder.png';

export const BANNER_DUMMY_IMAGE =
  'https://media.istockphoto.com/id/1348157796/vector/website-under-construction-page-web-page-under-construction-website-under-maintenance-page.jpg?s=612x612&w=0&k=20&c=vJCWlc0t7pZY3b41LciyKsXQAtcDlMqzq2M7zOsl5rI=';

export const DEFAULT_BANNER_PLACEHOLDER_PATH = '/assets/default/banner-1.webp';

/** Default Home carousel slides — shown when no Home banner is set in admin (files in public/assets/default/home/) */
export const DEFAULT_HOME_BANNER_IMAGES = Array.from(
  { length: 9 },
  (_, i) => `/assets/default/home/home-banner-${i + 1}.webp`
);
export const DEFAULT_ABOUT_IMAGE = '/assets/default/about-us-1.webp';
export const DEFAULT_DEALER_IMAGE = '/assets/default/dealer.webp';
export const DEFAULT_RESOURCE_IMAGE = '/assets/default/resource.webp';
export const DEFAULT_CONTACT_IMAGE = '/assets/default/contact.webp';
export const DEFAULT_FAQS_IMAGE = '/assets/default/faqs.webp';
