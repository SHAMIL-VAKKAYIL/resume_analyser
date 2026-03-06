import axios from 'axios';
import { store } from '../store/store'




const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export const UPLOAD_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '') + '/uploads';


api.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Refresh handling queue to avoid multiple concurrent refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (!err.response) return Promise.reject(err);
    if (err.response.status !== 401) return Promise.reject(err);
    if (originalRequest._retry) return Promise.reject(err);
    originalRequest._retry = true;

    // If currently refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch(e => Promise.reject(e));
    }

    isRefreshing = true;

    // Attempt to refresh
    try {
      const refreshRes = await api.post('/auth/refresh'); // sets new access cookie
      const newToken = refreshRes.data.accessToken;

      store.dispatch({
        type: 'auth/setAccessToken',
        payload: newToken,
      })

      processQueue(null, newToken);

      return api(originalRequest); // retry original
    } catch (refreshError) {
      processQueue(refreshError, null);
      // optionally dispatch logout here by emitting an event
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
