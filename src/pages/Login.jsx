import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, Users, Award, Star, Brain } from 'lucide-react';

// Custom Button component since we don't have access to the original
const Button = ({ children, type = "button", size = "md", className = "", ...props }) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      type={type}
      className={`${sizeClasses[size]} ${className} transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Login({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { email, role },
          message: 'Login berhasil!'
        }
      };
      
      console.log('User login response:', mockResponse.data);
      onLogin(mockResponse.data);
      
      // Note: In a real app, you'd use localStorage here
      // localStorage.setItem('token', mockResponse.data.token);
      
    } catch (err) {
      setError('Login gagal. Cek email/password.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleData = {
    admin: {
      icon: <Award className="w-8 h-8" />,
      title: "Administrator",
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50"
    },
    mentor: {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Mentor",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    user: {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Siswa",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-cyan-50"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Educational background pattern */}
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

      {/* Floating educational elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const icons = [BookOpen, GraduationCap, Brain, Star];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float opacity-10 text-blue-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-10 p-4">
        <div className="w-full max-w-md">
          {/* Main card with educational theme */}
          <div className="bg-white/90 backdrop-blur-xl border border-blue-200 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Decorative header wave */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
            
            <div className="space-y-6 relative z-10">
              {/* Header with educational branding */}
              <div className="text-center mb-8">
                <div className="relative mb-6">
                  <div className="flex justify-center items-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${roleData[role].color} text-white shadow-lg transform hover:scale-110 transition-all duration-300`}>
                      {roleData[role].icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">
                  Scover
                </h1>
                <p className="text-blue-600 font-semibold mb-1">{roleData[role].title}</p>
                <p className="text-gray-500 text-sm">Masuk ke platform pembelajaran</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6 animate-shake">
                  <div className="flex items-center">
                    <span className="text-red-400 mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="relative group">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  📧 Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    required
                  />
                  <div className={`absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'email' ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              {/* Password field */}
              <div className="relative group">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  🔐 Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className={`absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'password' ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              {/* Role selector */}
              <div className="relative group">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  👤 Pilih Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'role' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    onFocus={() => setFocusedField('role')}
                    onBlur={() => setFocusedField('')}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="admin">🏆 Administrator</option>
                    <option value="mentor">🎓 Mentor</option>
                    <option value="user">📚 Siswa</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <div className="text-gray-400">▼</div>
                  </div>
                  <div className={`absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'role' ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading}
                onClick={handleSubmit}
                className={`w-full bg-gradient-to-r ${roleData[role].color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group transform hover:scale-[1.02]`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sedang Masuk...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Masuk ke Portal</span>
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </>
                )}
              </Button>

              {/* Additional options */}
              <div className="flex items-center justify-between text-sm text-gray-600 mt-6">
                <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors duration-300">
                  <input type="checkbox" className="mr-2 accent-blue-500" />
                  Ingat saya
                </label>
                <a href="#" className="hover:text-blue-600 transition-colors duration-300 font-medium">
                  Lupa password?
                </a>
              </div>

              {/* Educational quote */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mt-6">
                <p className="text-blue-800 text-sm italic">
                  "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia." - Nelson Mandela
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Belum punya akun? 
              <a href="#" className="text-blue-600 hover:text-blue-700 ml-1 font-semibold transition-colors duration-300">
                Daftar di sini
              </a>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              © 2025 Scover - Platform Pembelajaran Digital
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}