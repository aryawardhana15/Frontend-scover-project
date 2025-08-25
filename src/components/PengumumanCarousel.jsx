import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function PengumumanCarousel() {
  const [pengumuman, setPengumuman] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/pengumuman')
      .then(res => {
        setPengumuman(res.data);
      })
      .catch(err => {
        console.error('Error fetching pengumuman:', err);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pengumuman.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pengumuman.length) % pengumuman.length);
  };

  if (pengumuman.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl mb-8">
      {pengumuman.map((p, index) => (
        <div
          key={p.id}
          className={`absolute w-full h-full transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={`http://localhost:3002${p.gambar_url}`}
            alt={p.judul}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white">{p.judul}</h3>
            <p className="text-white mt-2">{p.isi}</p>
          </div>
        </div>
      ))}
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
    </div>
  );
}
