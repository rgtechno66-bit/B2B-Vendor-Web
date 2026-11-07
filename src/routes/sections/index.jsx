import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { mainRoutes } from './main';
import { SplashScreen } from 'src/components/loading-screen';
import { MainLayout } from 'src/layouts/main';

const HomePage = lazy(() => import('src/pages/home'));

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Suspense>
      ),
    },


    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
