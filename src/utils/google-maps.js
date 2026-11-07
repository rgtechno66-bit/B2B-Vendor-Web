const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDubPQl4clS4Crl8HosdyTmAo0J38u_cNM';

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

  if (message.includes('RefererNotAllowed') || message.includes('referer')) {
    return 'Google Maps API key does not allow this site. Add http://localhost:3031/* in Google Cloud Console → APIs & Services → Credentials → API key → Website restrictions.';
  }

  return 'Map could not be loaded. Please check the Google Maps API key and refresh the page.';
}
