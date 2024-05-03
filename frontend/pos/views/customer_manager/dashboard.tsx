import { paths } from 'common/constants';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard: FC = () => (
  <>
    <h1>Clientes</h1>
    <hr />
    <Link to={paths.client.CUSTOMER_MANAGER.CUSTOMER_MANAGER}>Editor de Clientes </Link>
  </>
);

export default CustomerDashboard;
