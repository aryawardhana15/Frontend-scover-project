// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_URL || 'https://myscover.my.id/api')
  : 'http://localhost:3002/api';

// Debug log untuk memastikan URL yang digunakan
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export default API_BASE_URL;
