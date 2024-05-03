// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { listSellers } from './sellers_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface Seller {
  id: number;
  first_name: string;
  last_name: string;
  observaciones: string;
  sucursal: number;
}

export interface SellersData {
  data: Seller[];
  isLoaded: boolean;
}

interface SellersState {
  sellersData: SellersData;
  requestStatus: RequestStatus;
}

const initialState: SellersState = {
  sellersData: {
    data: [],
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
  name: 'sellers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listSellers.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.sellersData.data = action.payload;
      state.sellersData.isLoaded = true;
    });
    builder.addCase(listSellers.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.sellersData.isLoaded = false;
    });
    builder.addCase(listSellers.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.sellersData.data = [];
      state.sellersData.isLoaded = false;
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
