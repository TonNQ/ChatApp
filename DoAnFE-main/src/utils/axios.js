import axios from 'axios';
import { logout, generateAccessToken } from '../redux/actions/authAction';
import { Config } from '../config/config';

const axiosInstance = axios.create({
  baseURL: Config.BACKEND_URL,
  timeout: 300000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initRequest = (store) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = store?.getState()?.auth?.access_token;
      if (!config.headers.Authorization && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      if (status === 401) {
        const refreshToken = store?.getState()?.auth?.refresh_token;
        if (refreshToken) {
          return new Promise((resolve, reject) => {
            store
              .dispatch(generateAccessToken(refreshToken))
              .then(() => {
                const accessToken = store?.getState()?.auth?.access_token;
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                resolve(axiosInstance(error.config));
              })
              .catch((error) => {
                store.dispatch(logout());
                reject(error);
              });
          });
        }
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
