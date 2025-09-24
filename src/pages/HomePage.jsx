import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Award, Star, Brain, ArrowRight, CheckCircle, Globe, Clock, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Elements */}
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

      {/* Floating Particles */}
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl transform hover:scale-110 transition-all duration-300">
              <GraduationCap className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold text-blue-800 mb-6 leading-tight">
            Selamat Datang di
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduPortal
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Platform pembelajaran online terdepan yang menghubungkan siswa dengan mentor berkualitas. 
            Tingkatkan kemampuan belajar Anda dengan sistem yang terintegrasi dan mudah digunakan.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              <Users className="w-6 h-6 mr-2" />
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              <Award className="w-6 h-6 mr-2" />
              Masuk
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transition duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 mx-auto">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Materi Berkualitas</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Akses ribuan materi pembelajaran yang disusun oleh mentor berpengalaman dan terstruktur dengan baik.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transition duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Mentor Profesional</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Belajar langsung dari mentor yang telah terverifikasi dan memiliki pengalaman di bidangnya masing-masing.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transition duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl mb-6 mx-auto">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Akses 24/7</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Belajar kapan saja dan di mana saja dengan platform yang selalu siap melayani kebutuhan pembelajaran Anda.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-blue-200 mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">Mengapa Memilih EduPortal?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Sistem Penjadwalan Fleksibel</h4>
                  <p className="text-gray-600">Atur jadwal belajar sesuai dengan waktu luang Anda</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h4>
                  <p className="text-gray-600">Pantau kemajuan belajar dengan sistem tracking yang akurat</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Komunitas Aktif</h4>
                  <p className="text-gray-600">Bergabung dengan komunitas pembelajar yang saling mendukung</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Sertifikat Resmi</h4>
                  <p className="text-gray-600">Dapatkan sertifikat yang diakui setelah menyelesaikan program</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Support 24/7</h4>
                  <p className="text-gray-600">Tim support siap membantu Anda kapan saja</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Keamanan Data</h4>
                  <p className="text-gray-600">Data Anda aman dengan enkripsi tingkat enterprise</p>
                </div>
              </div>
        </div>
        </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Siap Memulai Perjalanan Belajar?</h2>
          <p className="text-lg text-gray-600 mb-8">Bergabunglah dengan ribuan siswa yang telah merasakan manfaat EduPortal</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              <Users className="w-6 h-6 mr-2" />
              Daftar Gratis Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition duration-200 hover:underline"
            >
              Sudah punya akun? Masuk di sini
            </Link>
          </div>
        </div>
        </div>
    </div>
  );
};

export default HomePage;
