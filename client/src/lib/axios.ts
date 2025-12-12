import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    // "http://localhost:3000" ||
    "https://blogify-4kr7.onrender.com/", // adjust to your backend
  withCredentials: true,
});

export default api;
