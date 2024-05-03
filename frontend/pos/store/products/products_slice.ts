// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getProduct, listProducts, putProduct, postProduct, deleteProduct } from './products_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { setRequestState } from 'common/utils';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';

export interface Codigo {
  id?: number;
  codigo: string;
  producto?: number;
}

export interface PubImpresaInfo {
  producto?: number;
  editorial: string;
  autorPrincipal: string;
  autoresSecundarios: string;
}

export interface Producto {
  id: number;
  codigos: Codigo[];
  PubImpresaInfo: PubImpresaInfo | null;
  costo: number;
  precio: number;
  tasaIVA: number;
  tasaIEPS: number;
  sku: string;
  modelo: string;
  claveSAT: string;
  departamento: number;
  familia: number;
  marca: number;
}

export interface ProductDetail {
  data: Producto;
  isLoaded: boolean;
}

export interface ProductList {
  [key: string]: string | number;
  id: number;
  sku: string;
  depto: string;
  familia: string;
  marca: string;
  producto: string;
  precio: number;
}

export interface ProductsData {
  results: ProductList[];
  current: number;
  count: number;
  pages: number;
  isLoaded: boolean;
}

interface ProductsState {
  productsData: ProductsData;
  productDetail: ProductDetail;
  requestStatus: RequestStatus;
}

const initialState: ProductsState = {
  productsData: {
    results: [],
    current: 0,
    count: 0,
    pages: 0,
    isLoaded: false,
  },
  productDetail: {
    data: {} as Producto,
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
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listProducts.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.productsData = action.payload;
      state.productsData.isLoaded = true;
    });
    builder.addCase(listProducts.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.productsData.isLoaded = false;
    });
    builder.addCase(listProducts.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.productsData = initialState.productsData;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.productDetail.data = action.payload;
      state.productDetail.isLoaded = true;
    });
    builder.addCase(getProduct.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.productDetail.isLoaded = false;
    });
    builder.addCase(getProduct.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.productDetail.data = {} as Producto;
      state.productDetail.isLoaded = false;
    });
    builder.addCase(postProduct.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
      state.productDetail.data = action.payload;
      state.productDetail.isLoaded = true;
    });
    builder.addCase(postProduct.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
    });
    builder.addCase(postProduct.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
    });
    builder.addCase(putProduct.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.SUCCESS);
      state.productDetail.data = action.payload;
      state.productDetail.isLoaded = true;
    });
    builder.addCase(putProduct.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.PENDING);
    });
    builder.addCase(putProduct.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.ERROR);
    });
    builder.addCase(deleteProduct.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
      state.productDetail.data = {} as Producto;
      state.productDetail.isLoaded = false;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteProduct.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
