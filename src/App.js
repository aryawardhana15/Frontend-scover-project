import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";

import Toast from "./components/Toast";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Toast />
      <Router>
        <Routes>
          {!user && <Route path="/*" element={<Login onLogin={setUser} />} />}
          {user?.role === "admin" && <Route path="/*" element={<AdminDashboard user={user} />} />}
          {user?.role === "mentor" && <Route path="/*" element={<MentorDashboard user={user} />} />}
         
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
