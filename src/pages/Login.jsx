import { useState } from 'react';
import Button from '../components/Button';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, role });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">Login</h2>
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