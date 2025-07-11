import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardMentor from "./pages/DashboardMentor";
import DashboardUser from "./pages/DashboardUser";
import Toast from "./components/Toast";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Toast />
      <Router>
        <Routes>
          {!user && <Route path="/*" element={<Login onLogin={setUser} />} />}
          {user?.role === "admin" && <Route path="/*" element={<DashboardAdmin user={user} />} />}
          {user?.role === "mentor" && <Route path="/*" element={<DashboardMentor user={user} />} />}
          {user?.role === "user" && <Route path="/*" element={<DashboardUser user={user} />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
