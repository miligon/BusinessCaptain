import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { SellersData } from './sellers_slice';

export const selectSellers = (state: RootState): SellersData => state.sellers.sellersData;

export const selectSellersRequestStatus = (state: RootState): RequestStatus => state.sellers.requestStatus;
