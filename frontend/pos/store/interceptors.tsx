/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosBC = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
});

axiosBC.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access') || '';
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    // config.headers['Content-Type'] = 'application/json';
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
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === `/auth-services/jwt/refresh`) {
      const navigate = useNavigate();
      navigate('/login', {
        replace: true,
      });
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh') || '';
      return axios
        .post(`/auth-services/jwt/refresh`, {
          refresh: refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
            const newAccessToken = JSON.stringify(res.data.access);
            localStorage.setItem('access', newAccessToken);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  },
);

export default axiosBC;
