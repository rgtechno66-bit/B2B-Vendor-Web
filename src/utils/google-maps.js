const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GOOGLE_MAPS_AUTH_ERROR_MESSAGE =
  'Google Maps rejected the API key for this site. Check that the current domain is listed under the key\'s Website restrictions, the Maps JavaScript API is enabled, and billing is active (Google Cloud Console → APIs & Services → Credentials).';

const CALLBACK_NAME = '__b2bGoogleMapsInit';

let loadPromise = null;

function resolveMapsApi(resolve, reject) {
  if (window.google?.maps) {
    resolve(window.google.maps);
    return;
  }
  reject(new Error('Google Maps API loaded but maps is unavailable'));
}

export function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (loadPromise) {
    return loadPromise;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('MissingApiKey'));
  }

  loadPromise = new Promise((resolve, reject) => {
    window[CALLBACK_NAME] = () => {
      delete window[CALLBACK_NAME];
      resolveMapsApi(resolve, reject);
    };

    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      loading: 'async',
      callback: CALLBACK_NAME,
    });

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      delete window[CALLBACK_NAME];
      reject(new Error('Google Maps script failed to load'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function getGoogleMapsLoadErrorMessage(error) {
  const message = error?.message || '';

  if (message.includes('MissingApiKey')) {
    return 'Google Maps API key is not configured. Set VITE_GOOGLE_MAPS_API_KEY in the build environment and rebuild.';
  }

  if (message.includes('RefererNotAllowed') || message.includes('referer')) {
    return GOOGLE_MAPS_AUTH_ERROR_MESSAGE;
  }

  return 'Map could not be loaded. Please check the Google Maps API key and refresh the page.';
}
