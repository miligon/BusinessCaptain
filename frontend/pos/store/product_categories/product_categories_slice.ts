// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { listProductCategories, getProductCategory, putProductCategory, postProductCategory, deleteProductCategory } from './product_categories_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { setRequestState } from 'common/utils';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductCategoriesData {
  data: ProductCategory[];
  isLoaded: boolean;
}

interface ProductCategoriesState {
  productCategoriesData: ProductCategoriesData;
  requestStatus: RequestStatus;
}

const initialState: ProductCategoriesState = {
  productCategoriesData: {
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
  name: 'product_categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listProductCategories.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.productCategoriesData.data = action.payload;
      state.productCategoriesData.isLoaded = true;
    });
    builder.addCase(listProductCategories.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.productCategoriesData.isLoaded = false;
    });
    builder.addCase(listProductCategories.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.productCategoriesData.data = [];
      state.productCategoriesData.isLoaded = false;
    });
    builder.addCase(postProductCategory.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(postProductCategory.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
    });
    builder.addCase(postProductCategory.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
    });
    builder.addCase(putProductCategory.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(putProductCategory.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.PENDING);
    });
    builder.addCase(putProductCategory.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.ERROR);
    });
    builder.addCase(deleteProductCategory.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(deleteProductCategory.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteProductCategory.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
