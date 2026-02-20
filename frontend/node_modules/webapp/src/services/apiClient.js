import axios from 'axios';
import Api_url from '../constant/constant';

const apiClient = axios.create({
  baseURL: `${Api_url.BACKEND_URI}/api`,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
