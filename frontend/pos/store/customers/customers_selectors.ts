import { RootState } from 'landing_page/store';
import { CustomerDetail, CustomerList } from './customers_slice';
import { RequestStatus } from '../interfaces';

export const selectCustomers = (state: RootState): CustomerList => state.customers.customerList;
export const selectCustomerDetail = (state: RootState): CustomerDetail => state.customers.customerDetail;

export const selectCustomerRequestStatus = (state: RootState): RequestStatus => state.customers.requestStatus;
