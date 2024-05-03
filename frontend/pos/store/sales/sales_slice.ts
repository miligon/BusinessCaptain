// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { deleteSale, getSale, listSales, postSale } from './sales_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface Partidas {
  id: number;
  precioUnitario: number;
  IVA: number;
  IEPS: number;
  total: number;
  cantidad: number;
  sku: string;
  departamento: string;
  familia: string;
  marca: string;
  modelo: string;
  claveSAT: string;
  descuento: string;
  tasaIVA: string;
  tasaIEPS: string;
  carrito: string;
}

export interface Carrito {
  uuid_carrito: string;
  partidas: Partidas[];
  fechaDeCreacion: string;
  cliente: number;
  usuario: number;
}

export interface Transaction {
  id: number;
  descripcion: string;
  fechaDeMovimiento: string;
  monto: number;
  formaDePago: string;
  modalidadDePago: string;
  banco: string | null;
  referencia: string | null;
  montoEfectivo: number | null;
  montoCambioEfectivo: number | null;
  venta: string;
  caja: number;
}

export interface Sale {
  carrito: Carrito;
  documentType: string;
  folio: number;
  fechaDeVenta: string;
  caja: number;
  vendedor: number;
  observaciones: string;
  Subtotal: string;
  IVA: string;
  IEPS: string;
  Total: string;
  devolucion: boolean;
  garantia: boolean;
  cancelado: boolean;
  ticket: string;
  cliente_name: string;
  vendedor_name: string;
  detalle_pago: Transaction;
  OT: boolean | null;
}

export interface PaymentInfo {
  forma: string;
  banco?: string;
  referencia?: string;
  modo?: string;
  monto: number;
  montoEfectivo: number;
  cambioEfectivo: number;
}

export type SalesRecords = Partial<Partidas> &
  Required<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    // Change to total when the API changes
    precioTotal: number;
  }>;

export interface SaleCaptureFormat {
  dateTime: string;
  vendedor: number | undefined;
  cliente: number | undefined;
  docType: string | undefined;
  infoPago: PaymentInfo;
  partidas: SalesRecords[];
  observaciones: string;
}

export type SaleListing = Partial<Sale> &
  Required<{
    carrito: string;
    Total: number;
  }>;

export interface SalesData {
  data: SaleListing[];
  isLoaded: boolean;
}

export interface SalesDetail {
  data: Sale;
  isLoaded: boolean;
}

interface SalesState {
  salesData: SalesData;
  salesDetail: SalesDetail;
  lastTicket: string;
  requestStatus: RequestStatus;
}

const initialState: SalesState = {
  salesData: {
    data: [],
    isLoaded: false,
  },
  salesDetail: {
    data: {} as Sale,
    isLoaded: false,
  },
  lastTicket: '',
  requestStatus: {
    success: false,
    loading: false,
    error: false,
    type: '',
  },
};

const authSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listSales.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.SUCCESS);
      state.salesData.data = action.payload;
      state.salesData.isLoaded = true;
    });
    builder.addCase(listSales.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.PENDING);
      state.salesData.isLoaded = false;
    });
    builder.addCase(listSales.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.LIST, REQUEST_EVENT.ERROR);
      state.salesData.data = [];
      state.salesData.isLoaded = false;
    });
    builder.addCase(getSale.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.salesDetail.data = action.payload;
      state.salesDetail.isLoaded = true;
    });
    builder.addCase(getSale.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.salesDetail.isLoaded = false;
    });
    builder.addCase(getSale.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.salesDetail.data = {} as Sale;
      state.salesDetail.isLoaded = false;
    });
    builder.addCase(postSale.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.SUCCESS);
      state.lastTicket = action.payload.ticket;
    });
    builder.addCase(postSale.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.PENDING);
      state.lastTicket = '';
    });
    builder.addCase(postSale.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.POST, REQUEST_EVENT.ERROR);
      state.lastTicket = '';
    });
    builder.addCase(deleteSale.fulfilled, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.SUCCESS);
      state.salesDetail.data = {} as Sale;
      state.salesDetail.isLoaded = false;
    });
    builder.addCase(deleteSale.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.PENDING);
    });
    builder.addCase(deleteSale.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.DELETE, REQUEST_EVENT.ERROR);
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
