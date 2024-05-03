/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosBC from '../interceptors';
import { paths } from 'common/constants';

export const listDepartments = createAsyncThunk('departments/listDepartments', async () => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.DEPARTMENTS);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const getDepartment = createAsyncThunk('departments/getDepartment', async (id: string) => {
  const response = await axiosBC.get(paths.api.ALMACEN_API.DEPARTMENT.replace(':id', id));

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const deleteDepartment = createAsyncThunk('departments/deleteDepartment', async (id: string) => {
  const response = await axiosBC.delete(paths.api.ALMACEN_API.DEPARTMENT.replace(':id', id));

  if (response.status == 204) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const putDepartment = createAsyncThunk('departments/putDepartment', async (args: { id: string; data: any }) => {
  const response = await axiosBC.put(paths.api.ALMACEN_API.DEPARTMENT.replace(':id', args.id), args.data);

  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});

export const postDepartment = createAsyncThunk('departments/postDepartment', async (data: any) => {
  const response = await axiosBC.post(paths.api.ALMACEN_API.DEPARTMENTS, data);

  if (response.status == 201) {
    return response.data;
  } else {
    return response.statusText;
  }
});
