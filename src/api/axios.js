import axios from "axios";
const api = axios.create({
  baseURL: "https://api2.myscover.my.id/api", // ganti sesuai backend
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
