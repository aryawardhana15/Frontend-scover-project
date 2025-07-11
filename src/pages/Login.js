import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "admin"
          ? "/admin"
          : role === "mentor"
          ? "/mentors"
          : "/users";
      const res = await api.get(endpoint);
      const user = res.data.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        toast.error("Email atau password salah!");
        return;
      }
      onLogin({ ...user, role });
      toast.success("Login berhasil!");
    } catch (err) {
      toast.error("Gagal login, cek koneksi backend!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">
          Login
        </h2>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Role</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="user">Siswa</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}