// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getDepartmentsReport, getDocumentReport } from './reports_thunk';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface RequestStatus {
  success: boolean;
  loading: boolean;
  error: boolean;
  type: string;
}

export interface Articles {
  cantidad: number;
  departamento: string;
  marca: string;
  familia: string;
  modelo: string;
  total: number;
}

export interface TotalesItem {
  departamento: string;
  total: number;
}

export interface DocumentoData {
  index: number[];
  columns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[][];
}

export interface Departments {
  departamento: string;
  total: number;
}

export interface DepartmentsReport {
  articulos: Articles[];
  departamentos: Departments[];
  total: number;
  acumulado?: number;
  isLoaded: boolean;
}

export interface DocumentsReport {
  data: DocumentoData;
  isLoaded: boolean;
}

export interface Reports {
  departmentsReport: DepartmentsReport;
  documentReport: DocumentsReport;
  requestStatus: RequestStatus;
}

const initialState: Reports = {
  departmentsReport: {
    articulos: [],
    departamentos: [],
    total: 0.0,
    isLoaded: false,
  },
  documentReport: {
    data: {} as DocumentoData,
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
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDepartmentsReport.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.departmentsReport = action.payload;
      state.departmentsReport.isLoaded = true;
    });
    builder.addCase(getDepartmentsReport.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.departmentsReport.isLoaded = false;
    });
    builder.addCase(getDepartmentsReport.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.departmentsReport.isLoaded = false;
    });
    builder.addCase(getDocumentReport.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.documentReport.data = action.payload;
      state.documentReport.isLoaded = true;
    });
    builder.addCase(getDocumentReport.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.documentReport.isLoaded = false;
    });
    builder.addCase(getDocumentReport.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.documentReport.isLoaded = false;
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
