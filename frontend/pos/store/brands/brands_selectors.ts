import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { BrandsData } from './brands_slice';

export const selectBrands = (state: RootState): BrandsData => state.brands.brandsData;

export const selectBrandsRequestStatus = (state: RootState): RequestStatus => state.brands.requestStatus;
