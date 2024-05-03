/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths, SearchPayload, searchProductFilter } from 'common/constants';

export const listProducts = createAsyncThunk('products/listProducts', async (args?: SearchPayload) => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.PRODUCTS_SEARCH, { params: args ? args : searchProductFilter });

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getProduct = createAsyncThunk('products/getProduct', async (id: string) => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.PRODUCT.replace(':id', id));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  const response = await axiosBC.delete(paths.api.ALMACEN_API.PRODUCT.replace(':id', id));

  if (response.status == 204) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const putProduct = createAsyncThunk('products/putProduct', async (args: { id: string; data: any }) => {
  const response = await axiosBC.put(paths.api.ALMACEN_API.PRODUCT.replace(':id', args.id), args.data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postProduct = createAsyncThunk('products/postProduct', async (data: any) => {
  const response = await axiosBC.post(paths.api.ALMACEN_API.PRODUCTS, data);

  if (response.status == 201) {
    return response.data;
  } else {
    return response.statusText;
  }
});
