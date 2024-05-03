import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { paths } from 'common/constants';
import { LoginPage } from 'landing_page/views/';
import { Provider } from 'react-redux';
import store from 'landing_page/store';
import { PrivateRoute } from './pos/components/private_route';
import { Spinner } from 'reactstrap';
import smoothscroll from 'smoothscroll-polyfill';
import 'landing_page/scss/styles.scss';

smoothscroll.polyfill();

const AppContainer = lazy(() => import('./pos/containers/app_container'));

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path={paths.client.BASE + '*'} element={<LoginPage />} />
              <Route path={paths.client.LANDING_PAGE.LOGIN} element={<LoginPage />} />
              <Route
                path={paths.client.APP_BASE + '/*'}
                element={
                  <PrivateRoute>
                    <AppContainer />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to={paths.client.APP_BASE} replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
}
