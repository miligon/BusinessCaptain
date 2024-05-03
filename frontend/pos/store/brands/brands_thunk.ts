/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listBrands = createAsyncThunk('brands/listBrands', async () => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.BRANDS);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getBrand = createAsyncThunk('brands/getBrand', async (id: string) => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.BRAND.replace(':id', id));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteBrand = createAsyncThunk('brands/deleteBrand', async (id: string) => {
  const response = await axiosBC.delete(paths.api.ALMACEN_API.BRAND.replace(':id', id));

  if (response.status == 204) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const putBrand = createAsyncThunk('brands/putBrand', async (args: { id: string; data: any }) => {
  const response = await axiosBC.put(paths.api.ALMACEN_API.BRAND.replace(':id', args.id), args.data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postBrand = createAsyncThunk('brands/postBrand', async (data: any) => {
  const response = await axiosBC.post(paths.api.ALMACEN_API.BRANDS, data);

  if (response.status == 201) {
    return response.data;
  } else {
    return response.statusText;
  }
});
