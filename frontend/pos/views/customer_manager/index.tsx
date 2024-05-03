import React, { FC } from 'react';
import CustomerEditor from './editor';
import CustomerDashboard from './dashboard';
import CustomerManager from './manager';
import { Navigate, Route, Routes } from 'react-router-dom';
import { paths } from 'common/constants';

const CustomerRoutes: FC = () => (
  <>
    <Routes>
      <Route index element={<Navigate to={paths.client.CUSTOMER_MANAGER.CUSTOMER_MANAGER} replace />} />
      <Route path={paths.client.CUSTOMER_MANAGER.EDITOR} element={<CustomerEditor />} />
      <Route path={paths.client.CUSTOMER_MANAGER.NEW} element={<CustomerEditor />} />
      <Route path={paths.client.CUSTOMER_MANAGER.CUSTOMER_MANAGER} element={<CustomerManager />} />
    </Routes>
  </>
);

export default CustomerRoutes;
