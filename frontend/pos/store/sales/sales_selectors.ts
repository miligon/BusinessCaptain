import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { SalesData, SalesDetail } from './sales_slice';

export const selectSales = (state: RootState): SalesData => state.sales.salesData;
export const selectSaleDetail = (state: RootState): SalesDetail => state.sales.salesDetail;
export const selectTicket = (state: RootState): string => state.sales.lastTicket;

export const selectSalesRequestStatus = (state: RootState): RequestStatus => state.sales.requestStatus;
