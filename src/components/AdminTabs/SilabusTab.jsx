import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import api from '../../config/api';

const SilabusTab = ({ 
  silabus, 
  onRefresh 
}) => {
  const [newSilabus, setNewSilabus] = useState({ nama: '', deskripsi: '' });
  const [showSilabusForm, setShowSilabusForm] = useState(false);
  const [editingSilabus, setEditingSilabus] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleCreateSilabus = (e) => {
    e.preventDefault();
    if (!newSilabus.nama.trim() || !newSilabus.deskripsi.trim()) {
      alert('Nama dan deskripsi silabus harus diisi!');
      return;
    }

    api.post('/silabus', {
      nama: newSilabus.nama,
      deskripsi: newSilabus.deskripsi
    })
    .then(res => {
      console.log('✅ [SILABUS] Created successfully:', res.data);
      setNewSilabus({ nama: '', deskripsi: '' });
      setShowSilabusForm(false);
      onRefresh();
      alert('Silabus berhasil dibuat!');
    })
    .catch(err => {
      console.error('❌ [SILABUS] Create error:', err);
      alert('Gagal membuat silabus: ' + (err.response?.data?.error || err.message));
    });
  };

  const handleEditSilabus = (silabus) => {
    setEditingSilabus(silabus);
    setShowEditForm(true);
    setShowSilabusForm(false);
  };

  const handleUpdateSilabus = (e) => {
    e.preventDefault();
    if (!editingSilabus.nama.trim() || !editingSilabus.deskripsi.trim()) {
      alert('Nama dan deskripsi silabus harus diisi!');
      return;
    }

    api.put(`/silabus/${editingSilabus.id}`, {
      nama: editingSilabus.nama,
      deskripsi: editingSilabus.deskripsi
    })
    .then(res => {
      console.log('✅ [SILABUS] Updated successfully:', res.data);
      setNewSilabus({ nama: '', deskripsi: '' });
      setEditingSilabus(null);
      setShowEditForm(false);
      onRefresh();
      alert('Silabus berhasil diperbarui!');
    })
    .catch(err => {
      console.error('❌ [SILABUS] Update error:', err);
      alert('Gagal memperbarui silabus: ' + (err.response?.data?.error || err.message));
    });
  };

  const handleDeleteSilabus = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus silabus ini?')) {
      api.delete(`/silabus/${id}`)
        .then(() => {
          onRefresh();
          alert('Silabus berhasil dihapus!');
        })
        .catch(err => {
          console.error('❌ [SILABUS] Delete error:', err);
          alert('Gagal menghapus silabus: ' + (err.response?.data?.error || err.message));
        });
    }
  };

  const handleCancelEdit = () => {
    setEditingSilabus(null);
    setShowEditForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol buat silabus */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Silabus</h2>
        <Button
          onClick={() => {
            setShowSilabusForm(true);
            setShowEditForm(false);
            setEditingSilabus(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Buat Silabus Baru
        </Button>
      </div>

      {/* Form buat silabus baru */}
      {showSilabusForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Buat Silabus Baru</h3>
          <form onSubmit={handleCreateSilabus} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nama Silabus</label>
              <input
                type="text"
                value={newSilabus.nama}
                onChange={e => setNewSilabus({ ...newSilabus, nama: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                placeholder="Masukkan nama silabus"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={newSilabus.deskripsi}
                onChange={e => setNewSilabus({ ...newSilabus, deskripsi: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                rows={4}
                placeholder="Masukkan deskripsi silabus"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Buat Silabus
              </Button>
              <Button
                type="button"
                onClick={() => setShowSilabusForm(false)}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Form edit silabus */}
      {showEditForm && editingSilabus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Silabus</h3>
          <form onSubmit={handleUpdateSilabus} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nama Silabus</label>
              <input
                type="text"
                value={editingSilabus.nama}
                onChange={e => setEditingSilabus({ ...editingSilabus, nama: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={editingSilabus.deskripsi}
                onChange={e => setEditingSilabus({ ...editingSilabus, deskripsi: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                Update Silabus
              </Button>
              <Button
                type="button"
                onClick={handleCancelEdit}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Daftar silabus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Silabus</h3>
        
        {!silabus || silabus.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada silabus</h3>
            <p className="text-gray-500 mb-6">Mulai dengan membuat silabus pertama Anda.</p>
            <Button
              onClick={() => {
                setShowSilabusForm(true);
                setShowEditForm(false);
                setEditingSilabus(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Silabus Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {silabus && Array.from(silabus).map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.nama}</h4>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditSilabus(item)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Edit silabus"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSilabus(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Hapus silabus"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.deskripsi}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <Button size="xs" variant="outline">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SilabusTab;
