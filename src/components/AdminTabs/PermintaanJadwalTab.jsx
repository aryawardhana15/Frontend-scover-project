import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';

const PermintaanJadwalTab = ({ 
  permintaan, 
  onRefresh 
}) => {
  const handleApprove = (id) => {
    api.post(`/permintaan-jadwal/${id}/approve`)
      .then(() => {
        onRefresh();
        alert('Permintaan jadwal berhasil disetujui!');
      })
      .catch(err => {
        console.error('Error approving request:', err);
        alert('Gagal menyetujui permintaan: ' + (err.response?.data?.error || err.message));
      });
  };

  const handleReject = (id) => {
    api.post(`/permintaan-jadwal/${id}/reject`)
      .then(() => {
        onRefresh();
        alert('Permintaan jadwal berhasil ditolak!');
      })
      .catch(err => {
        console.error('Error rejecting request:', err);
        alert('Gagal menolak permintaan: ' + (err.response?.data?.error || err.message));
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">Permintaan Jadwal</h3>
      
      {!permintaan || permintaan.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <CheckIcon className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada permintaan jadwal</h3>
          <p className="text-gray-500">Semua permintaan jadwal sudah diproses.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 divide-y divide-gray-200">
              {permintaan && Array.from(permintaan).map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.mata_pelajaran_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.kelas_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(p.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.sesi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {p.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleReject(p.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                        >
                          <XMarkIcon className="h-4 w-4" />
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default PermintaanJadwalTab;
