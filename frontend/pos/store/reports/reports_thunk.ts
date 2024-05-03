/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const getDepartmentsReport = createAsyncThunk('reports/getDepartmentsReport', async (arg: { inicio: string; fin: string }) => {
  const start = arg.inicio + ' 00:00:00';
  const end = arg.fin + ' 23:59:59';

  const response = await axiosBC.get(paths.api.REPORTS_API.GET_DEPARTMENTS_REPORT.replace(':inicio', start).replace(':fin', end));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getDocumentReport = createAsyncThunk('reports/getDocumentReport', async (arg: { inicio: string; fin: string }) => {
  const start = arg.inicio + ' 00:00:00';
  const end = arg.fin + ' 23:59:59';

  const response = await axiosBC.get(paths.api.REPORTS_API.GET_DOCUMENT_REPORT.replace(':inicio', start).replace(':fin', end));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});
