import axios from 'axios';

const organizerApi = axios.create({
  baseURL: 'https://harmoni-alam-api-819767094904.asia-southeast2.run.app/api',
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
