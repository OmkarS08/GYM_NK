import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/', // Change this to your production URL when needed
  // You can add headers or interceptors here if needed
});

export default api;