import { DUMMY_IMAGE, DUMMY_IMAGE_FALLBACK } from 'src/constfile/dummyImage';
import { CONFIG } from 'src/config-global';

export const toAbsoluteUploadUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  const trimmed = url.trim();
  if (!trimmed.startsWith('/uploads/')) return trimmed;

  // Local Vite proxies /uploads to the backend
  if (import.meta.env.DEV) return trimmed;

  const base = (CONFIG.site.serverUrl || '').replace(/\/$/, '');
  if (!base || base === '/api') return trimmed;
  return `${base}${trimmed}`;
};

const PLACEHOLDER_IMAGE_MARKERS = [
  '1179009439',
  'ftcdn.net/jpg/11/79/00/94',
  'unsplash.com/premium_photo-1664474619075',
  'no-image',
  'noimage',
  'placeholder',
  'dummy-image',
  '/assets/default/product-placeholder',
];

/** True when URL is empty or a known placeholder (not a real product photo). */
export const isPlaceholderProductImage = (url) => {
  if (!url || typeof url !== 'string') return true;

  const normalized = url.trim().toLowerCase();
  if (!normalized) return true;

  return PLACEHOLDER_IMAGE_MARKERS.some((marker) =>
    normalized.includes(String(marker).trim().toLowerCase())
  );
};

/** Single URL → real image or listing default dummy. */
export const resolveProductImageUrl = (url) =>
  isPlaceholderProductImage(url) ? DUMMY_IMAGE : toAbsoluteUploadUrl(url);

/** First real main image from product images array (always returns a usable URL). */
export const getFirstRealProductImage = (images) => {
  if (!Array.isArray(images) || images.length === 0) return DUMMY_IMAGE;
  const real = images.find((img) => !isPlaceholderProductImage(img));
  return real ? toAbsoluteUploadUrl(real) : DUMMY_IMAGE;
};

/** Alias used across product cards / lists. */
export const getProductDisplayImage = (images) => getFirstRealProductImage(images);

/** All real images; fallback to [DUMMY_IMAGE] when none. */
export const getProductDisplayImages = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return [DUMMY_IMAGE];
  const realImages = images
    .filter((img) => !isPlaceholderProductImage(img))
    .map((img) => toAbsoluteUploadUrl(img));
  return realImages.length > 0 ? realImages : [DUMMY_IMAGE];
};

/** Real images only; fallback to dummy when category has none. */
export const getCategoryDisplayImages = (images = []) => getProductDisplayImages(images);

/**
 * img onError → listing dummy first; if that also fails → local fallback.
 */
export const handleProductImageError = (event) => {
  if (!event?.currentTarget) return;
  const img = event.currentTarget;
  const current = img.src || '';

  if (img.dataset.fallbackApplied === '2') return;

  if (img.dataset.fallbackApplied !== '1') {
    img.dataset.fallbackApplied = '1';
    // Prefer same dummy as product listing
    if (!current.includes('1179009439') && !current.includes('product-placeholder')) {
      img.src = DUMMY_IMAGE;
      return;
    }
  }

  img.dataset.fallbackApplied = '2';
  img.src = DUMMY_IMAGE_FALLBACK;
};

export { DUMMY_IMAGE, DUMMY_IMAGE_FALLBACK };
