// Re-export the configured axios instance from config to avoid duplicate/incorrect setups
import apiInstance, { API_BASE_URL } from "../config/api";

export default apiInstance;
export { API_BASE_URL };
