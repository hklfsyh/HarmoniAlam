import axios from 'axios';

const organizerApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor untuk menambahkan token otentikasi ke setiap request
organizerApi.interceptors.request.use(
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

export default organizerApi;
