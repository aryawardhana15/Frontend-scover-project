import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Award, Star, Brain, ArrowRight, CheckCircle, Globe, Clock, Shield } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const icons = [BookOpen, GraduationCap, Brain, Star];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float opacity-20 text-white/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          );
        })}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Hero Section - Compact for Mobile */}
        <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="p-3 md:p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl transform hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
              Selamat Datang di
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                Myscover
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              Platform pembelajaran online terdepan yang menghubungkan siswa dengan mentor berkualitas. 
              Tingkatkan kemampuan belajar Anda dengan sistem yang terintegrasi dan mudah digunakan.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-16">
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-2xl shadow-cyan-500/25"
              >
                <Users className="w-6 h-6 mr-2" />
                Daftar Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={handleLoginClick}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl"
              >
                <Award className="w-6 h-6 mr-2" />
                Masuk
              </button>
            </div>

            {/* Features Grid - Compact Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-16">
              <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4 mx-auto">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">Materi Berkualitas</h3>
                <p className="text-white/70 text-center text-sm md:text-base leading-relaxed">
                  Akses ribuan materi pembelajaran yang disusun oleh mentor berpengalaman dan terstruktur dengan baik.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4 mx-auto">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">Mentor Profesional</h3>
                <p className="text-white/70 text-center text-sm md:text-base leading-relaxed">
                  Belajar langsung dari mentor yang telah terverifikasi dan memiliki pengalaman di bidangnya masing-masing.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl md:col-span-1 col-span-1">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 mx-auto">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">Akses 24/7</h3>
                <p className="text-white/70 text-center text-sm md:text-base leading-relaxed">
                  Belajar kapan saja dan di mana saja dengan platform yang selalu siap melayani kebutuhan pembelajaran Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Compact for Mobile */}
        <section className="px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">Mengapa Memilih Myscover?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Sistem Penjadwalan Fleksibel</h4>
                      <p className="text-white/70 text-sm md:text-base">Atur jadwal belajar sesuai dengan waktu luang Anda</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Progress Tracking</h4>
                      <p className="text-white/70 text-sm md:text-base">Pantau kemajuan belajar dengan sistem tracking yang akurat</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Komunitas Aktif</h4>
                      <p className="text-white/70 text-sm md:text-base">Bergabung dengan komunitas pembelajar yang saling mendukung</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Sertifikat Resmi</h4>
                      <p className="text-white/70 text-sm md:text-base">Dapatkan sertifikat yang diakui setelah menyelesaikan program</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Support 24/7</h4>
                      <p className="text-white/70 text-sm md:text-base">Tim support siap membantu Anda kapan saja</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Keamanan Data</h4>
                      <p className="text-white/70 text-sm md:text-base">Data Anda aman dengan enkripsi tingkat enterprise</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Compact */}
        <section className="px-4 py-8 md:py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6">Siap Memulai Perjalanan Belajar?</h2>
            <p className="text-lg text-white/80 mb-6 md:mb-8">Bergabunglah dengan ribuan siswa yang telah merasakan manfaat Myscover</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-2xl shadow-cyan-500/25"
              >
                <Users className="w-6 h-6 mr-2" />
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={handleLoginClick}
                className="text-white/90 hover:text-white font-bold text-lg transition-all duration-300 hover:underline underline-offset-4 decoration-2 decoration-cyan-400"
              >
                Sudah punya akun? Masuk di sini
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;