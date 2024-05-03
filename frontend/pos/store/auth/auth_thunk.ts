import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { paths } from 'common/constants';

export interface AuthResponse {
  access: string;
  refresh: string;
}

interface loginData {
  username: string;
  password: string;
}

export const doVerifyAndRefresh = createAsyncThunk('auth/verify', async (token: string) => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
  });

  const responseVerify = await axiosInstance.post(paths.api.AUTH_API.VERIFY, { token: token });
  if (responseVerify.status == 200) {
    const responseRenew = await axiosInstance.post(paths.api.AUTH_API.RENEW, { refresh: token });
    if (responseVerify.status == 200) {
      return responseRenew.data;
    } else {
      return responseRenew.statusText;
    }
  } else {
    return responseVerify.statusText;
  }
});

export const doLogin = createAsyncThunk('auth/login', async (loginPayload: loginData) => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
  });

  const response = await axiosInstance.post(paths.api.AUTH_API.LOGIN, loginPayload);
  if (response.status == 200) {
    return response.data;
  } else {
    return response.statusText;
  }
});
