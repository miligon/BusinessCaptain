/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listCustomer = createAsyncThunk('customers/listCustomer', async () => {
  const response = await axiosBC.get(paths.api.CUSTOMERS_API.LIST);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getCustomer = createAsyncThunk('customers/getCustomer', async (id: string) => {
  const response = await axiosBC.get(paths.api.CUSTOMERS_API.GET.replace(':id', id));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id: string) => {
  const response = await axiosBC.delete(paths.api.CUSTOMERS_API.GET.replace(':id', id));

  if (response.status == 204) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const putCustomer = createAsyncThunk('customers/putCustomer', async (args: { id: string; data: any }) => {
  const response = await axiosBC.put(paths.api.CUSTOMERS_API.GET.replace(':id', args.id), args.data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postCustomer = createAsyncThunk('customers/postCustomer', async (data: any) => {
  const response = await axiosBC.post(paths.api.CUSTOMERS_API.LIST, data);

  if (response.status == 201) {
    return response.data;
  } else {
    return response.statusText;
  }
});
