// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { doLogin, doVerifyAndRefresh } from './auth_thunk';

interface AuthState {
  status: string;
}

const initialState: AuthState = {
  status: localStorage.getItem('refresh') !== '' && !!localStorage.getItem('refresh') ? 'VERIFY' : 'NONE',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.status = 'NONE';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.pending, (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.status = 'PENDING';
    });
    builder.addCase(doLogin.fulfilled, (state, action) => {
      localStorage.setItem('access', action.payload.access);
      localStorage.setItem('refresh', action.payload.refresh);
      state.status = 'SUCCESS';
    });
    builder.addCase(doLogin.rejected, (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.status = 'ERROR';
    });
    builder.addCase(doVerifyAndRefresh.pending, (state) => {
      localStorage.removeItem('access');
      state.status = 'PENDING';
    });
    builder.addCase(doVerifyAndRefresh.fulfilled, (state, action) => {
      localStorage.setItem('access', action.payload.access);
      state.status = 'SUCCESS';
    });
    builder.addCase(doVerifyAndRefresh.rejected, (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.status = 'NONE';
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
