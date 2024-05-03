import 'pos/scss/styles.scss';
import React, { lazy, FC, Suspense } from 'react';
import SidebarApp from 'pos/components/sidebars';
import { paths } from 'common/constants';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from 'landing_page/components/spinner';
//import { CustomerRoutes } from 'pos/views/customer_manager';
//import { PointOfSales} from 'pos/views/point_of_sales';
//import { ProductManager } from 'pos/views/product_manager';
//import { Reports } from 'pos/views/reports';
//import { Dashboard } from 'pos/views/dashboard';
//import { ConfigIndex } from 'pos/views/configuration';

const PointOfSales = lazy(() => import('pos/views/point_of_sales'));
const ProductManager = lazy(() => import('pos/views/product_manager'));
const Reports = lazy(() => import('pos/views/reports'));
const Dashboard = lazy(() => import('pos/views/dashboard'));
const ConfigIndex = lazy(() => import('pos/views/configuration'));
const CustomerRoutes = lazy(() => import('pos/views/customer_manager'));

const AppContainer: FC = () => (
  <>
    <div className="d-flex">
      <SidebarApp />
      <div className="app-container d-flex flex-column flex-shrink-0 p-3 text-bg-white overflow-auto">
        <div className="w-full lg:w-8/12 px-4">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route index path={paths.client.APP_DASHBOARD} element={<Dashboard />} />
              <Route path={paths.client.POS.BASE + '/*'} element={<PointOfSales />} />

              <Route path={paths.client.CUSTOMER_MANAGER.BASE + '/*'} element={<CustomerRoutes />} />

              <Route path={paths.client.PRODUCT_MANAGER.BASE + '/*'} element={<ProductManager />} />

              <Route path={paths.client.REPORTS.BASE + '/*'} element={<Reports />} />

              <Route path={paths.client.CONFIG.BASE + '/*'} element={<ConfigIndex />} />

              <Route path="*" element={<Navigate to={paths.client.APP_DASHBOARD} replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  </>
);

export default AppContainer;
