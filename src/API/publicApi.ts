import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://harmoni-alam-api-819767094904.asia-southeast2.run.app/api',
});

export default publicApi;
