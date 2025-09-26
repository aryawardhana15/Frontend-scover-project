import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, Eye, EyeOff, BookOpen, GraduationCap, Users, Star, Brain, ArrowLeft, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔍 [REGISTER] User already logged in, clearing token for new registration');
      localStorage.removeItem('token');
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
    
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      console.log('🔍 [REGISTER] Clearing existing token before registration');
      localStorage.removeItem('token');
    }
    
    setLoading(true);
    try {
      console.log('[Register] payload:', form);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (form.role === 'mentor') {
        setSuccess('Registrasi mentor berhasil! Akun Anda sedang menunggu persetujuan admin. Anda akan dapat login setelah disetujui.');
      } else {
        setSuccess('Registrasi berhasil! Selamat datang di Myscover Neural Learning Platform.');
      }
      
      setForm({ name: '', email: '', password: '', role: 'user' });
      setErrors({});
      
      // Simulate redirect after success
      setTimeout(() => {
        console.log('🚀 Redirecting to login page...');
      }, form.role === 'mentor' ? 3000 : 2000);
      
    } catch (err) {
      console.error('[Register] error:', err);
      setErrorMsg('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const roleData = {
    user: {
      icon: <BookOpen className="w-6 h-6" />,
      gradient: "from-emerald-400 to-teal-600",
      glow: "shadow-emerald-500/25",
      title: "SISWA",
      description: "Akses materi pembelajaran dan bimbingan mentor"
    },
    mentor: {
      icon: <GraduationCap className="w-6 h-6" />,
      gradient: "from-purple-400 to-indigo-600",
      glow: "shadow-purple-500/25",
      title: "MENTOR",
      description: "Berbagi pengetahuan dan membimbing siswa"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        <div className="absolute top-1/3 left-1/2 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const icons = [BookOpen, GraduationCap, Brain, Star, Users, Sparkles];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float opacity-10 text-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
      </div>

      {/* Neural Network Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {[...Array(144)].map((_, i) => (
            <div 
              key={i} 
              className="border border-white/10 animate-pulse" 
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-6 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-3xl">
          
          {/* Holographic Header Effects */}
          <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-t-3xl opacity-80 blur-sm"></div>
          <div className="absolute -top-0.5 -left-0.5 -right-0.5 h-0.5 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 rounded-t-3xl"></div>
          
          {/* Back Button */}
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-white/80 hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium tracking-wide">KEMBALI</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className={`p-4 rounded-3xl bg-gradient-to-r ${roleData[form.role].gradient} text-white shadow-2xl ${roleData[form.role].glow} transform hover:scale-110 transition-all duration-300 relative`}>
                {roleData[form.role].icon}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${roleData[form.role].gradient} opacity-20 blur-xl`}></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              DAFTAR AKUN
            </h2>
            <p className="text-white/70 text-sm font-medium tracking-wider">
              MYSCOVER • Pendaftaran Akun Baru
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 p-4 rounded-2xl animate-pulse-glow">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-bold text-sm">{success}</p>
                  <p className="text-xs text-emerald-300">Memproses pendaftaran...</p>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-200 p-4 rounded-2xl animate-shake">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-medium">{errorMsg}</span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="space-y-5">
            {/* Name Field */}
            <div className="group">
              <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>NAMA LENGKAP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-white placeholder-white/50 group-hover:bg-white/15"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.name && (
                <div className="text-red-300 text-xs mt-2 flex items-center space-x-1 animate-pulse">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>ALAMAT EMAIL</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-white placeholder-white/50 group-hover:bg-white/15"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <div className="text-red-300 text-xs mt-2 flex items-center space-x-1 animate-pulse">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>KATA SANDI</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 text-white placeholder-white/50 group-hover:bg-white/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <div className="text-red-300 text-xs mt-2 flex items-center space-x-1 animate-pulse">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className="group">
              <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-pink-400" />
                <span>TIPE AKUN</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300 text-white cursor-pointer appearance-none group-hover:bg-white/15"
                >
                  <option value="user" className="bg-gray-800 text-white">🎓 Siswa - Akses Materi Pembelajaran</option>
                  <option value="mentor" className="bg-gray-800 text-white">👨‍🏫 Mentor - Berbagi Pengetahuan</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/60"></div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <p className="text-white/50 text-xs mt-2 font-mono tracking-wide">
                {roleData[form.role].description}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-gradient-to-r ${roleData[form.role].gradient} text-white p-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl ${roleData[form.role].glow} relative overflow-hidden ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-3xl'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${roleData[form.role].gradient} opacity-0 hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
              
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses pendaftaran...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>DAFTAR AKUN</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-white/70 text-sm">
              Sudah punya akun?{' '}
              <button 
                onClick={handleLoginClick}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-all duration-300 hover:underline underline-offset-4 decoration-2 decoration-cyan-400"
              >
                MASUK DI SINI
              </button>
            </p>
          </div>

          {/* Futuristic Quote */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border-l-4 border-cyan-400 p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              <p className="text-white/80 text-sm font-medium italic">
                "Evolusi melalui pendidikan, transendensi melalui pengetahuan."
              </p>
            </div>
          </div>

          {/* System Info */}
          <div className="text-center">
            <p className="text-white/30 text-xs font-mono tracking-widest">
              MYSCOVER v4.2.1 • Platform Pendaftaran
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.1; 
          }
          33% { 
            transform: translateY(-15px) rotate(120deg) scale(1.1); 
            opacity: 0.3; 
          }
          66% { 
            transform: translateY(-5px) rotate(240deg) scale(0.9); 
            opacity: 0.2; 
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;