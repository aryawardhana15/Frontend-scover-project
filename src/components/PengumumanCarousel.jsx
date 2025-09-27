import { useEffect, useState } from 'react';
import api from '../config/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function PengumumanCarousel() {
  const [pengumuman, setPengumuman] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pengumuman');
        console.log('📢 [PENGUMUMAN CAROUSEL] Fetched pengumuman:', response.data);
        setPengumuman(response.data);
        setError(null);
      } catch (err) {
        console.error('❌ [PENGUMUMAN CAROUSEL] Error fetching pengumuman:', err);
        setError('Gagal memuat pengumuman');
        // Set mock data on error
        setPengumuman([
          {
            id: 1,
            judul: 'Selamat Datang di EduMentor',
            isi: 'Selamat datang di platform EduMentor! Platform pembelajaran online yang memudahkan proses belajar mengajar.',
            gambar_url: null,
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pengumuman.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pengumuman.length) % pengumuman.length);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (pengumuman.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [pengumuman.length]);

  if (loading) {
    return (
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl mb-8 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pengumuman...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl mb-8 bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">⚠️ {error}</p>
          <p className="text-sm text-gray-500">Menampilkan data offline</p>
        </div>
      </div>
    );
  }

  if (pengumuman.length === 0) {
    return (
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl mb-8 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">📢</p>
          <p className="text-gray-600">Belum ada pengumuman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl mb-8">
      {pengumuman.map((p, index) => (
        <div
          key={p.id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {p.gambar_url ? (
            <img
              src={`http://localhost:5000${p.gambar_url}`}
              alt={p.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('❌ [PENGUMUMAN CAROUSEL] Image load error:', e);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-2xl font-bold mb-2">{p.judul}</h3>
                <p className="text-lg opacity-90">{p.isi}</p>
              </div>
            </div>
          )}
          
          {/* Overlay with text */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{p.judul}</h3>
            <p className="text-white text-sm opacity-90 line-clamp-2">{p.isi}</p>
            <div className="mt-2 text-xs text-white opacity-75">
              {new Date(p.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      {pengumuman.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Dots indicator */}
      {pengumuman.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {pengumuman.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}





