// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { listDepartments, getDepartment, putDepartment, postDepartment, deleteDepartment } from './departments_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface Department {
  id: number;
  clave: string;
  descripcion: string;
}

export interface DepartmentsData {
  data: Department[];
  isLoaded: boolean;
}

interface DepartmentsState {
  departmentsData: DepartmentsData;
  requestStatus: RequestStatus;
}

const initialState: DepartmentsState = {
  departmentsData: {
    data: [],
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
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listDepartments.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.departmentsData.data = action.payload;
      state.departmentsData.isLoaded = true;
    });
    builder.addCase(listDepartments.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.departmentsData.isLoaded = false;
    });
    builder.addCase(listDepartments.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.departmentsData.data = [];
      state.departmentsData.isLoaded = false;
    });
    builder.addCase(postDepartment.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(postDepartment.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
    });
    builder.addCase(postDepartment.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
    });
    builder.addCase(putDepartment.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(putDepartment.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.PENDING);
    });
    builder.addCase(putDepartment.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.PUT, REQUEST_EVENT.ERROR);
    });
    builder.addCase(deleteDepartment.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
    });
    builder.addCase(deleteDepartment.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteDepartment.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
