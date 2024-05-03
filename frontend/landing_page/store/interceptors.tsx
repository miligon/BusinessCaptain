/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const axiosBC = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
});

axiosBC.interceptors.request.use(
  (config) => {
    //config.headers['X-Domain'] = window.location.hostname;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosBC.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosBC;
