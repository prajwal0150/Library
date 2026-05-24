import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://library-1-e1mi.onrender.com",
});

export default api;