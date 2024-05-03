// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getCaja, getConfig, getSucursal } from './config_thunk';
import { RequestStatus } from 'pos/store/interfaces';
import { REQUEST_EVENT, REQUEST_TYPE } from 'common/constants';
import { setRequestState } from 'common/utils';

export interface ConfiguracionCaja {
  activar_integracion_MP: boolean;
  open_print_ticket: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  groups: number[];
  user_permissions: number[];
  configuracion_caja: ConfiguracionCaja;
}

export interface Sucursal {
  id: number;
  nombre: string;
  razonSocial: string;
  RFC: string;
  regimenFiscal: string;
  telefono: string;
  email: string;
  logo: string;
  calle: string;
  no_ext: string;
  no_int: string | null;
  colonia: string;
  localidad: string;
  municipio: string;
  estado: string;
  pais: string;
  cp: string;
}

export interface UserConfig {
  data: User;
  isLoaded: boolean;
}

export interface SucursalConfig {
  data: Sucursal;
  isLoaded: boolean;
}

export interface CajaConfig {
  data: ConfiguracionCaja;
  isLoaded: boolean;
}

export interface ConfigState {
  userConfig: UserConfig;
  sucursalConfig: SucursalConfig;
  cajaConfig: CajaConfig;
  requestStatus: RequestStatus;
}

const initialState: ConfigState = {
  userConfig: {
    data: {} as User,
    isLoaded: false,
  },
  sucursalConfig: {
    data: {} as Sucursal,
    isLoaded: false,
  },
  cajaConfig: {
    data: {} as ConfiguracionCaja,
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
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getConfig.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.userConfig.data = action.payload;
      state.userConfig.isLoaded = true;
    });
    builder.addCase(getConfig.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.userConfig.isLoaded = false;
    });
    builder.addCase(getConfig.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.userConfig.data = {} as User;
      state.userConfig.isLoaded = false;
    });
    builder.addCase(getCaja.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.cajaConfig.data = action.payload[0];
      state.cajaConfig.isLoaded = true;
    });
    builder.addCase(getCaja.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.cajaConfig.isLoaded = false;
    });
    builder.addCase(getCaja.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.cajaConfig.data = {} as ConfiguracionCaja;
      state.cajaConfig.isLoaded = false;
    });
    builder.addCase(getSucursal.fulfilled, (state, action) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.SUCCESS);
      state.sucursalConfig.data = action.payload[0];
      state.sucursalConfig.isLoaded = true;
    });
    builder.addCase(getSucursal.pending, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.PENDING);
      state.sucursalConfig.isLoaded = false;
    });
    builder.addCase(getSucursal.rejected, (state) => {
      setRequestState(state, REQUEST_TYPE.GET, REQUEST_EVENT.ERROR);
      state.sucursalConfig.data = {} as Sucursal;
      state.sucursalConfig.isLoaded = false;
    });
  },
});

//export const {} = authSlice.actions;

export default authSlice.reducer;
