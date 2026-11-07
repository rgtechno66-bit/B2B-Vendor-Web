import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Initialize MUI theme modules before any Box/CssBaseline imports (Vite ESM init order)
import '@mui/material/styles';

import App from './app';
import { CONFIG } from './config-global';
import { Provider } from 'react-redux';
import store from './store';

// ----------------------------------------------------------------------
// StrictMode disabled: in dev it double-invokes effects, so all APIs (banner, logo, category-listing, items, popularity, footer-info) were called twice on home load.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter basename={CONFIG.site.basePath}>
      <Provider store={store}>
        <Suspense>
          <App />
        </Suspense>
      </Provider>
    </BrowserRouter>
  </HelmetProvider>
);
