/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listProductCategories = createAsyncThunk('product_categories/listProductCategories', async () => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.CATEGORIES);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getProductCategory = createAsyncThunk('product_categories/getProductCategory', async (id: string) => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.CATEGORY.replace(':id', id));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteProductCategory = createAsyncThunk('product_categories/deleteProductCategory', async (id: string) => {
  const response = await axiosBC.delete(paths.api.ALMACEN_API.CATEGORY.replace(':id', id));

  if (response.status == 204) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const putProductCategory = createAsyncThunk('product_categories/putProductCategory', async (args: { id: string; data: any }) => {
  const response = await axiosBC.put(paths.api.ALMACEN_API.CATEGORY.replace(':id', args.id), args.data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postProductCategory = createAsyncThunk('product_categories/postProductCategory', async (data: any) => {
  const response = await axiosBC.post(paths.api.ALMACEN_API.CATEGORIES, data);

  if (response.status == 201) {
    return response.data;
  } else {
    return response.statusText;
  }
});
