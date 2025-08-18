import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import UserDashboard from "./pages/UserDashboard";

import Toast from "./components/Toast";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
          {!user && <Route path="/*" element={<Login onLogin={handleLogin} />} />}
          {user?.role === "admin" && <Route path="/*" element={<AdminDashboard user={user} onLogout={handleLogout} />} />}
          {user?.role === "mentor" && <Route path="/*" element={<MentorDashboard user={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />} />}
          {user?.role === "user" && <Route path="/*" element={<UserDashboard user={user} onLogout={handleLogout} />} />}
         
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
