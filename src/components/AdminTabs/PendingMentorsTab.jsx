import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';

const PendingMentorsTab = ({ pendingMentors, onRefresh }) => {
  const handleApproveMentor = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menyetujui mentor ini?')) {
      api.put(`/admin/mentors/${id}/approve`)
        .then(() => {
          onRefresh();
          alert('Mentor berhasil disetujui!');
        })
        .catch(err => {
          console.error('Error approving mentor:', err);
          alert('Gagal menyetujui mentor: ' + (err.response?.data?.error || err.message));
        });
    }
  };

  const handleRejectMentor = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menolak mentor ini?')) {
      api.put(`/admin/mentors/${id}/reject`)
        .then(() => {
          onRefresh();
          alert('Mentor berhasil ditolak!');
        })
        .catch(err => {
          console.error('Error rejecting mentor:', err);
          alert('Gagal menolak mentor: ' + (err.response?.data?.error || err.message));
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">Mentor Menunggu Persetujuan</h3>
      
      {!pendingMentors || pendingMentors.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <CheckIcon className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada mentor yang menunggu persetujuan</h3>
          <p className="text-gray-500">Semua mentor sudah diproses atau belum ada yang mendaftar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingMentors && Array.from(pendingMentors).map((mentor) => (
            <div key={mentor.id} className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-full">
                    <AcademicCapIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{mentor.nama}</h4>
                    <p className="text-sm text-gray-500">{mentor.email}</p>
                    <p className="text-xs text-gray-400">
                      Mendaftar: {new Date(mentor.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveMentor(mentor.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleRejectMentor(mentor.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PendingMentorsTab;
