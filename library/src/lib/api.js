import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://library-1-e1mi.onrender.com'
      : 'http://localhost:5000'),
});

export default api;