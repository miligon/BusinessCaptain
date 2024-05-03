import { RootState } from 'landing_page/store';

export const selectAuthStatus = (state: RootState): string => state.auth.status;
