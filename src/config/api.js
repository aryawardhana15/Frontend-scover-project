// api/axios.js (atau api.js)
import axios from 'axios';

// API Configuration 
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api2.myscover.my.id/api'
  : 'http://localhost:3002/api';

// Debug log untuk memastikan URL yang digunakan
console.log('\n🌐 ====== API CONFIG ======');
console.log('🌐 [CONFIG] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  API_BASE_URL
});

// Debug existing token
const existingToken = localStorage.getItem('token');
console.log('\n🔑 [CONFIG] Existing token check:');
console.log('- Token exists:', !!existingToken);
if (existingToken) {
  console.log('- Token preview:', existingToken.substring(0, 20) + '...');
  console.log('- Token length:', existingToken.length);
  console.log('- Token type:', existingToken.startsWith('admin_') ? 'Admin Simple Token' :
                              existingToken.startsWith('mentor_') ? 'Mentor Simple Token' :
                              existingToken.startsWith('user_') ? 'User Simple Token' : 'JWT or Unknown');
}

console.log('🌐 ====== CONFIG END ======\n');

// ✅ BUAT AXIOS INSTANCE - INI YANG MISSING!
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ REQUEST INTERCEPTOR - Auto add token
api.interceptors.request.use(
  (config) => {
    console.log('\n🔵 ====== REQUEST START ======');
    console.log('📍 [REQUEST] Details:', {
      path: config.url,
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url
    });
    
    // Token handling with detailed logs
    const token = localStorage.getItem('token');
    console.log('\n🔑 [REQUEST] Token check:');
    console.log('- Token exists:', !!token);
    
    if (token) {
      try {
        // Handle simple tokens and JWT tokens
        if (token.startsWith('admin_') || token.startsWith('mentor_') || token.startsWith('user_')) {
          console.log('- Simple token detected:', token.split('_')[0]);
          // Simple tokens don't expire, just add to headers
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ [REQUEST] Simple token added to headers');
        } else if (token.startsWith('mock-jwt-token-')) {
          console.log('- Mock token detected, converting to simple format');
          // Convert mock token to simple format for testing
          const role = 'admin'; // Default to admin for mock tokens
          const userId = Math.floor(Math.random() * 1000) + 1;
          const simpleToken = `${role}_${userId}_${Date.now()}`;
          config.headers.Authorization = `Bearer ${simpleToken}`;
          console.log('✅ [REQUEST] Mock token converted to simple format');
        } else {
          // Handle JWT tokens
          const parts = token.split('.');
          console.log('- Is JWT format:', parts.length === 3);
          
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('- Token payload:', payload);
            console.log('- Token expiry:', new Date(payload.exp * 1000).toLocaleString());
            const isExpired = Date.now() > payload.exp * 1000;
            console.log('- Is expired:', isExpired);
            
            if (isExpired) {
              console.warn('⚠️ [REQUEST] Token is expired! This will cause 401 errors');
              localStorage.removeItem('token');
              window.location.href = '/login';
              return Promise.reject('Token expired');
            }
          }
          
          // Add JWT token to headers
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ [REQUEST] JWT token added to headers');
        }
      } catch (e) {
        console.error('❌ [REQUEST] Token validation error:', e.message);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject('Invalid token');
      }
    } else {
      console.warn('⚠️ [REQUEST] No token found');
      // Don't redirect for login requests
      if (config.url.includes('/login') || config.url.includes('/register')) {
        console.log('✅ [REQUEST] Login/register request, proceeding without token');
      }
    }
    
    // Request payload
    if (config.data) {
      console.log('\n📦 [REQUEST] Payload:', config.data);
    }
    
    // Final headers
    console.log('\n📋 [REQUEST] Final headers:', config.headers);
    console.log('🔵 ====== REQUEST END ======\n');
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('\n🟢 ====== RESPONSE SUCCESS START ======');
    console.log('✅ [RESPONSE] Basic info:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url
    });
    
    // Headers analysis
    console.log('\n📋 [RESPONSE] Headers check:');
    const headers = response.headers;
    console.log('- Content-Type:', headers['content-type']);
    console.log('- CORS headers:', {
      'access-control-allow-origin': headers['access-control-allow-origin'],
      'access-control-allow-credentials': headers['access-control-allow-credentials']
    });
    
    // Data analysis
    console.log('\n📦 [RESPONSE] Data analysis:');
    if (response.data) {
      console.log('- Has data:', true);
      console.log('- Data type:', typeof response.data);
      console.log('- Keys:', Object.keys(response.data));
      
      // Token check in response
      if (response.data.token) {
        console.log('\n🔑 [RESPONSE] Token found:');
        try {
          const parts = response.data.token.split('.');
          console.log('- Is JWT format:', parts.length === 3);
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('- Token payload:', payload);
            console.log('- Token expiry:', new Date(payload.exp * 1000).toLocaleString());
          }
        } catch (e) {
          console.error('- Token parse error:', e.message);
        }
      }
    } else {
      console.log('- Empty response data');
    }
    
    console.log('🟢 ====== RESPONSE SUCCESS END ======\n');
    return response;
  },
  (error) => {
    console.log('\n🔴 ====== RESPONSE ERROR START ======');
    
    // Request details that failed
    console.log('📍 [ERROR] Request details:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      headers: error.config?.headers
    });
    
    if (error.response) {
      // Server responded with error
      console.log('\n❌ [ERROR] Server response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // Detailed error analysis
      switch (error.response.status) {
        case 401:
          console.log('\n🔑 [ERROR] Authentication analysis:');
          const token = localStorage.getItem('token');
          console.log('- Token exists:', !!token);
          
          // Don't redirect if this is a login request (to avoid redirect loop)
          const isLoginRequest = error.config?.url?.includes('/login');
          console.log('- Is login request:', isLoginRequest);
          
          if (token && !isLoginRequest) {
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log('- Token payload:', payload);
                console.log('- Token expiry:', new Date(payload.exp * 1000).toLocaleString());
                console.log('- Is expired:', Date.now() > payload.exp * 1000);
              }
            } catch (e) {
              console.error('- Token parse error:', e.message);
            }
            console.log('- Clearing token and redirecting...');
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else if (isLoginRequest) {
            console.log('- Login request failed, not redirecting');
          }
          break;
          
        case 403:
          console.log('\n🔒 [ERROR] Permission analysis:');
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log('- User role:', payload.role);
                console.log('- Required role: Unknown (check backend logs)');
              }
            }
          } catch (e) {
            console.error('- Token parse error:', e.message);
          }
          break;
      }
    } else if (error.request) {
      // Network error
      console.log('\n🌐 [ERROR] Network analysis:');
      console.log('- Request made but no response');
      console.log('- XHR details:', {
        readyState: error.request.readyState,
        status: error.request.status,
        statusText: error.request.statusText
      });
      console.log('- Possible causes:');
      console.log('  • Backend server down');
      console.log('  • CORS not configured');
      console.log('  • Network connectivity issues');
    } else {
      // Setup error
      console.log('\n⚙️ [ERROR] Setup error:', error.message);
    }
    
    console.log('🔴 ====== RESPONSE ERROR END ======\n');
    return Promise.reject(error);
  }
);

// ✅ EXPORT AXIOS INSTANCE - BUKAN STRING!
export default api;

// ✅ EXPORT BASE URL JUGA (jika diperlukan)
export { API_BASE_URL };