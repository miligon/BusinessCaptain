import client from './client';
import api from './api';

export interface SearchPayload {
  depto: string;
  marca: string;
  familia: string;
  query: string;
  codigo: string;
  page: number;
}

export const searchProductFilter = {
  depto: '',
  marca: '',
  familia: '',
  query: '',
  codigo: '',
  page: 1,
};

export const PAGE_DATA_SECTIONS = {
  LANDING: 'LANDING',
  PRODUCTS: 'PRODUCTS',
  CONTACT: 'CONTACT',
  CONTAINER: 'CONTAINER',
};

export const REQUEST_EVENT = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const REQUEST_TYPE = {
  LIST: 'LIST',
  GET: 'GET',
  DELETE: 'DEL',
  PUT: 'PUT',
  POST: 'POST',
};

export const DOCUMENT_TYPE = {
  TICKET: { value: 'TK', label: 'Ticket' },
  NOTA_DE_VENTA: { value: 'NV', label: 'Nota de Venta' },
  FACTURA: { value: 'FA', label: 'Factura' },
  ORDEN_DE_TRABAJO: { value: 'OT', label: 'Orden de Trabajo' },
};

export const PAYMENT_TYPE = {
  EFECTIVO: { value: 'EF', label: 'Efectivo' },
  TRANSFERENCIA_BANCARIA: { value: 'TB', label: 'Transferencia bancaria' },
  TARJETA_CREDITO: { value: 'TC', label: 'Tarjeta de Credito' },
  TARJETA_DEBITO: { value: 'TD', label: 'Tarjeta de Debito' },
  CHEQUE: { value: 'CH', label: 'Cheque' },
  OTROS: { value: 'UN', label: 'Otros' },
};

export const PAYMENT_MOD = {
  PARCIALIDADES: { value: 'PAR', label: 'Parcialidades' },
  UNA_EXHIBICION: { value: 'UNA', label: 'Una sola exhibición' },
};

export const paths = { client, api };
