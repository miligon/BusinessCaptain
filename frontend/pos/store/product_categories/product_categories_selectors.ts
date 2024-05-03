import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { ProductCategoriesData } from './product_categories_slice';

export const selectProductCategories = (state: RootState): ProductCategoriesData => state.product_categories.productCategoriesData;

export const selectProductCategoriesRequestStatus = (state: RootState): RequestStatus => state.product_categories.requestStatus;
