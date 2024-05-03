import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { ProductsData, ProductDetail } from './products_slice';

export const selectProducts = (state: RootState): ProductsData => state.products.productsData;
export const selectProductDetail = (state: RootState): ProductDetail => state.products.productDetail;

export const selectProductsRequestStatus = (state: RootState): RequestStatus => state.products.requestStatus;
