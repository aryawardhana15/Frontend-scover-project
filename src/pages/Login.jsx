import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, Users, Award, Star, Brain, ArrowLeft } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('[Login] role:', role, 'email:', email);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response with proper token format
      // Use existing IDs from database
      let userId;
      if (role === 'mentor') {
        userId = 5; // Use existing mentor ID from database
      } else if (role === 'admin') {
        userId = 1; // Admin ID
      } else {
        userId = 1; // User ID
      }
      
      const token = `${role}_${userId}_${Date.now()}`;
      
      const mockResponse = {
        data: {
          token: token,
          role: role,
          user: { 
            id: userId,
            email, 
            role,
            name: role === 'admin' ? 'Administrator' : 
                  role === 'mentor' ? 'Mentor User' : 'Student User'
          }
        }
      };
      
      console.log('✅ [LOGIN] Mock Response:', mockResponse.data);
      
      // Save token and user data to localStorage
      if (mockResponse.data.token) {
        localStorage.removeItem('token');
        localStorage.setItem('token', mockResponse.data.token);
      }
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      
      onLogin && onLogin(mockResponse.data);
      
      // Navigate based on role with small delay to ensure state update
      console.log(`🚀 Redirecting to ${role} dashboard...`);
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'mentor') {
          navigate('/mentor');
        } else if (role === 'user') {
          navigate('/user');
        }
      }, 100);
      
    } catch (err) {
      console.error('[Login] error:', err);
      setError('Login gagal. Periksa email/password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleData = {
    admin: {
      icon: <Award className="w-6 h-6" />,
      gradient: "from-cyan-400 to-blue-600",
      glow: "shadow-cyan-500/25"
    },
    mentor: {
      icon: <GraduationCap className="w-6 h-6" />,
      gradient: "from-purple-400 to-indigo-600", 
      glow: "shadow-purple-500/25"
    },
    user: {
      icon: <BookOpen className="w-6 h-6" />,
      gradient: "from-emerald-400 to-teal-600",
      glow: "shadow-emerald-500/25"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const icons = [BookOpen, GraduationCap, Brain, Star, Users, Award];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float opacity-10 text-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
      </div>

      {/* Neural Network Lines Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={Math.random() * 1000}
              y1={Math.random() * 1000}
              x2={Math.random() * 1000}
              y2={Math.random() * 1000}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Main Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-6 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-3xl">
          
          {/* Holographic Header Effect */}
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
              <div className={`p-4 rounded-3xl bg-gradient-to-r ${roleData[role].gradient} text-white shadow-2xl ${roleData[role].glow} transform hover:scale-110 transition-all duration-300 relative`}>
                {roleData[role].icon}
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${roleData[role].gradient} opacity-20 blur-xl`}></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Masuk
            </h2>
            <p className="text-white/70 text-sm font-medium tracking-wide">
              MYSCOVER • Portal Pembelajaran
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-200 p-4 rounded-2xl text-center mb-6 animate-shake">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-medium">{error}</span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="group">
            <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>ALAMAT EMAIL</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Masukkan email Anda..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-white placeholder-white/50 group-hover:bg-white/15"
                required
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>KATA SANDI</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi Anda..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-white placeholder-white/50 group-hover:bg-white/15"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="group">
            <label className="block text-white/90 mb-2 font-bold text-sm flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>TINGKAT AKSES</span>
            </label>
            <div className="relative">
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 text-white cursor-pointer appearance-none group-hover:bg-white/15"
              >
                <option value="admin" className="bg-gray-800 text-white">🛡️ Administrator</option>
                <option value="mentor" className="bg-gray-800 text-white">👨‍🏫 Mentor</option>
                <option value="user" className="bg-gray-800 text-white">🎓 Siswa</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/60"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Submit Button */}
            <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r ${roleData[role].gradient} text-white p-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl ${roleData[role].glow} relative overflow-hidden ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-3xl'}`}
          >
            {/* Button glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${roleData[role].gradient} opacity-0 hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
            
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>MASUK</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>

          {/* Futuristic Quote */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border-l-4 border-cyan-400 p-4 rounded-2xl mt-6">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              <p className="text-white/80 text-sm font-medium italic">
                "Masa depan milik mereka yang belajar, melupakan, dan belajar kembali."
              </p>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-white/70 text-sm">
              Belum punya akun?{' '}
              <button 
                onClick={handleRegisterClick}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-all duration-300 hover:underline underline-offset-4 decoration-2 decoration-cyan-400"
              >
                DAFTAR DI SINI
              </button>
            </p>
          </div>

          {/* Version Info */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-xs font-mono tracking-wider">
              MYSCOVER v3.0.1 • Platform Pembelajaran
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}