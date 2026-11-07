import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

const envApiBase =
  import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || 'https://api.intecomart.com';
/** Dev: false = /api → Vite proxy (localhost:3000). true = browser calls envApiBase (needs API CORS). */
const devUseLiveApi = import.meta.env.VITE_DEV_USE_LIVE_API === 'true';

export const CONFIG = {
  site: {
    name: 'Intecomart',
    url: import.meta.env.VITE_SITE_URL || 'https://www.intecomart.com',
    defaultDescription:
      'Intecomart is a B2B industrial marketplace for wholesale buyers and suppliers. Browse industrial products, request quotes, and streamline your procurement.',
    ogImage: import.meta.env.VITE_OG_IMAGE || 'https://www.intecomart.com/favicon/android-chrome-192x192.png',
    keywords:
      'Intecomart, B2B marketplace, industrial products, wholesale suppliers, bulk buyers, industrial procurement, Noida',
    serverUrl: import.meta.env.DEV && !devUseLiveApi ? '/api' : envApiBase,
    assetURL: import.meta.env.VITE_ASSET_URL ?? '',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,
  },
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Mapbox
   */
  mapbox: {
    apiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
  },
  /**
   * Firebase
   */
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APPID ?? '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID ?? '',
    userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '',
    region: import.meta.env.VITE_AWS_AMPLIFY_REGION ?? '',
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ?? '',
    domain: import.meta.env.VITE_AUTH0_DOMAIN ?? '',
    callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL ?? '',
  },
  /**
   * Supabase
   */
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  },
};
