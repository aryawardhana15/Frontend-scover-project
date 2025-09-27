import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../config/api';

const JadwalSesiTab = ({ 
  jadwal, 
  kelasMap, 
  mentorMap, 
  mapelMap, 
  mentors, 
  kelas, 
  mapel,
  onRefresh 
}) => {
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedSesi, setSelectedSesi] = useState('1');
  const [mentorOptions, setMentorOptions] = useState([]);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  // Helper function to get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    if (!selectedMapel || !selectedTanggal || !selectedSesi || !selectedKelas) {
      setMentorOptions([]);
      setSelectedMentor('');
      return;
    }
    
    setMentorOptionsLoading(true);
    api.get(`/mentors/available?mapel_id=${selectedMapel}&tanggal=${selectedTanggal}&sesi=${selectedSesi}&kelas_id=${selectedKelas}`)
      .then(res => {
        setMentorOptions(res.data);
      })
      .catch(err => {
        console.error('Error fetching available mentors:', err);
        setMentorOptions([]);
      })
      .finally(() => {
        setMentorOptionsLoading(false);
      });
  }, [selectedMapel, selectedTanggal, selectedSesi, selectedKelas]);

  const handleAssignJadwal = (e) => {
    e.preventDefault();
    
    // Validasi sederhana tanpa fungsi kompleks
    if (!selectedTanggal) {
      setAssignError('Tanggal harus dipilih');
      return;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(selectedTanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setAssignError('Tanggal tidak boleh di masa lalu');
      return;
    }
    
    setAssignError('');
    setAssignSuccess('');
    setAssignLoading(true);
    
    api.post('/jadwal-sesi', {
      kelas_id: selectedKelas,
      mentor_id: selectedMentor,
      tanggal: selectedTanggal,
      sesi: selectedSesi,
      mata_pelajaran_id: selectedMapel
    })
    .then(res => {
      setAssignSuccess('Jadwal berhasil ditambahkan!');
      setSelectedMentor('');
      setSelectedKelas('');
      setSelectedMapel('');
      setSelectedTanggal('');
      setSelectedSesi('1');
      onRefresh();
    })
    .catch(err => {
      setAssignError(err.response?.data?.error || 'Gagal menambahkan jadwal');
    })
    .finally(() => {
      setAssignLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Tambah Jadwal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Jadwal Sesi</h3>
        
        <form onSubmit={handleAssignJadwal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Kelas</label>
            <select 
              value={selectedKelas} 
              onChange={e => setSelectedKelas(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              required
            >
              <option value="">-- Pilih Kelas --</option>
              {kelas && Array.from(kelas).map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Mata Pelajaran</label>
            <select 
              value={selectedMapel} 
              onChange={e => setSelectedMapel(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              required
            >
              <option value="">-- Pilih Mapel --</option>
              {mapel && Array.from(mapel).map(mp => <option key={mp.id} value={mp.id}>{mp.nama}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal</label>
            <input 
              type="date" 
              value={selectedTanggal} 
              onChange={e => {
                console.log('Date changed:', e.target.value);
                setSelectedTanggal(e.target.value);
                setAssignError(''); // Clear errors
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              required 
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Sesi</label>
            <select 
              value={selectedSesi} 
              onChange={e => setSelectedSesi(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              required
            >
              {Array.from([1, 2, 3, 4, 5]).map(s => <option key={s} value={s}>Sesi {s}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Mentor</label>
            <select
              value={selectedMentor}
              onChange={e => setSelectedMentor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              required
              disabled={mentorOptionsLoading}
            >
              <option value="">
                {mentorOptionsLoading
                  ? "-- Loading mentor..."
                  : mentorOptions.length === 0
                    ? "-- Tidak ada mentor tersedia --"
                    : "-- Pilih Mentor --"
                }
              </option>
              {mentorOptions && Array.from(mentorOptions).map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
            {mentorOptions.length === 0 && !mentorOptionsLoading && selectedMapel && selectedTanggal && selectedSesi && selectedKelas && (
              <div className="mt-2 text-sm text-amber-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Tidak ada mentor yang tersedia untuk kriteria ini
              </div>
            )}
          </div>
          
          <div className="md:col-span-3">
            {assignError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {assignError}
              </div>
            )}
            {assignSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {assignSuccess}
              </div>
            )}
            <button
              type="submit"
              disabled={assignLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {assignLoading ? 'Menambahkan...' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Daftar Jadwal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Jadwal Sesi</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 divide-y divide-gray-200">
              {jadwal && Array.from(jadwal).map(j => (
                <tr key={j.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {kelasMap[j.kelas_id] || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mapelMap[j.mata_pelajaran_id] || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mentorMap[j.mentor_id] || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateForDisplay(j.tanggal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {j.sesi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      j.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      j.status === 'approved' ? 'bg-green-100 text-green-800' :
                      j.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default JadwalSesiTab;
