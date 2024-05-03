/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listSellers = createAsyncThunk('sellers/listSellers', async () => {
  const response = await axiosBC.get(paths.api.SELLERS_API.LIST);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});
