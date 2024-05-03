const AUTH_API = {
  LOGIN: '/auth-services/jwt/create',
  RENEW: '/auth-services/jwt/refresh',
  VERIFY: '/auth-services/jwt/verify',
};

const CUSTOMERS_API = {
  LIST: '/api/clientes/clientes/',
  GET: '/api/clientes/clientes/:id/',
};

const ALMACEN_API = {
  PRODUCTS_SEARCH: '/api/almacen/producto/search',
  PRODUCTS: '/api/almacen/producto/',
  PRODUCT: '/api/almacen/producto/:id/',
  DEPARTMENTS: '/api/almacen/departamento/',
  DEPARTMENT: '/api/almacen/departamento/:id/',
  BRANDS: '/api/almacen/marca/',
  BRAND: '/api/almacen/marca/:id/',
  CATEGORIES: '/api/almacen/familia/',
  CATEGORY: '/api/almacen/familia/:id/',
  CODES: '/api/almacen/codigos/',
  CODE: '/api/almacen/codigos/:id/',
  PUB_IMPRESAS: '/api/almacen/pub-impresa/',
  PUB_IMPRESA: 'api/almacen/pub-impresa/:producto/',
};

const SELLERS_API = {
  LIST: '/api/info/empleados/',
  GET: '/api/info/empleados/:id/',
};

const SALES_API = {
  LIST: '/api/ventas/venta/',
  GET: '/api/ventas/venta/:carrito/',
  POST: '/api/ventas/capture',
  DELETE: '/api/ventas/delete',
};

const REPORTS_API = {
  GET_DEPARTMENTS_REPORT: '/api/reportes/ventas/general?inicio=:inicio&fin=:fin',
  GET_DOCUMENT_REPORT: '/api/reportes/ventas/documento?inicio=:inicio&fin=:fin',
};

const CONFIG_API = {
  USER: '/auth-services/users/me/',
  CAJA: '/api/info/cajas/',
  SUCURSAL: '/api/info/sucursal/',
};

const SITE_API = {
  LIST: '/site/content/',
};

export default {
  AUTH_API,
  CONFIG_API,
  CUSTOMERS_API,
  ALMACEN_API,
  REPORTS_API,
  SELLERS_API,
  SALES_API,
  SITE_API,
};
