import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../Button';

const PengumumanTab = ({ pengumuman, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [newPengumuman, setNewPengumuman] = useState({
    judul: '',
    isi: '',
    tipe: 'info'
  });

  const handleCreatePengumuman = (e) => {
    e.preventDefault();
    if (!newPengumuman.judul.trim() || !newPengumuman.isi.trim()) {
      alert('Judul dan isi pengumuman harus diisi!');
      return;
    }

    // Implement create pengumuman logic here
    console.log('Create pengumuman:', newPengumuman);
    alert('Fitur buat pengumuman belum diimplementasi');
    
    setNewPengumuman({ judul: '', isi: '', tipe: 'info' });
    setShowForm(false);
  };

  const handleDeletePengumuman = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      // Implement delete pengumuman logic here
      console.log('Delete pengumuman:', id);
      alert('Fitur hapus pengumuman belum diimplementasi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol buat pengumuman */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pengumuman</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Buat Pengumuman
        </Button>
      </div>

      {/* Form buat pengumuman baru */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Buat Pengumuman Baru</h3>
          <form onSubmit={handleCreatePengumuman} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Judul</label>
              <input
                type="text"
                value={newPengumuman.judul}
                onChange={e => setNewPengumuman({ ...newPengumuman, judul: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                placeholder="Masukkan judul pengumuman"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Tipe</label>
              <select
                value={newPengumuman.tipe}
                onChange={e => setNewPengumuman({ ...newPengumuman, tipe: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="info">Info</option>
                <option value="warning">Peringatan</option>
                <option value="success">Berhasil</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Isi</label>
              <textarea
                value={newPengumuman.isi}
                onChange={e => setNewPengumuman({ ...newPengumuman, isi: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                rows={4}
                placeholder="Masukkan isi pengumuman"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Buat Pengumuman
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Daftar pengumuman */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Pengumuman</h3>
        
        {!pengumuman || pengumuman.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pengumuman</h3>
            <p className="text-gray-500 mb-6">Mulai dengan membuat pengumuman pertama Anda.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Pengumuman Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pengumuman && Array.from(pengumuman).map(p => (
              <motion.div 
                key={p.id} 
                whileHover={{ y: -2 }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
              >
                <div className={`p-4 ${
                  p.tipe === 'info' ? 'bg-blue-50 border-l-4 border-blue-400' :
                  p.tipe === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                  p.tipe === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                  'bg-red-50 border-l-4 border-red-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{p.judul}</h4>
                      <p className="text-gray-700 mb-3">{p.isi}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.tipe === 'info' ? 'bg-blue-100 text-blue-800' :
                          p.tipe === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          p.tipe === 'success' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {p.tipe}
                        </span>
                        <span>Dibuat: {new Date(p.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Edit pengumuman"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePengumuman(p.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Hapus pengumuman"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PengumumanTab;
