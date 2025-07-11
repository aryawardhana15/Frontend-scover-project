import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ganti sesuai backend
});
export default api; 