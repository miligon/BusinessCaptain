export const BASE = '/';

export const LANDING_PAGE = {
  BASE: BASE,
  LOGIN: `/login`,
  PRODUCTS: `products`,
  CONTACT: `contact-us`,
};

export const APP_BASE = '/app/v1';

export const APP_DASHBOARD = 'dashboard';

const POS_BASE = 'point-of-sales';
export const POS = {
  BASE: POS_BASE,
  CAPTURE: `capture`,
  TOOLS: `tools`,
};
const CUSTOMER_MANAGER_BASE = 'customers';
export const CUSTOMER_MANAGER = {
  BASE: CUSTOMER_MANAGER_BASE,
  CUSTOMER_MANAGER: `manager`,
  EDITOR: `manager/:id/edit`,
  NEW: `manager/new`,
};

const PRODUCT_MANAGER_BASE = 'product-manager';
export const PRODUCT_MANAGER = {
  BASE: PRODUCT_MANAGER_BASE,
  PRODUCT_SEARCH: `products/search`,
  PRODUCT_DETAILS: `products/detail/:id`,
  PRODUCT_NEW: `products/new`,
  DEPARTMENTS: `departments`,
  CATEGORIES: `categories`,
  BRANDS: `brands`,
  LABEL_GENERATOR: `label-generator`,
};

const WALLET_BASE = 'wallet';
export const WALLET = {
  BASE: WALLET_BASE,
};

const REPORTS_BASE = 'reports';
export const REPORTS = {
  BASE: REPORTS_BASE,
  DEPARTMENTS_REPORT: `departments`,
  SECTION_REPORT: `section`,
  PRODUCT_REPORT: `products`,
  DOCUMENT_REPORT: `document`,
  FISCAL_REPORT: `fiscal`,
};

const CONFIG_BASE = 'config';
export const CONFIG = {
  BASE: CONFIG_BASE,
  CAJA: `caja`,
  SUCURSAL: `sucursal`,
};

export default {
  BASE,
  LANDING_PAGE,
  APP_BASE,
  APP_DASHBOARD,
  POS,
  CUSTOMER_MANAGER,
  PRODUCT_MANAGER,
  WALLET,
  REPORTS,
  CONFIG,
};
