import { useState } from 'react';
import Button from '../components/Button';
import api from '../api/axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (role === 'mentor') {
        res = await api.post('/mentors/login', { email, password });
      } else if (role === 'admin') {
        res = await api.post('/admin/login', { email, password });
      } else {
        res = await api.post('/users/login', { email, password });
      }
      console.log('User login response:', res.data);
      onLogin(res.data);
    } catch (err) {
      setError('Login gagal. Cek email/password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">Login</h2>
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="user">Siswa</option>
          </select>
        </div>
        <Button type="submit" size="lg" className="w-full">Login</Button>
      </form>
    </div>
  );
} 