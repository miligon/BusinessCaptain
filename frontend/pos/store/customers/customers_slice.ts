// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getCustomer, listCustomer, putCustomer, postCustomer, deleteCustomer } from './customers_thunk';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';
import { RequestStatus } from '../interfaces';

export interface Customer {
  id_client: number;
  RFC: string;
  regimen_fiscal: string;
  razonSocial: string;
  telefono_movil: string;
  telefonos: string;
  observaciones: string;
  email: string;
  email2: string;
  email3: string;
  publicidad: boolean;
  calle: string;
  no_ext: string;
  no_int: string;
  colonia: string;
  localidad: string;
  municipio: string;
  estado: string;
  pais: string;
  cp: string;
}

export interface CustomerList {
  data: Customer[];
  isLoaded: boolean;
}

export interface CustomerDetail {
  data: Customer;
  isLoaded: boolean;
}

interface CustomerState {
  customerList: CustomerList;
  customerDetail: CustomerDetail;
  requestStatus: RequestStatus;
}

const initialState: CustomerState = {
  customerList: {
    data: [],
    isLoaded: false,
  },
  customerDetail: {
    data: {} as Customer,
    isLoaded: false,
  },
  requestStatus: {
    success: false,
    loading: false,
    error: false,
    type: '',
  },
};

const authSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteCustomer.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
      state.customerDetail.data = {} as Customer;
      state.customerDetail.isLoaded = false;
    });
    builder.addCase(deleteCustomer.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteCustomer.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
      state.customerDetail.data = {} as Customer;
      state.customerDetail.isLoaded = false;
    });
    builder.addCase(putCustomer.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.SUCCESS);
      state.customerDetail.data = action.payload as Customer;
      state.customerDetail.isLoaded = true;
    });
    builder.addCase(putCustomer.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.PENDING);
    });
    builder.addCase(putCustomer.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.ERROR);
    });
    builder.addCase(postCustomer.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
      state.customerDetail.data = action.payload as Customer;
      state.customerDetail.isLoaded = true;
    });
    builder.addCase(postCustomer.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
    });
    builder.addCase(postCustomer.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
    });
    builder.addCase(getCustomer.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.customerDetail.data = action.payload as Customer;
      state.customerDetail.isLoaded = true;
    });
    builder.addCase(getCustomer.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.customerDetail.isLoaded = false;
    });
    builder.addCase(getCustomer.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.customerDetail.data = {} as Customer;
      state.customerDetail.isLoaded = false;
    });
    builder.addCase(listCustomer.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.customerList.isLoaded = false;
    });
    builder.addCase(listCustomer.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.customerList.data = action.payload as Customer[];
      state.customerList.isLoaded = true;
    });
    builder.addCase(listCustomer.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.customerList.data = [] as Customer[];
      state.customerList.isLoaded = false;
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
