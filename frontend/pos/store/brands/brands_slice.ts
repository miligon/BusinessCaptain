// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { listBrands, getBrand, putBrand, postBrand, deleteBrand } from './brands_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface Brand {
  id: number;
  clave: string;
  name: string;
}

export interface BrandsData {
  data: Brand[];
  isLoaded: boolean;
}

interface BrandsState {
  brandsData: BrandsData;
  requestStatus: RequestStatus;
}

const initialState: BrandsState = {
  brandsData: {
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
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listBrands.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.brandsData.data = action.payload;
      state.brandsData.isLoaded = true;
    });
    builder.addCase(listBrands.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.brandsData.isLoaded = false;
    });
    builder.addCase(listBrands.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.brandsData.data = [];
      state.brandsData.isLoaded = false;
    });
    builder.addCase(postBrand.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(postBrand.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
    });
    builder.addCase(postBrand.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
    });
    builder.addCase(putBrand.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(putBrand.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.PENDING);
    });
    builder.addCase(putBrand.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.ERROR);
    });
    builder.addCase(deleteBrand.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(deleteBrand.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteBrand.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
