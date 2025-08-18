import { useState, useEffect } from 'react';
import api from '../api/axios';
import Button from './Button';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const LearningReportForm = ({ mentorId, onSuccess }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({
    hasil_belajar: '',
    materi_diajarkan: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (mentorId) {
      loadSessions();
    }
  }, [mentorId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jadwal-sesi?mentor_id=${mentorId}`);
      // Filter sessions that are completed or past due
      const completedSessions = response.data.filter(session => 
        session.status === 'completed' || new Date(session.tanggal) < new Date()
      );
      setSessions(completedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Gagal memuat data sesi');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setFormData({
      hasil_belajar: '',
      materi_diajarkan: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSession || !formData.hasil_belajar || !formData.materi_diajarkan) {
      setError('Semua field harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await api.post('/history-materi', {
        jadwal_sesi_id: selectedSession.id,
        hasil_belajar: formData.hasil_belajar,
        materi_diajarkan: formData.materi_diajarkan
      });

      setSuccess('Laporan pembelajaran berhasil disimpan!');
      setFormData({
        hasil_belajar: '',
        materi_diajarkan: ''
      });
      setSelectedSession(null);
      
      // Reload sessions
      loadSessions();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Gagal menyimpan laporan pembelajaran');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          Pilih Sesi untuk Laporan
        </h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Tidak ada sesi yang perlu dilaporkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionSelect(session)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedSession?.id === session.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {session.tanggal}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status === 'completed' ? 'Selesai' : 'Lewat'}
                  </span>
                </div>
                <p className="font-medium text-gray-800">Sesi {session.sesi}</p>
                <p className="text-sm text-gray-600">Kelas {session.kelas_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSession && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Laporan Pembelajaran - Sesi {selectedSession.sesi} ({selectedSession.tanggal})
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materi yang Diajarkan *
              </label>
              <textarea
                name="materi_diajarkan"
                value={formData.materi_diajarkan}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jelaskan materi apa yang diajarkan dalam sesi ini..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hasil Pembelajaran *
              </label>
              <textarea
                name="hasil_belajar"
                value={formData.hasil_belajar}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jelaskan hasil pembelajaran yang dicapai..."
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <XCircleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircleIcon className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Laporan'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedSession(null);
                  setFormData({
                    hasil_belajar: '',
                    materi_diajarkan: ''
                  });
                  setError('');
                  setSuccess('');
                }}
                className="border-gray-300 hover:bg-gray-50"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LearningReportForm;
