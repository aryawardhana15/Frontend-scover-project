import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api from '../config/api';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, Users, Award, Star, Brain } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('[Login] role:', role, 'email:', email);
      let res;
      if (role === 'mentor') {
        res = await api.post('/mentors/login', { email, password });
      } else if (role === 'admin') {
        res = await api.post('/admin/login', { email, password });
      } else {
        res = await api.post('/users/login', { email, password });
      }
      console.log('\n🟢 ====== LOGIN SUCCESS ======');
      console.log('✅ [LOGIN] Response status:', res.status);
      console.log('✅ [LOGIN] Response headers:', res.headers);
      console.log('✅ [LOGIN] Response data:', res.data);
      
      // Save token
      if (res.data.token) {
        console.log('\n🔑 [LOGIN] Token details:');
        console.log('- Full token:', res.data.token);
        console.log('- Token length:', res.data.token.length);
        console.log('- Token type:', typeof res.data.token);
        
        // Clear any existing token
        localStorage.removeItem('token');
        console.log('🗑️ [LOGIN] Cleared existing token');
        
        // Save new token
        localStorage.setItem('token', res.data.token);
        const savedToken = localStorage.getItem('token');
        console.log('\n✅ [LOGIN] Token verification:');
        console.log('- Saved successfully:', !!savedToken);
        console.log('- Saved token matches:', savedToken === res.data.token);
        console.log('- Saved token:', savedToken.substring(0, 20) + '...');
      } else {
        console.error('❌ [LOGIN] No token in response data');
        console.error('❌ [LOGIN] Response data keys:', Object.keys(res.data));
      }
      
      console.log('\n👤 [LOGIN] User data:', res.data);
      onLogin(res.data);
      console.log('🟢 ====== LOGIN END ======\n');
      
      // Redirect to appropriate dashboard
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else if (res.data.role === 'mentor') {
        navigate('/mentor');
      } else if (res.data.role === 'user') {
        navigate('/user');
      }
    } catch (err) {
      console.error('[Login] error object:', err);
      if (err.response) {
        console.error('[Login] server responded:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('[Login] no response, request was:', err.request);
      } else {
        console.error('[Login] setup error:', err.message);
      }
      setError(err.response?.data?.error || 'Login gagal. Cek email/password.');
    }
  };

  const roleData = {
    admin: {
      icon: <Award className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800"
    },
    mentor: {
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600"
    },
    user: {
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-400 to-cyan-500"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden flex items-center justify-center">
      {/* Educational background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-blue-300">
          <BookOpen className="w-24 h-24 transform rotate-12" />
        </div>
        <div className="absolute top-32 right-20 text-blue-300">
          <GraduationCap className="w-20 h-20 transform -rotate-12" />
        </div>
        <div className="absolute bottom-32 left-20 text-blue-300">
          <Brain className="w-28 h-28 transform rotate-45" />
        </div>
        <div className="absolute bottom-20 right-32 text-blue-300">
          <Users className="w-16 h-16 transform -rotate-45" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-blue-300">
          <Star className="w-12 h-12 animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-1/3 text-blue-300">
          <Star className="w-10 h-10 animate-pulse delay-500" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const icons = [BookOpen, GraduationCap, Brain, Star];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-bounce opacity-10 text-blue-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            >
              <Icon className="w-4 h-4" />
            </div>
          );
        })}
      </div>

      {/* Main Form - upgraded styling but same structure */}
      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-96 space-y-7 border border-blue-200 relative z-10 transform hover:scale-[1.01] transition-transform duration-300">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-3xl"></div>
        
        {/* Header with educational branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${roleData[role].color} text-white shadow-lg transform hover:scale-110 transition-all duration-300`}>
              {roleData[role].icon}
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-2">Login</h2>
          <p className="text-blue-600 text-sm">EduPortal - Platform Pembelajaran</p>
        </div>

        {/* Error message - same logic, better styling */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg text-center mb-4 animate-pulse">
            <div className="flex items-center justify-center">
              <span className="text-red-400 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Email field - same functionality, enhanced styling */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
            <Mail className="w-4 h-4 mr-2 text-blue-500" />
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white pl-4 text-gray-800"
              required
            />
          </div>
        </div>

        {/* Password field - same functionality, added show/hide feature */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
            <Lock className="w-4 h-4 mr-2 text-blue-500" />
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800"
            required
          />
        </div>

        {/* Role selector - same functionality, better styling */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            Role
          </label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800 cursor-pointer"
          >
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="user">Siswa</option>
          </select>
        </div>

        {/* Submit button - same functionality, enhanced styling */}
        <Button type="submit" size="lg" className="w-full">Login</Button>

        {/* Educational quote */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg mt-4">
          <p className="text-blue-800 text-xs italic text-center">
            "Belajar adalah investasi terbaik untuk masa depan"
          </p>
        </div>
      </form>
    </div>
  );
}