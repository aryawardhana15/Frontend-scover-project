import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { User, Mail, Lock, UserCheck, Eye, EyeOff, BookOpen, GraduationCap, Users, Star, Brain, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔍 [REGISTER] User already logged in, clearing token for new registration');
      localStorage.removeItem('token');
      // Show info message
      setSuccess('Anda sudah login sebelumnya. Token telah dihapus untuk registrasi baru.');
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Nama wajib diisi';
    if (!form.email) newErrors.email = 'Email wajib diisi';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Email tidak valid';
    if (!form.password) newErrors.password = 'Password wajib diisi';
    else if (form.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setErrorMsg('');
    if (!validate()) return;
    
    // Clear any existing token before registration
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      console.log('🔍 [REGISTER] Clearing existing token before registration');
      localStorage.removeItem('token');
    }
    
    setLoading(true);
    try {
      console.log('[Register] payload:', form);
      let res;
      if (form.role === 'mentor') {
        res = await api.post('/mentors/register', {
          nama: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        res = await api.post('/users/register', {
          nama: form.name,
          email: form.email,
          password: form.password,
          role: 'user',
        });
      }
      console.log('[Register] success response:', res.status, res.data);
      
      if (form.role === 'mentor') {
        setSuccess('Registrasi mentor berhasil! Akun Anda sedang menunggu persetujuan admin. Anda akan dapat login setelah disetujui.');
      } else {
        setSuccess(res.data.message || 'Registrasi berhasil!');
      }
      
      setForm({ name: '', email: '', password: '', role: 'user' });
      setErrors({});
      
      // Redirect to login after 3 seconds (longer for mentor approval message)
      setTimeout(() => {
        navigate('/login');
      }, form.role === 'mentor' ? 3000 : 2000);
    } catch (err) {
      console.error('[Register] error object:', err);
      if (err.response) {
        console.error('[Register] server responded:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('[Register] no response, request was:', err.request);
      } else {
        console.error('[Register] setup error:', err.message);
      }
      setErrorMsg(err.response?.data?.error || err.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  const roleData = {
    user: {
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-400 to-cyan-500",
      title: "Siswa",
      description: "Akses pembelajaran dan materi dari mentor"
    },
    mentor: {
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      title: "Mentor",
      description: "Berbagi ilmu dan membimbing siswa"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden flex items-center justify-center p-4">
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

      {/* Main Registration Form */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-blue-200 relative z-10 transform hover:scale-[1.01] transition-transform duration-300">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Decorative header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-3xl"></div>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${roleData[form.role].color} text-white shadow-lg transform hover:scale-110 transition-all duration-300`}>
              {roleData[form.role].icon}
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-blue-800 mb-2">Daftar Akun</h2>
          <p className="text-blue-600 text-sm">Bergabung dengan EduPortal sekarang</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-lg animate-pulse">
            <div className="flex items-center justify-center">
              <span className="text-green-400 mr-2">✅</span>
              <div>
                <p className="font-medium">{success}</p>
                <p className="text-sm">Redirecting to login...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg">
            <div className="flex items-center justify-center">
              <span className="text-red-400 mr-2">⚠️</span>
              {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800"
            />
            {errors.name && <div className="text-red-500 text-xs mt-1 flex items-center"><span className="mr-1">⚠️</span>{errors.name}</div>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800"
            />
            {errors.email && <div className="text-red-500 text-xs mt-1 flex items-center"><span className="mr-1">⚠️</span>{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
              <Lock className="w-4 h-4 mr-2 text-blue-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-500 transition duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <div className="text-red-500 text-xs mt-1 flex items-center"><span className="mr-1">⚠️</span>{errors.password}</div>}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
              Daftar Sebagai
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 bg-gray-50 hover:bg-white text-gray-800 cursor-pointer"
            >
              <option value="user">👨‍🎓 Siswa - Belajar dari mentor</option>
              <option value="mentor">👨‍🏫 Mentor - Mengajar dan membimbing</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">{roleData[form.role].description}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mendaftar...
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 mr-2" />
                Daftar Sekarang
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-semibold transition duration-200 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Educational quote */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg mt-4">
          <p className="text-blue-800 text-xs italic text-center">
            "Pendidikan adalah investasi terbaik untuk masa depan"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
