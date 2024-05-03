import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { UserConfig, CajaConfig, SucursalConfig } from './config_slice';

export const selectCajaConfig = (state: RootState): CajaConfig => state.config.cajaConfig;
export const selectUserConfig = (state: RootState): UserConfig => state.config.userConfig;
export const selectSucursalConfig = (state: RootState): SucursalConfig => state.config.sucursalConfig;

export const selectConfigRequestStatus = (state: RootState): RequestStatus => state.sellers.requestStatus;
