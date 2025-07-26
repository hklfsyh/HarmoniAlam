// src/API/admin.ts
import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor untuk menambahkan token ke setiap request
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;