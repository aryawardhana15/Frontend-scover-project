import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import UserDashboard from "./pages/UserDashboard";

import Toast from "./components/Toast";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      
      console.log('🔍 [APP] User state initialized:');
      console.log('  - Saved user:', parsedUser);
      console.log('  - Saved token:', savedToken);
      
      // Verify token and user consistency
      if (parsedUser && savedToken) {
        const tokenRole = savedToken.split('_')[0];
        const userRole = parsedUser.role;
        console.log('  - Token role:', tokenRole);
        console.log('  - User role:', userRole);
        console.log('  - Role match:', tokenRole === userRole);
        
        if (tokenRole !== userRole) {
          console.warn('⚠️ [APP] Token and user role mismatch, clearing data');
          localStorage.clear();
          return null;
        }
      }
      
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  });

  const handleLogin = (userData) => {
    console.log('🔍 [APP] handleLogin called with:', userData);
    console.log('🔍 [APP] User ID:', userData.id);
    console.log('🔍 [APP] User role:', userData.role);
    
    // Verify token consistency
    const token = localStorage.getItem('token');
    console.log('🔍 [APP] Current token:', token);
    console.log('🔍 [APP] Token role:', token ? token.split('_')[0] : 'none');
    console.log('🔍 [APP] User role:', userData.role);
    console.log('🔍 [APP] Role match:', token ? token.split('_')[0] === userData.role : false);
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    console.log('🔍 [APP] User state updated to:', userData);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all data including token
    setUser(null);
  };

  const handleProfileUpdate = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <>
      <Toast />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {user?.role === "admin" && <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />}
          {user?.role === "mentor" && <Route path="/mentor" element={<MentorDashboard user={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />} />}
          {user?.role === "user" && <Route path="/user" element={<UserDashboard user={user} onLogout={handleLogout} />} />}
         
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
