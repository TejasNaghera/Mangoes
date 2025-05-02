// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // 🔥 તમારા backend server નું URL
});

export default api;
