import { combineReducers } from 'redux';
import auth from './auth/auth_slice';
import config from './config/config_slice';
import customers from './customers/customers_slice';
import reports from './reports/reports_slice';
import products from './products/products_slice';
import departments from './departments/departments_slice';
import brands from './brands/brands_slice';
import product_categories from './product_categories/product_categories_slice';
import sellers from './sellers/sellers_slice';
import sales from './sales/sales_slice';

export default {
  auth,
  config,
  customers,
  departments,
  brands,
  product_categories,
  products,
  sellers,
  sales,
  reports,
};
