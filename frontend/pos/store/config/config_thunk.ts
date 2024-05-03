/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const getConfig = createAsyncThunk('config/getConfig', async () => {
  const response = await axiosBC.get(paths.api.CONFIG_API.USER);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getCaja = createAsyncThunk('config/getCaja', async () => {
  const response = await axiosBC.get(paths.api.CONFIG_API.CAJA);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getSucursal = createAsyncThunk('config/getSucursal', async () => {
  const response = await axiosBC.get(paths.api.CONFIG_API.SUCURSAL);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});
