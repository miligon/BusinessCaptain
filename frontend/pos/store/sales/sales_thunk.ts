/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listSales = createAsyncThunk('sales/listSales', async (fecha?: string) => {
  const response = await axiosBC.get(paths.api.SALES_API.LIST, { params: fecha ? { fecha: fecha } : null });

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getSale = createAsyncThunk('sales/getSale', async (data: any) => {
  const response = await axiosBC.get(paths.api.SALES_API.GET.replace(':carrito', data));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postSale = createAsyncThunk('sales/postSale', async (data: any) => {
  const response = await axiosBC.post(paths.api.SALES_API.POST, data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteSale = createAsyncThunk('sales/deleteSale', async (uuid: string) => {
  const response = await axiosBC.delete(paths.api.SALES_API.GET.replace(':carrito', uuid));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});
