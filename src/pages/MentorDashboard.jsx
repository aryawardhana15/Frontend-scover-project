import { useEffect, useState } from 'react';
import api from '../config/api';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import MentorProfile from './MentorProfile';
import PengumumanCarousel from '../components/PengumumanCarousel';
import Chat from '../components/Chat';
import { toast } from 'react-toastify';
import { getCurrentWeekNumber, getWeekRange } from '../utils/dateUtils';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

const WEEK_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESI_LABELS = ['1', '2', '3', '4', '5'];

function AvailabilityGrid({ mentorId, mingguKe, onSuccess }) {
  const [data, setData] = useState(() => {
    // Initialize with default grid
    const arr = [];
    for (let h of WEEK_LABELS) {
      for (let s of SESI_LABELS) {
        arr.push({
          hari: h,
          sesi: s,
          is_available: true,
          reason: '',
          kelas_id: null
        });
      }
    }
    return arr;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const generateDefaultGrid = () => {
    const arr = [];
    for (let h of WEEK_LABELS) {
      for (let s of SESI_LABELS) {
        arr.push({
          hari: h,
          sesi: s,
          is_available: true,
          reason: '',
          kelas_id: null
        });
      }
    }
    return arr;
  };

  useEffect(() => {
    if (!mentorId || !mingguKe) {
      console.log('⚠️ [AVAILABILITY GRID] No mentorId or mingguKe, skipping fetch');
      return;
    }
    console.log('🔄 [AVAILABILITY GRID] Fetching availability for mentorId:', mentorId, 'mingguKe:', mingguKe);
    setLoading(true);
    setError(null);
    
    api.get(`/availability-mentor?mentor_id=${mentorId}&minggu_ke=${mingguKe}`)
      .then(res => {
        console.log('✅ [AVAILABILITY GRID] API response:', res.data);
        let avail = generateDefaultGrid();
        console.log('📋 [AVAILABILITY GRID] Default grid generated:', avail.length, 'items');
        
        if (res.data && res.data.length > 0) {
          avail = avail.map(item => {
            const found = res.data.find(d => d.hari === item.hari && d.sesi === item.sesi);
            return found ? { ...item, ...found, is_available: !!found.is_available } : item;
          });
          console.log('🔄 [AVAILABILITY GRID] Grid updated with API data');
        } else {
          console.log('📋 [AVAILABILITY GRID] Using default grid (no API data)');
        }
        
        setData(avail);
        setLoading(false);
        console.log('✅ [AVAILABILITY GRID] Final data set:', avail.length, 'items');
        console.log('📋 [AVAILABILITY GRID] Sample data:', avail.slice(0, 3));
      })
      .catch(err => {
        console.error('❌ [AVAILABILITY GRID] Error fetching data:', err);
        setError('Gagal mengambil data availability');
        setLoading(false);
        // Keep default grid even on error
        const defaultGrid = generateDefaultGrid();
        setData(defaultGrid);
        console.log('📋 [AVAILABILITY GRID] Using default grid due to error');
      });
  }, [mentorId, mingguKe]);

  const handleCheck = (hari, sesi, checked) => {
    console.log('🔄 [AVAILABILITY GRID] handleCheck called:', { hari, sesi, checked });
    setData(prev => {
      const idx = prev.findIndex(item => item.hari === hari && item.sesi === sesi);
      console.log('🔍 [AVAILABILITY GRID] Found item at index:', idx);
      if (idx === -1) {
        console.log('⚠️ [AVAILABILITY GRID] Item not found, returning previous data');
        return prev;
      }
      const newArr = [...prev];
      newArr[idx] = { ...newArr[idx], is_available: checked };
      console.log('✅ [AVAILABILITY GRID] Updated item:', newArr[idx]);
      return newArr;
    });
  };

  const handleSubmit = () => {
    if (!mentorId || !mingguKe || !Array.isArray(data)) {
      setError('Data tidak lengkap. Silakan cek kembali.');
      return;
    }
    setLoading(true);
    setError(null);
    setConflicts([]);
    api.post('/availability-mentor', {
      mentor_id: mentorId,
      minggu_ke: mingguKe,
      data
    })
      .then(() => {
        setLoading(false);
        onSuccess && onSuccess();
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.conflicts) {
          setConflicts(err.response.data.conflicts);
        } else if (err.response && err.response.data && err.response.data.error) {
          setError('Gagal menyimpan data: ' + err.response.data.error);
        } else {
          setError('Gagal menyimpan data');
        }
      });
  };

  const year = new Date().getFullYear();
  const [weekStart, weekEnd] = getWeekRange(mingguKe, year);
  const monthLabel = weekStart.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const today = new Date();

  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Atur Ketersediaan Mingguan</h2>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
              <p className="text-sm text-gray-600">Pilih sesi yang tersedia untuk mengajar</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-indigo-600">Minggu ke-{mingguKe}</p>
            <p className="text-xs text-gray-500">{weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mb-4"></div>
              <p className="text-gray-500">Memuat ketersediaan...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                  <th className="p-4 font-semibold text-left rounded-tl-lg">Sesi/Hari</th>
                  {WEEK_LABELS.map((h, idx) => {
                    const tgl = new Date(weekStart);
                    tgl.setDate(weekStart.getDate() + idx);
                    const isToday = tgl.toDateString() === today.toDateString();
                    return (
                      <th key={h} className={`p-4 font-semibold text-center ${isToday ? 'bg-yellow-400 text-gray-800' : ''}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{h.substring(0, 3)}</span>
                          <span className="text-xs font-light">{tgl.getDate()}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {SESI_LABELS.map((sesi, sesiIdx) => (
                  <tr key={sesi} className={`${sesiIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 font-medium text-gray-700">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Sesi {sesi}
                      </div>
                    </td>
                    {WEEK_LABELS.map(hari => {
                      const item = data.find(d => d.hari === hari && d.sesi === sesi);
                      const isChecked = item?.is_available || false;
                      
                      // Debug logging for first few items
                      if (sesi === '1' && hari === 'Senin') {
                        console.log('🔍 [AVAILABILITY GRID] Render debug:', { 
                          hari, 
                          sesi, 
                          item, 
                          isChecked,
                          dataLength: data.length 
                        });
                      }
                      
                      return (
                        <td key={`${hari}-${sesi}`} className="p-4 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox h-6 w-6 text-indigo-600 rounded-md border-2 border-gray-300 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
                              checked={isChecked}
                              onChange={e => handleCheck(hari, sesi, e.target.checked)}
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {conflicts.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Konflik Jadwal Ditemukan</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {conflicts.map((c, i) => (
                          <li key={i}>{c.type === 'double_booking' ? `Double booking di ${c.tanggal} sesi ${c.sesi}` : `Kelas sama 2x di hari yang sama (${c.tanggal})`}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleSubmit} 
                variant="primary" 
                disabled={loading}
                className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Ketersediaan
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function MentorDashboard({ user, onLogout, onProfileUpdate }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const mentorId = user?.id !== undefined ? user.id : user?.mentor_id;
  
  // Debug logging
  console.log('🔍 [MENTOR DASHBOARD] User data:', user);
  console.log('🔍 [MENTOR DASHBOARD] Mentor ID:', mentorId);
  const [mingguKe, setMingguKe] = useState(getCurrentWeekNumber());
  const [shownNotifIds, setShownNotifIds] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [loadingJadwal, setLoadingJadwal] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [hasilBelajar, setHasilBelajar] = useState('');
  const [materiDiajarkan, setMateriDiajarkan] = useState('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jadwal');
  const [learningReports, setLearningReports] = useState([]);
  const [loadingLearningReports, setLoadingLearningReports] = useState(false);
  const [mentorMataPelajaran, setMentorMataPelajaran] = useState([]);
  const [allMataPelajaran, setAllMataPelajaran] = useState([]);
  const [loadingMataPelajaran, setLoadingMataPelajaran] = useState(false);
  const [selectedMataPelajaran, setSelectedMataPelajaran] = useState('');

  // Initial data loading like AdminDashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 [MENTOR DASHBOARD] Token:', token ? token.substring(0, 20) + '...' : 'none');
    if (!token) {
      console.warn('⚠️ [MENTOR DASHBOARD] No token found, redirecting to login...');
      window.location.href = '/login';
      return;
    }

    if (!mentorId) {
      console.log('⚠️ [MENTOR DASHBOARD] No mentorId, skipping initial data fetch');
      return;
    }

    const fetchInitialData = async () => {
      try {
        console.log('🔍 [MENTOR DASHBOARD] Fetching initial data for mentorId:', mentorId);
        const [
          jadwalRes,
          notifRes,
          mataPelajaranRes,
          mentorMataPelajaranRes
        ] = await Promise.all([
          api.get(`/mentors/${mentorId}/jadwal`),
          api.get('/notifikasi'),
          api.get('/mata-pelajaran'),
          api.get(`/mentor-mata-pelajaran/by-mentor?mentor_id=${mentorId}`)
        ]);
        
        setJadwal(jadwalRes.data);
        setAllMataPelajaran(mataPelajaranRes.data);
        setMentorMataPelajaran(mentorMataPelajaranRes.data);
        
        // Handle notifications
        const notifMentor = notifRes.data.filter(n => n.user_id === mentorId);
        notifMentor.forEach(n => {
          if (!shownNotifIds.includes(n.id)) {
            toast.info(n.pesan);
            setShownNotifIds(prev => [...prev, n.id]);
          }
        });
        
        console.log('✅ [MENTOR DASHBOARD] Initial data fetched successfully');
      } catch (error) {
        console.error('❌ [MENTOR DASHBOARD] Error fetching initial data:', error);
        if (error.response?.status === 401) {
          console.warn('⚠️ [MENTOR DASHBOARD] Unauthorized, redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    fetchInitialData();
  }, [mentorId, shownNotifIds]);

  // Notification polling (separate from initial load)
  useEffect(() => {
    if (!mentorId) return;
    let interval;
    const fetchNotif = async () => {
      try {
        const res = await api.get(`/notifikasi`);
        const notifMentor = res.data.filter(n => n.user_id === mentorId);
        notifMentor.forEach(n => {
          if (!shownNotifIds.includes(n.id)) {
            toast.info(n.pesan);
            setShownNotifIds(prev => [...prev, n.id]);
          }
        });
      } catch (err) {
        // silent
      }
    };
    // Start polling after initial load
    interval = setInterval(fetchNotif, 10000);
    return () => clearInterval(interval);
  }, [mentorId, shownNotifIds]);

  const handleOpenHistoryModal = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setSelectedJadwal(null);
    setHasilBelajar('');
    setMateriDiajarkan('');
    setIsHistoryModalOpen(false);
  };

  const handleSubmitHistory = () => {
    if (!hasilBelajar.trim() || !materiDiajarkan.trim()) {
      toast.error('Hasil belajar dan materi diajarkan wajib diisi.');
      return;
    }
    api.post('/history-materi', {
      jadwal_sesi_id: selectedJadwal.id,
      hasil_belajar: hasilBelajar,
      materi_diajarkan: materiDiajarkan,
    })
    .then(() => {
      setJadwal(prev => prev.map(j => j.id === selectedJadwal.id ? { ...j, status: 'completed' } : j));
      handleCloseHistoryModal();
      toast.success('Laporan belajar berhasil disimpan.');
      // Optionally refetch learning reports if the tab is active
      if (activeTab === 'laporan') {
        fetchLearningReports();
      }
    })
    .catch(() => {
      toast.error('Gagal menyimpan laporan belajar.');
    });
  };

  const handleOpenChat = async () => {
    try {
      // Mentors initiate conversation with an admin.
      // The backend will find or create a conversation with the first available admin.
      const response = await api.post('/chat/conversations/findOrCreate');
      // The Chat component now handles conversation loading internally,
      // so we just need to open the modal.
      setShowChat(true);
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Gagal membuka chat. Silakan coba lagi.');
    }
  };

  const fetchLearningReports = () => {
    if (!mentorId) return;
    setLoadingLearningReports(true);
    api.get(`/history-materi/mentor/${mentorId}`)
      .then(res => {
        setLearningReports(res.data);
        setLoadingLearningReports(false);
      })
      .catch(() => {
        toast.error('Gagal memuat laporan pembelajaran.');
        setLoadingLearningReports(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'laporan' && mentorId) {
      fetchLearningReports();
    }
  }, [activeTab, mentorId]);

  // Fetch mata pelajaran data (simplified since initial data already loaded)
  const fetchMataPelajaran = () => {
    if (!mentorId) return;
    setLoadingMataPelajaran(true);
    
    // Only fetch mentor's current mata pelajaran (all mata pelajaran already loaded)
    api.get(`/mentor-mata-pelajaran/by-mentor?mentor_id=${mentorId}`)
      .then(res => {
        setMentorMataPelajaran(res.data);
        setLoadingMataPelajaran(false);
      })
      .catch(() => {
        toast.error('Gagal memuat mata pelajaran mentor');
        setLoadingMataPelajaran(false);
      });
  };

  // Add mata pelajaran to mentor
  const handleAddMataPelajaran = () => {
    if (!selectedMataPelajaran) {
      toast.error('Pilih mata pelajaran terlebih dahulu');
      return;
    }
    
    // Check if already exists
    const exists = mentorMataPelajaran.find(mp => mp.mata_pelajaran_id == selectedMataPelajaran);
    if (exists) {
      toast.error('Mata pelajaran sudah ditambahkan');
      return;
    }
    
    api.post('/mentor-mata-pelajaran', {
      mentor_id: mentorId,
      mata_pelajaran_id: selectedMataPelajaran
    })
    .then(() => {
      toast.success('Mata pelajaran berhasil ditambahkan');
      fetchMataPelajaran(); // Refresh data
      setSelectedMataPelajaran('');
    })
    .catch(err => {
      const errorMsg = err.response?.data?.error || 'Gagal menambahkan mata pelajaran';
      toast.error(errorMsg);
    });
  };

  // Remove mata pelajaran from mentor
  const handleRemoveMataPelajaran = (id) => {
    api.delete(`/mentor-mata-pelajaran/${id}`)
    .then(() => {
      toast.success('Mata pelajaran berhasil dihapus');
      fetchMataPelajaran(); // Refresh data
    })
    .catch(err => {
      const errorMsg = err.response?.data?.error || 'Gagal menghapus mata pelajaran';
      toast.error(errorMsg);
    });
  };

  useEffect(() => {
    if (activeTab === 'mata-pelajaran' && mentorId) {
      fetchMataPelajaran();
    }
  }, [activeTab, mentorId]);

  if (showProfile) {
    return <MentorProfile user={user} onBack={() => setShowProfile(false)} onProfileUpdate={onProfileUpdate} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user={user} onLogout={onLogout} onProfile={() => setShowProfile(true)} />
      
      <PageContainer>
        <PengumumanCarousel />
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('jadwal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jadwal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Jadwal Mengajar
              </button>
              <button
                onClick={() => setActiveTab('laporan')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'laporan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Laporan Pembelajaran
              </button>
              <button
                onClick={() => setActiveTab('ketersediaan')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ketersediaan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ketersediaan
              </button>
              <button
                onClick={() => setActiveTab('mata-pelajaran')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mata-pelajaran'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mata Pelajaran
              </button>
            </nav>
          </div>
        </div>
        
        {/* Floating Chat Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleOpenChat}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
          </button>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <Chat isOpen={showChat} onClose={() => setShowChat(false)} />
        )}

        {/* Tab Content */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl shadow-md mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Selamat Datang, {user.nama}!</h1>
                  <p className="text-gray-600 mt-1">Kelola jadwal mengajar dan ketersediaan Anda dengan mudah</p>
                </div>
              </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-sm text-gray-500">Total Kelas</p>
              <p className="text-2xl font-bold text-indigo-600">{jadwal.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
              <p className="text-sm text-gray-500">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{jadwal.filter(j => j.status === 'completed').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100">
              <p className="text-sm text-gray-500">Minggu Ini</p>
              <p className="text-2xl font-bold text-yellow-600">{jadwal.filter(j => {
                const classDate = new Date(j.tanggal);
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return classDate >= weekStart && classDate <= weekEnd;
              }).length}</p>
            </div>
          </div>
        </div>
        
        <Card className="mb-8 border-0 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Jadwal Mengajar</h2>
                <p className="text-sm text-gray-500 mt-1">Daftar kelas yang akan Anda ajar</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Ekspor
                </Button>
              </div>
            </div>
            
            {loadingJadwal ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <p className="text-gray-500">Memuat jadwal...</p>
                </div>
              </div>
            ) : jadwal.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada jadwal</h3>
                <p className="mt-1 text-sm text-gray-500">Anda belum memiliki jadwal mengajar yang dijadwalkan.</p>
                <div className="mt-6">
                  <Button variant="primary">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Buat Jadwal Baru
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jadwal.map((j) => (
                      <tr key={j.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{j.tanggal}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">{j.nama_kelas.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{j.nama_kelas}</div>
                              <div className="text-sm text-gray-500">{j.mata_pelajaran}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Sesi {j.sesi}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{j.jam_mulai}</span> - <span className="font-medium">{j.jam_selesai}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            j.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            j.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {j.status === 'scheduled' ? 'Terjadwal' : j.status === 'completed' ? 'Selesai' : j.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {j.status === 'scheduled' && new Date(j.tanggal) < new Date() && (
                            <Button size="sm" onClick={() => handleOpenHistoryModal(j)}>
                              Isi Laporan
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
          </div>
        )}
        
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-md mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Laporan Pembelajaran</h1>
                  <p className="text-gray-600 mt-1">Buat laporan pembelajaran untuk sesi yang telah selesai</p>
                </div>
              </div>
            </div>
            
            <Card className="mb-8 border-0 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Riwayat Laporan Pembelajaran</h2>
                    <p className="text-sm text-gray-500 mt-1">Daftar laporan pembelajaran yang telah Anda buat</p>
                  </div>
                </div>

                {loadingLearningReports ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                      <p className="text-gray-500">Memuat laporan pembelajaran...</p>
                    </div>
                  </div>
                ) : learningReports.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada laporan pembelajaran</h3>
                    <p className="mt-1 text-sm text-gray-500">Anda belum membuat laporan pembelajaran untuk sesi yang telah selesai.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materi Diajarkan</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil Belajar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {learningReports.map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{report.tanggal}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{report.nama_kelas}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{report.nama_mapel}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Sesi {report.sesi}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 line-clamp-2">{report.materi_diajarkan}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 line-clamp-2">{report.hasil_belajar}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'ketersediaan' && (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ketersediaan Mengajar</h2>
                  <p className="text-sm text-gray-500 mt-1">Atur waktu yang tersedia untuk mengajar minggu ini</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Button 
                    onClick={() => setMingguKe(mingguKe - 1)} 
                    disabled={mingguKe <= 1} 
                    size="sm" 
                    variant="outline"
                    className="border-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      type="number" 
                      min={1} 
                      max={53} 
                      value={mingguKe} 
                      onChange={e => setMingguKe(Number(e.target.value))} 
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                  </div>
                  <Button 
                    onClick={() => setMingguKe(mingguKe + 1)} 
                    size="sm" 
                    variant="outline"
                    className="border-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              <AvailabilityGrid 
                mentorId={mentorId} 
                mingguKe={mingguKe} 
                onSuccess={() => toast.success('Ketersediaan berhasil disimpan!', {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })} 
              />
            </div>
          </div>
        )}

        {activeTab === 'mata-pelajaran' && (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-md mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Mata Pelajaran</h1>
                  <p className="text-gray-600 mt-1">Kelola mata pelajaran yang dapat Anda ajarkan</p>
                </div>
              </div>
            </div>

            {/* Add Mata Pelajaran Section */}
            <Card className="mb-8 border-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Tambah Mata Pelajaran</h2>
                    <p className="text-sm text-gray-600 mt-1">Pilih mata pelajaran yang dapat Anda ajarkan</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <select
                      value={selectedMataPelajaran}
                      onChange={(e) => setSelectedMataPelajaran(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="">Pilih mata pelajaran...</option>
                      {allMataPelajaran
                        .filter(mp => !mentorMataPelajaran.find(mmp => mmp.mata_pelajaran_id == mp.id))
                        .map(mp => (
                          <option key={mp.id} value={mp.id}>
                            {mp.nama}
                          </option>
                        ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleAddMataPelajaran}
                    disabled={!selectedMataPelajaran}
                    variant="primary"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tambah
                  </Button>
                </div>
              </div>
            </Card>

            {/* Current Mata Pelajaran */}
            <Card className="mb-8 border-0 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mata Pelajaran Saya</h2>
                    <p className="text-sm text-gray-500 mt-1">Daftar mata pelajaran yang dapat Anda ajarkan</p>
                  </div>
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <p className="text-sm font-semibold text-purple-600">{mentorMataPelajaran.length} Mata Pelajaran</p>
                  </div>
                </div>

                {loadingMataPelajaran ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 bg-purple-200 rounded-full mb-4"></div>
                      <p className="text-gray-500">Memuat mata pelajaran...</p>
                    </div>
                  </div>
                ) : mentorMataPelajaran.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada mata pelajaran</h3>
                    <p className="mt-1 text-sm text-gray-500">Tambahkan mata pelajaran yang dapat Anda ajarkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentorMataPelajaran.map((mp) => (
                      <div key={mp.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{mp.mata_pelajaran_nama || mp.nama}</h3>
                              <p className="text-sm text-gray-500">Mata Pelajaran</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMataPelajaran(mp.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                            title="Hapus mata pelajaran"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* History Modal */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Laporan Hasil Belajar</h2>
                <p className="text-sm text-gray-600">
                  Kelas: {selectedJadwal.nama_kelas} - {selectedJadwal.tanggal}
                </p>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="materiDiajarkan" className="block text-sm font-medium text-gray-700 mb-1">Materi Diajarkan</label>
                  <textarea
                    id="materiDiajarkan"
                    value={materiDiajarkan}
                    onChange={(e) => setMateriDiajarkan(e.target.value)}
                    placeholder="Tuliskan materi yang telah diajarkan..."
                    className="w-full border rounded p-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="hasilBelajar" className="block text-sm font-medium text-gray-700 mb-1">Hasil Belajar</label>
                  <textarea
                    id="hasilBelajar"
                    value={hasilBelajar}
                    onChange={(e) => setHasilBelajar(e.target.value)}
                    placeholder="Tuliskan hasil belajar siswa..."
                    className="w-full border rounded p-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="secondary" onClick={handleCloseHistoryModal}>Batal</Button>
                <Button onClick={handleSubmitHistory}>Simpan</Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
