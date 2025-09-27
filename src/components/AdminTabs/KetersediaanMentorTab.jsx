import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';

const WEEK_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESI_LABELS = [1, 2, 3, 4, 5];

const KetersediaanMentorTab = ({ mentors }) => {
  const [data, setData] = useState([]);
  const [mingguKe, setMingguKe] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + (mingguKe - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  useEffect(() => {
    if (selectedMentor) {
      fetchAvailabilityData();
    } else {
      setData([]);
    }
  }, [mingguKe, selectedMentor]);

  const fetchAvailabilityData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/availability-mentor?mentor_id=${selectedMentor}&minggu_ke=${mingguKe}`);
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching availability data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const nextWeek = () => {
    setMingguKe(prev => prev + 1);
  };

  const prevWeek = () => {
    if (mingguKe > 1) {
      setMingguKe(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ketersediaan Mentor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Pilih Mentor</label>
            <select 
              value={selectedMentor} 
              onChange={e => setSelectedMentor(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm"
            >
              <option value="">-- Pilih Mentor --</option>
              {mentors && Array.from(mentors).map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Minggu ke</label>
            <input 
              type="number" 
              min={1} 
              max={53} 
              value={mingguKe} 
              onChange={e => setMingguKe(Number(e.target.value))} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm" 
            />
          </div>
        </div>
      </div>

      {selectedMentor ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Ketersediaan Minggu ke-{mingguKe}</h3>
              <p className="text-sm text-gray-600">
                {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevWeek}
                disabled={mingguKe <= 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={nextWeek}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Sesi/Hari</th>
                  {Array.from(WEEK_LABELS).map((h, idx) => {
                    const tgl = new Date(weekStart);
                    tgl.setDate(weekStart.getDate() + idx);
                    const isToday = tgl.toDateString() === today.toDateString();
                    return (
                      <th 
                        key={h} 
                        className={`px-4 py-3 text-center text-sm font-medium ${isToday ? 'bg-yellow-500' : ''}`}
                      >
                        <div>
                          <div className="font-semibold">{h}</div>
                          <div className="text-xs opacity-90">{tgl.getDate()}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {Array.from(SESI_LABELS).map(sesi => (
                  <tr key={sesi} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Sesi {sesi}
                      </div>
                    </td>
                    {Array.from(WEEK_LABELS).map(hari => {
                      const item = data.find(d => d.hari === hari && d.sesi === sesi);
                      return (
                        <td 
                          key={hari} 
                          className={`px-4 py-3 text-center ${item?.is_available ? 'bg-green-50/50' : 'bg-red-50/50'}`}
                        >
                          {item ? (
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-xs mt-1 text-gray-600">
                                {item.is_available ? 'Tersedia' : 'Tidak'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                              <span className="text-xs mt-1 text-gray-400">-</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Tidak Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span>Belum Ditetapkan</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Pilih mentor dan minggu</h3>
          <p className="mt-1 text-sm text-gray-500">Silakan pilih mentor dan minggu untuk melihat ketersediaan.</p>
        </div>
      )}
    </motion.div>
  );
};

export default KetersediaanMentorTab;