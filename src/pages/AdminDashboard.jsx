import { useEffect, useState } from 'react';
import api from '../config/api';
import Card from '../components/Card';
import Button from '../components/Button';
import PageContainer from '../components/PageContainer';
import Header from '../components/Header';
import { getWeekRange } from '../utils/dateUtils';
import { 
  CalendarIcon, ClockIcon, UserGroupIcon, BookOpenIcon, 
  ArrowPathIcon, BellIcon, UserIcon, MegaphoneIcon,
  CheckCircleIcon, XCircleIcon, TrashIcon, PlusIcon,
  DocumentTextIcon, PhotoIcon, AcademicCapIcon, ChartBarIcon,
  ClipboardDocumentIcon, PuzzlePieceIcon, LightBulbIcon,
  BookmarkIcon, ChartPieIcon, TableCellsIcon, ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon, PencilIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

const TABS = [
  { key: 'jadwal', label: 'Jadwal Sesi', icon: CalendarIcon, color: 'from-blue-500 to-indigo-600' },
  { key: 'permintaan', label: 'Permintaan Jadwal', icon: ArrowPathIcon, color: 'from-amber-500 to-yellow-600' },
  { key: 'availability', label: 'Ketersediaan', icon: ClockIcon, color: 'from-indigo-500 to-purple-600' },
  { key: 'silabus', label: 'Silabus', icon: BookOpenIcon, color: 'from-cyan-500 to-sky-600' },
  { key: 'history', label: 'History Materi', icon: ClipboardDocumentIcon, color: 'from-emerald-500 to-teal-600' },
  { key: 'mentor-approval', label: 'Mentor Approval', icon: AcademicCapIcon, color: 'from-orange-500 to-red-600' },
  { key: 'notifikasi', label: 'Notifikasi', icon: BellIcon, color: 'from-pink-500 to-rose-600' },
  { key: 'users', label: 'Pengguna', icon: UserGroupIcon, color: 'from-green-500 to-teal-600' },
  { key: 'pengumuman', label: 'Pengumuman', icon: MegaphoneIcon, color: 'from-purple-500 to-pink-600' },
  { key: 'analytics', label: 'Analytics', icon: ChartBarIcon, color: 'from-violet-500 to-fuchsia-600' },
];

const WEEK_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESI_LABELS = ['1', '2', '3', '4', '5'];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

function AvailabilityGrid({ mentorId, mingguKe, setMingguKe }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mentorId || !mingguKe) return;
    setLoading(true);
    api.get(`/availability-mentor?mentor_id=${mentorId}&minggu_ke=${mingguKe}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mentorId, mingguKe]);

  const year = new Date().getFullYear();
  const [weekStart, weekEnd] = getWeekRange(mingguKe, year);
  const today = new Date();

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Ketersediaan Minggu ke-{mingguKe}</h3>
          <p className="text-sm text-gray-600">
            {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => mingguKe > 1 && setMingguKe(mingguKe - 1)} 
            size="sm" 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ArrowPathIcon className="h-4 w-4 rotate-90" />
          </Button>
          <Button 
            onClick={() => setMingguKe(mingguKe + 1)} 
            size="sm" 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ArrowPathIcon className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4 flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-gray-500">Memuat ketersediaan...</p>
          </div>
        </div>
      ) : (
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
                      scope="col" 
                      className={`px-4 py-3 text-center text-sm font-medium ${isToday ? 'bg-yellow-400 text-gray-800' : ''}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{h.substring(0, 3)}</span>
                        <span className="text-xs font-light">{tgl.getDate()}</span>
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
                        {item?.is_available ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('jadwal');
  const [jadwal, setJadwal] = useState([]);
  const [permintaan, setPermintaan] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [mentorMap, setMentorMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedSesi, setSelectedSesi] = useState('1');
  const [mentorOptions, setMentorOptions] = useState([]);

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
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [mingguKe, setMingguKe] = useState(1);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [silabus, setSilabus] = useState([]);
  const [stats, setStats] = useState({
    total_user: 0,
    total_mentor: 0,
    total_kelas: 0,
    total_sesi_scheduled: 0,
    total_permintaan_pending: 0,
    total_mapel: 0,
  });
  const [sessionStats, setSessionStats] = useState({
    total_sessions: 0,
    completed_sessions: 0,
    upcoming_sessions: 0,
    pending_sessions: 0
  });
  const [pendingMentors, setPendingMentors] = useState([]);
  const [loadingPendingMentors, setLoadingPendingMentors] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMentorToReject, setSelectedMentorToReject] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error'
  const [pengumuman, setPengumuman] = useState([]);
  const [newPengumuman, setNewPengumuman] = useState({ judul: '', isi: '' });
  const [pengumumanFile, setPengumumanFile] = useState(null);
  const [newSilabus, setNewSilabus] = useState({ nama: '', deskripsi: '' });
  const [showSilabusForm, setShowSilabusForm] = useState(false);
  const [editingSilabus, setEditingSilabus] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [historyMateri, setHistoryMateri] = useState([]);

  // Check server status with enhanced logging
  const checkServerStatus = async () => {
    try {
      setServerStatus('checking');
      console.log('\n🏥 ====== CHECKING SERVER STATUS ======');
      const response = await api.get('/debug/health');
      console.log('✅ [SERVER STATUS] Health check response:', response.data);
      if (response.status === 200) {
        setServerStatus('online');
        console.log('✅ [SERVER STATUS] Server is online');
      }
    } catch (error) {
      console.error('❌ [SERVER STATUS] Server check failed:', error);
      console.error('❌ [SERVER STATUS] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      if (error.response?.status === 503) {
        setServerStatus('offline');
      } else {
        setServerStatus('error');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 [DASHBOARD] Token:', token ? token.substring(0, 20) + '...' : 'none');
    if (!token) {
      console.warn('⚠️ [DASHBOARD] No token found, redirecting to login...');
      window.location.href = '/login';
      return;
    }

    // Check server status first
    checkServerStatus();

    const fetchData = async () => {
      try {
        console.log('🔍 [DASHBOARD] Fetching initial data...');
        const [
          currentWeekRes,
          statsRes,
          sessionStatsRes,
          historyMateriRes
        ] = await Promise.all([
          api.get('/admin/current-week'),
          api.get('/admin/stats'),
          api.get('/jadwal-sesi/admin-stats'),
          api.get('/history-materi')
        ]);
        
        setCurrentWeek(currentWeekRes.data.weekNumber);
        setStats(statsRes.data);
        setSessionStats(sessionStatsRes.data);
        setHistoryMateri(historyMateriRes.data);
        
        console.log('✅ [DASHBOARD] Initial data fetched successfully');
      } catch (error) {
        console.error('❌ [DASHBOARD] Error fetching initial data:', error);
        console.error('❌ [DASHBOARD] Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        if (error.response?.status === 503) {
          console.warn('⚠️ [DASHBOARD] Server unavailable (503)');
          alert('Server sedang sibuk. Silakan refresh halaman atau coba lagi nanti.');
        } else if (error.response?.status === 401) {
          console.warn('⚠️ [DASHBOARD] Unauthorized, redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (error.code === 'ERR_NETWORK') {
          console.warn('⚠️ [DASHBOARD] Network error - server may be down');
          alert('Tidak dapat terhubung ke server. Pastikan server backend berjalan.');
        }
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
    setLoading(true);
      try {
        console.log('🔍 [DASHBOARD] Fetching all data...');
        const [
          kelasRes,
          mentorRes,
          jadwalRes,
          permintaanRes,
          mapelRes,
          usersRes,
          silabusRes,
          historyRes,
          pengumumanRes
        ] = await Promise.all([
      api.get('/kelas'),
      api.get('/mentors'),
      api.get('/jadwal-sesi'),
      api.get('/permintaan-jadwal'),
      api.get('/mata-pelajaran'),
      api.get('/users'),
      api.get('/silabus'),
      api.get('/history-materi'),
      api.get('/pengumuman'),
        ]);

        console.log('✅ [DASHBOARD] All data fetched successfully');
        
        // Process kelas data
      const kelasObj = {};
      kelasRes.data.forEach(k => { kelasObj[k.id] = k.nama; });
        setKelas(kelasRes.data);
      setKelasMap(kelasObj);
        console.log('✅ [DASHBOARD] Kelas data processed:', kelasRes.data.length, 'items');

        // Process mentor data
      const mentorObj = {};
      mentorRes.data.forEach(m => { mentorObj[m.id] = m.nama; });
        setMentors(mentorRes.data);
      setMentorMap(mentorObj);
        console.log('✅ [DASHBOARD] Mentor data processed:', mentorRes.data.length, 'items');

        // Process mapel data
      const mapelObj = {};
      mapelRes.data.forEach(mp => { mapelObj[mp.id] = mp.nama; });
        setMapel(mapelRes.data);
      setMapelMap(mapelObj);
        console.log('✅ [DASHBOARD] Mapel data processed:', mapelRes.data.length, 'items');

        // Set other data
      setJadwal(jadwalRes.data);
      setPermintaan(permintaanRes.data);
        setUsers(usersRes.data);
        console.log('📚 [SILABUS] Raw response:', silabusRes);
        console.log('📚 [SILABUS] Response data:', silabusRes.data);
        setSilabus(silabusRes.data || []);
        
        // Test silabus endpoint secara terpisah jika ada masalah
        if (!silabusRes.data || silabusRes.data.length === 0) {
          console.log('🔍 [SILABUS] No data received, testing endpoint separately...');
          try {
            const testRes = await api.get('/silabus');
            console.log('📚 [SILABUS] Test response:', testRes);
            setSilabus(testRes.data || []);
          } catch (testErr) {
            console.error('❌ [SILABUS] Test endpoint failed:', testErr);
            setSilabus([]);
          }
        }
        setPengumuman(pengumumanRes.data);

        console.log('✅ [DASHBOARD] All data processed and states updated');
      } catch (error) {
        console.error('❌ [DASHBOARD] Error fetching all data:', error);
        console.error('❌ [DASHBOARD] Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Set empty arrays as fallback
        setSilabus([]);
        setJadwal([]);
        setPermintaan([]);
        setUsers([]);
        setPengumuman([]);
        
        if (error.response?.status === 503) {
          console.warn('⚠️ [DASHBOARD] Server unavailable (503)');
          alert('Server sedang sibuk. Silakan refresh halaman atau coba lagi nanti.');
        } else if (error.response?.status === 401) {
          console.warn('⚠️ [DASHBOARD] Unauthorized, redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (error.code === 'ERR_NETWORK') {
          console.warn('⚠️ [DASHBOARD] Network error - server may be down');
          alert('Tidak dapat terhubung ke server. Pastikan server backend berjalan.');
        }
      } finally {
      setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
        console.error("Error fetching available mentors:", err);
        setMentorOptions([]);
      })
      .finally(() => setMentorOptionsLoading(false));
  }, [selectedMapel, selectedTanggal, selectedSesi, selectedKelas]);

  useEffect(() => {
    if (selectedMentor && mentorOptions.length > 0) {
      const mentorExists = mentorOptions.some(m => m.id.toString() === selectedMentor.toString());
      if (!mentorExists) {
        setSelectedMentor('');
      }
    }
  }, [mentorOptions, selectedMentor]);

  // Fetch pending mentors when mentor-approval tab is active
  useEffect(() => {
    if (tab === 'mentor-approval') {
      fetchPendingMentors();
    }
  }, [tab]);


  const handleApprove = (id) => {
    api.post(`/permintaan-jadwal/${id}/approve`)
      .then(() => setPermintaan(p => Array.from(p).map(x => x.id === id ? { ...x, status: 'approved' } : x)));
  };

  const handleReject = (id) => {
    api.post(`/permintaan-jadwal/${id}/reject`)
      .then(() => setPermintaan(p => Array.from(p).map(x => x.id === id ? { ...x, status: 'rejected' } : x)));
  };

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
      status: 'scheduled',
      mata_pelajaran_id: selectedMapel,
    })
      .then(res => {
        setAssignSuccess('Jadwal berhasil ditambahkan!');
        setJadwal(j => [...j, res.data]);
        setSelectedKelas('');
        setSelectedMapel('');
        setSelectedTanggal('');
        setSelectedSesi('1');
        setSelectedMentor('');
      })
      .catch(err => {
        setAssignError(err.response?.data?.error || 'Gagal menambah jadwal');
      })
      .finally(() => setAssignLoading(false));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      api.delete(`/users/${userId}`)
        .then(() => {
          setUsers(users.filter(u => u.id !== userId));
        })
        .catch(err => {
          console.error('Error deleting user:', err);
        });
    }
  };

  const handleCreatePengumuman = (e) => {
    e.preventDefault();
    console.log('📢 [PENGUMUMAN] Creating pengumuman:', newPengumuman);
    
    const formData = new FormData();
    formData.append('judul', newPengumuman.judul);
    formData.append('isi', newPengumuman.isi);
    if (pengumumanFile) {
      formData.append('gambar', pengumumanFile);
    }
    
    api.post('/pengumuman', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      console.log('✅ [PENGUMUMAN] Created successfully:', res.data);
      setPengumuman([res.data, ...pengumuman]);
      setNewPengumuman({ judul: '', isi: '' });
      setPengumumanFile(null);
      alert('Pengumuman berhasil dibuat!');
    })
    .catch(err => {
      console.error('❌ [PENGUMUMAN] Error:', err);
      alert('Gagal membuat pengumuman. Silakan coba lagi.');
    });
  };

  const handleDeletePengumuman = (pengumumanId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      api.delete(`/pengumuman/${pengumumanId}`)
        .then(() => {
          setPengumuman(pengumuman.filter(p => p.id !== pengumumanId));
          alert('Pengumuman berhasil dihapus!');
        })
        .catch(err => {
          console.error('Error deleting pengumuman:', err);
          alert('Gagal menghapus pengumuman. Silakan coba lagi.');
        });
    }
  };

  const handleCreateSilabus = (e) => {
    e.preventDefault();
    console.log('📚 [SILABUS] Creating silabus:', newSilabus);
    
    api.post('/silabus', {
      nama: newSilabus.nama,
      deskripsi: newSilabus.deskripsi
    })
    .then(res => {
      console.log('✅ [SILABUS] Created successfully:', res.data);
      setSilabus([res.data, ...silabus]);
      setNewSilabus({ nama: '', deskripsi: '' });
      setShowSilabusForm(false);
      alert('Silabus berhasil dibuat!');
    })
    .catch(err => {
      console.error('❌ [SILABUS] Error:', err);
      alert('Gagal membuat silabus. Silakan coba lagi.');
    });
  };

  const handleEditSilabus = (silabus) => {
    console.log('📝 [SILABUS] Starting edit for:', silabus);
    setEditingSilabus(silabus);
    setNewSilabus({ nama: silabus.nama, deskripsi: silabus.deskripsi });
    setShowEditForm(true);
    setShowSilabusForm(false);
    console.log('📝 [SILABUS] Edit form state set - showEditForm: true, showSilabusForm: false');
  };

  const handleUpdateSilabus = (e) => {
    e.preventDefault();
    console.log('📚 [SILABUS] Updating silabus:', editingSilabus.id, newSilabus);
    
    api.put(`/silabus/${editingSilabus.id}`, {
      nama: newSilabus.nama,
      deskripsi: newSilabus.deskripsi
    })
    .then(res => {
      console.log('✅ [SILABUS] Updated successfully:', res.data);
      setSilabus(Array.from(silabus).map(s => s.id === editingSilabus.id ? { ...s, ...res.data } : s));
      setNewSilabus({ nama: '', deskripsi: '' });
      setEditingSilabus(null);
      setShowEditForm(false);
      alert('Silabus berhasil diperbarui!');
    })
    .catch(err => {
      console.error('❌ [SILABUS] Error:', err);
      alert('Gagal memperbarui silabus. Silakan coba lagi.');
    });
  };

  const handleDeleteSilabus = (silabusId, silabusNama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus silabus "${silabusNama}"?`)) {
      console.log('📚 [SILABUS] Deleting silabus:', silabusId);
      
      api.delete(`/silabus/${silabusId}`)
      .then(res => {
        console.log('✅ [SILABUS] Deleted successfully:', res.data);
        setSilabus(silabus.filter(s => s.id !== silabusId));
        alert('Silabus berhasil dihapus!');
      })
      .catch(err => {
        console.error('❌ [SILABUS] Error:', err);
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          alert('Gagal menghapus silabus. Silakan coba lagi.');
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSilabus(null);
    setNewSilabus({ nama: '', deskripsi: '' });
    setShowEditForm(false);
  };



  // Mentor Approval Functions
  const fetchPendingMentors = async () => {
    console.log('\n👑 ====== FRONTEND FETCH PENDING MENTORS ======');
    setLoadingPendingMentors(true);
    try {
      console.log('🔍 Fetching pending mentors...');
      const response = await api.get('/admin/pending-mentors');
      console.log('✅ Response received:', response.data);
      console.log('📊 Pending mentors count:', response.data.length);
      console.log('📋 Pending mentors data:', response.data);
      
      setPendingMentors(response.data);
      
      // Update stats with pending mentors count
      setStats(prev => ({
        ...prev,
        pendingMentors: response.data.length
      }));
      
    } catch (error) {
      console.error('❌ Error fetching pending mentors:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Set empty array on error
      setPendingMentors([]);
      
      // Show user-friendly error message
      if (error.response?.status === 403) {
        console.error('❌ Access denied - not admin');
      } else if (error.response?.status === 500) {
        console.error('❌ Server error - check backend logs');
      }
    } finally {
      setLoadingPendingMentors(false);
      console.log('👑 ====== FETCH PENDING MENTORS END ======\n');
    }
  };

  const handleApproveMentor = async (mentorId) => {
    console.log('\n✅ ====== FRONTEND APPROVE MENTOR ======');
    console.log('🔍 Approving mentor ID:', mentorId);
    
    try {
      const response = await api.put(`/admin/mentors/${mentorId}/approve`);
      console.log('✅ Approve response:', response.data);
      
      // Remove from pending list
      setPendingMentors(p => p.filter(m => m.id !== mentorId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total_mentor: prev.total_mentor + 1,
        pendingMentors: prev.pendingMentors - 1
      }));
      
      console.log('✅ Mentor approved successfully');
      alert('Mentor berhasil disetujui!');
      
      // Refresh pending mentors list
      fetchPendingMentors();
      
    } catch (error) {
      console.error('❌ Error approving mentor:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert('Gagal menyetujui mentor: ' + (error.response?.data?.error || error.message));
    }
    
    console.log('✅ ====== APPROVE MENTOR END ======\n');
  };

  const handleRejectMentor = async (mentorId, reason) => {
    console.log('\n❌ ====== FRONTEND REJECT MENTOR ======');
    console.log('🔍 Rejecting mentor ID:', mentorId);
    console.log('🔍 Rejection reason:', reason);
    
    try {
      const response = await api.put(`/admin/mentors/${mentorId}/reject`, { reason });
      console.log('✅ Reject response:', response.data);
      
      // Remove from pending list
      setPendingMentors(p => p.filter(m => m.id !== mentorId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingMentors: prev.pendingMentors - 1
      }));
      
      // Close modal
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedMentorToReject(null);
      
      console.log('✅ Mentor rejected successfully');
      alert('Mentor berhasil ditolak!');
      
      // Refresh pending mentors list
      fetchPendingMentors();
      
    } catch (error) {
      console.error('❌ Error rejecting mentor:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert('Gagal menolak mentor: ' + (error.response?.data?.error || error.message));
    }
    
    console.log('❌ ====== REJECT MENTOR END ======\n');
  };

  const openRejectModal = (mentor) => {
    setSelectedMentorToReject(mentor);
    setShowRejectModal(true);
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${color} p-4 rounded-xl shadow-lg text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Header user={user} onLogout={onLogout} />
      
      <PageContainer>
        {/* Server Status Indicator */}
        <div className="mb-4">
          <div className={`p-3 rounded-lg border ${
            serverStatus === 'online' ? 'bg-green-50 border-green-200' :
            serverStatus === 'offline' ? 'bg-red-50 border-red-200' :
            serverStatus === 'error' ? 'bg-yellow-50 border-yellow-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                serverStatus === 'online' ? 'bg-green-500' :
                serverStatus === 'offline' ? 'bg-red-500' :
                serverStatus === 'error' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              <span className={`text-sm font-medium ${
                serverStatus === 'online' ? 'text-green-800' :
                serverStatus === 'offline' ? 'text-red-800' :
                serverStatus === 'error' ? 'text-yellow-800' :
                'text-gray-800'
              }`}>
                {serverStatus === 'online' ? 'Server Online' :
                 serverStatus === 'offline' ? 'Server Offline (503)' :
                 serverStatus === 'error' ? 'Server Error' :
                 'Checking Server...'}
              </span>
              {serverStatus === 'offline' && (
                <button 
                  onClick={checkServerStatus}
                  className="ml-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Admin EduMentor</h1>
              {currentWeek && <p className="text-sm text-gray-600">Minggu Akademik: {currentWeek}</p>}
            </div>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={UserGroupIcon} 
                title="Total User" 
                value={stats.total_user} 
                color="from-blue-500 to-indigo-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={AcademicCapIcon} 
                title="Total Mentor" 
                value={stats.total_mentor} 
                color="from-green-500 to-teal-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={ClockIcon} 
                title="Mentor Pending" 
                value={stats.pendingMentors || 0} 
                color="from-orange-500 to-red-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={BookOpenIcon} 
                title="Total Kelas" 
                value={stats.total_kelas} 
                color="from-amber-500 to-yellow-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={ClockIcon} 
                title="Sesi Aktif" 
                value={stats.total_sesi_scheduled} 
                color="from-violet-500 to-purple-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={ArrowPathIcon} 
                title="Permintaan Baru" 
                value={stats.total_permintaan_pending} 
                color="from-pink-500 to-rose-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={BookmarkIcon} 
                title="Total Mapel" 
                value={stats.total_mapel} 
                color="from-cyan-500 to-sky-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={CheckCircleIcon} 
                title="Sesi Selesai" 
                value={sessionStats.completed_sessions} 
                color="from-emerald-500 to-teal-600" 
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard 
                icon={ClockIcon} 
                title="Sesi Mendatang" 
                value={sessionStats.upcoming_sessions} 
                color="from-orange-500 to-amber-600" 
              />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-xl p-4 bg-white/80 backdrop-blur-sm border border-white/20">
              <h2 className="text-lg font-bold mb-4 text-gray-800 px-2">Menu Admin</h2>
              <nav className="space-y-1">
                {Array.from(TABS).map(t => (
                  <motion.button
                    key={t.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTab(t.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                      tab === t.key 
                        ? `bg-gradient-to-r ${t.color} text-white font-medium shadow-md` 
                        : 'hover:bg-gray-50/50 text-gray-600'
                    }`}
                  >
                    <t.icon className={`h-5 w-5 ${tab === t.key ? 'text-white' : 'text-gray-500'}`} />
                    <span>{t.label}</span>
                  </motion.button>
                ))}
              </nav>
            </Card>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'jadwal' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6" />
                        Kelola Jadwal Sesi
                      </h2>
                    </div>
                    <div className="p-6">
                      <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAssignJadwal}>
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
                            {Array.from(SESI_LABELS).map(s => <option key={s} value={s}>Sesi {s}</option>)}
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
                                ? "Memuat mentor..."
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
                              Tidak ada mentor yang tersedia untuk kriteria yang dipilih
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <Button 
                            type="submit" 
                            variant="primary" 
                            className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
                            disabled={assignLoading}
                          >
                            {assignLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Buat Jadwal
                              </span>
                            )}
                          </Button>
                          {assignError && (
                            <div className="text-sm text-red-600 flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              {assignError}
                            </div>
                          )}
                          {assignSuccess && (
                            <div className="text-sm text-green-600 flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {assignSuccess}
                            </div>
                          )}
                        </div>
                      </form>
                      
                      {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                          <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4 flex items-center justify-center">
                              <CalendarIcon className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="text-gray-500">Memuat jadwal...</p>
                          </div>
                        </div>
                      ) : jadwal.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada jadwal</h3>
                          <p className="mt-1 text-sm text-gray-500">Anda belum memiliki jadwal mengajar yang dijadwalkan.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mapel</th>
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
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      j.status === 'completed' || new Date(j.tanggal) < new Date() ? 'bg-green-100 text-green-800' :
                                      j.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                      j.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                      j.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {j.status === 'completed' || new Date(j.tanggal) < new Date() ? 'done' : j.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                
                {tab === 'permintaan' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ArrowPathIcon className="h-6 w-6" />
                        Permintaan Jadwal
                      </h2>
                    </div>
                    <div className="p-6">
                      {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                          <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mb-4 flex items-center justify-center">
                              <ArrowPathIcon className="h-6 w-6 text-amber-500" />
                            </div>
                            <p className="text-gray-500">Memuat permintaan...</p>
                          </div>
                        </div>
                      ) : permintaan.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada permintaan</h3>
                          <p className="mt-1 text-sm text-gray-500">Belum ada permintaan jadwal yang masuk.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
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
                                    {kelasMap[p.kelas_id] || '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {mentorMap[p.mentor_id] || '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDateForDisplay(p.tanggal)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {p.sesi}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      p.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                      p.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {p.status === 'pending' && (
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="success" 
                                          size="sm" 
                                          onClick={() => handleApprove(p.id)}
                                          className="flex items-center shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                                          Approve
                                        </Button>
                                        <Button 
                                          variant="danger" 
                                          size="sm" 
                                          onClick={() => handleReject(p.id)}
                                          className="flex items-center shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <XCircleIcon className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      </div>
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
                )}
                
                {tab === 'availability' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ClockIcon className="h-6 w-6" />
                        Ketersediaan Mentor
                      </h2>
                    </div>
                    <div className="p-6">
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
                      {selectedMentor && mingguKe ? (
                        <AvailabilityGrid mentorId={selectedMentor} mingguKe={mingguKe} setMingguKe={setMingguKe} />
                      ) : (
                        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Pilih mentor dan minggu</h3>
                          <p className="mt-1 text-sm text-gray-500">Silakan pilih mentor dan minggu untuk melihat ketersediaan.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {tab === 'silabus' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-cyan-600 to-sky-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpenIcon className="h-6 w-6" />
                        Kelola Silabus
                      </h2>
                        <Button 
                          onClick={() => {
                            console.log('🔘 [SILABUS] Button clicked, current state:', showSilabusForm);
                            setShowSilabusForm(!showSilabusForm);
                            setShowEditForm(false); // Pastikan form edit tertutup
                            setEditingSilabus(null);
                            console.log('🔘 [SILABUS] New state will be:', !showSilabusForm);
                          }}
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/30"
                        >
                          <PlusIcon className="h-4 w-4" />
                          {showSilabusForm ? 'Batal' : 'Buat Silabus'}
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      {showSilabusForm && (
                        <div className="mb-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                          <h3 className="text-lg font-semibold text-cyan-800 mb-4">Buat Silabus Baru</h3>
                          <p className="text-xs text-gray-500 mb-2">Debug: showSilabusForm = {showSilabusForm.toString()}</p>
                          <form onSubmit={handleCreateSilabus} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Silabus</label>
                              <input 
                                type="text" 
                                value={newSilabus.nama} 
                                onChange={e => setNewSilabus({ ...newSilabus, nama: e.target.value })} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white/80 backdrop-blur-sm" 
                                placeholder="Contoh: Silabus Matematika Dasar - Aljabar"
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Silabus</label>
                              <textarea 
                                value={newSilabus.deskripsi} 
                                onChange={e => setNewSilabus({ ...newSilabus, deskripsi: e.target.value })} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white/80 backdrop-blur-sm" 
                                rows={4}
                                placeholder="Deskripsikan isi silabus, materi yang akan diajarkan, dan target pembelajaran..."
                                required 
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                type="submit" 
                                variant="primary" 
                                className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow bg-cyan-600 hover:bg-cyan-700"
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Buat Silabus
                              </Button>
                              <Button 
                                type="button"
                                onClick={() => setShowSilabusForm(false)}
                                variant="outline"
                                className="px-6 py-2.5"
                              >
                                Batal
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      {showEditForm && editingSilabus && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-blue-800 mb-4">Edit Silabus: {editingSilabus.nama}</h3>
                          <p className="text-xs text-gray-500 mb-2">Debug: showEditForm = {showEditForm.toString()}, editingSilabus = {editingSilabus ? 'exists' : 'null'}</p>
                          <form onSubmit={handleUpdateSilabus} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Silabus</label>
                              <input 
                                type="text" 
                                value={newSilabus.nama} 
                                onChange={e => setNewSilabus({ ...newSilabus, nama: e.target.value })} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm" 
                                placeholder="Contoh: Silabus Matematika Dasar - Aljabar"
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Silabus</label>
                              <textarea 
                                value={newSilabus.deskripsi} 
                                onChange={e => setNewSilabus({ ...newSilabus, deskripsi: e.target.value })} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm" 
                                rows={4}
                                placeholder="Deskripsikan isi silabus, materi yang akan diajarkan, dan target pembelajaran..."
                                required 
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                type="submit" 
                                variant="primary" 
                                className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow bg-blue-600 hover:bg-blue-700"
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Update Silabus
                              </Button>
                              <Button 
                                type="button"
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="px-6 py-2.5"
                              >
                                Batal
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                      
                      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                        Debug: silabus.length = {silabus.length}, silabus = {JSON.stringify(silabus)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {silabus.length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada silabus</h3>
                            <p className="text-gray-500 mb-4">Klik tombol "Buat Silabus" untuk menambahkan silabus pertama.</p>
                            <Button 
                              onClick={() => {
                                console.log('🔘 [SILABUS] Create button clicked from empty state');
                                setShowSilabusForm(true);
                                setShowEditForm(false);
                                setEditingSilabus(null);
                              }}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                            >
                              <PlusIcon className="h-5 w-5" />
                              Buat Silabus Pertama
                            </Button>
                          </div>
                        ) : (
                          silabus && Array.from(silabus).map((item) => (
                          <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200/50 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="bg-gradient-to-r from-cyan-100 to-sky-100 p-2 rounded-lg">
                                <BookOpenIcon className="h-6 w-6 text-cyan-600" />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditSilabus(item)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="Edit silabus"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSilabus(item.id, item.nama)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="Hapus silabus"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                            </div>
                            <h3 className="font-medium text-gray-800 mb-2">{item.nama}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.deskripsi}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                              </span>
                              <Button size="xs" variant="outline">
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                Unduh
                              </Button>
                            </div>
                          </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </Card>
                )}
                
                {tab === 'users' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <UserGroupIcon className="h-6 w-6" />
                        Kelola Pengguna
                      </h2>
                    </div>
                    <div className="p-6">
                      {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                          <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-teal-100 rounded-full mb-4 flex items-center justify-center">
                              <UserGroupIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="text-gray-500">Memuat pengguna...</p>
                          </div>
                        </div>
                      ) : users.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada pengguna</h3>
                          <p className="mt-1 text-sm text-gray-500">Belum ada pengguna yang terdaftar.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white/30 divide-y divide-gray-200">
                              {users && Array.from(users).map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        {u.foto_profil ? (
                                          <img className="h-10 w-10 rounded-full object-cover" src={`https://api2.myscover.my.id/${u.foto_profil}`} alt={u.nama} />
                                        ) : (
                                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center">
                                            <span className="text-green-600 font-medium">{u.nama ? u.nama.charAt(0) : '?'}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{u.nama}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {u.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                      u.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Button 
                                      variant="danger" 
                                      size="sm" 
                                      onClick={() => handleDeleteUser(u.id)}
                                      className="flex items-center shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <TrashIcon className="h-4 w-4 mr-1" />
                                      Hapus
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {tab === 'pengumuman' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MegaphoneIcon className="h-6 w-6" />
                        Kelola Pengumuman
                      </h2>
                    </div>
                    <div className="p-6">
                      <form className="mb-6 grid grid-cols-1 gap-4" onSubmit={handleCreatePengumuman}>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Judul Pengumuman</label>
                          <input 
                            type="text" 
                            value={newPengumuman.judul} 
                            onChange={e => setNewPengumuman({ ...newPengumuman, judul: e.target.value })} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Gambar (Opsional)</label>
                          <div className="flex items-center">
                            <label className="cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gray-50/50 transition-colors shadow-sm hover:shadow-md">
                              <PhotoIcon className="h-5 w-5 text-gray-500 mr-2" />
                              <span>Pilih File</span>
                              <input 
                                type="file" 
                                onChange={e => setPengumumanFile(e.target.files[0])} 
                                className="hidden" 
                                accept="image/*"
                              />
                            </label>
                            {pengumumanFile && (
                              <span className="ml-3 text-sm text-gray-600">{pengumumanFile.name}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Isi Pengumuman</label>
                          <textarea 
                            value={newPengumuman.isi} 
                            onChange={e => setNewPengumuman({ ...newPengumuman, isi: e.target.value })} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm" 
                            rows={4}
                            required 
                          />
                        </div>
                        <div>
                          <Button 
                            type="submit" 
                            variant="primary" 
                            className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Buat Pengumuman
                          </Button>
                        </div>
                      </form>
                      
                      {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                          <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 flex items-center justify-center">
                              <MegaphoneIcon className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="text-gray-500">Memuat pengumuman...</p>
                          </div>
                        </div>
                      ) : pengumuman.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                          <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada pengumuman</h3>
                          <p className="mt-1 text-sm text-gray-500">Anda belum membuat pengumuman apapun.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pengumuman && Array.from(pengumuman).map(p => (
                            <motion.div 
                              key={p.id} 
                              whileHover={{ y: -2 }}
                              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-medium text-gray-900">{p.judul}</h3>
                                  <button 
                                    onClick={() => handleDeletePengumuman(p.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{p.isi}</p>
                                {p.gambar_url && (
                                  <div className="mt-3">
                                    <img 
                                      src={`http://localhost:5000${p.gambar_url}`} 
                                      alt={p.judul} 
                                      className="max-w-full h-auto rounded-lg border border-gray-200"
                                    />
                                  </div>
                                )}
                                <div className="mt-3 text-xs text-gray-500">
                                  Dibuat pada: {new Date(p.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                                 {tab === 'history' && (
                   <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                     <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                       <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <ClipboardDocumentIcon className="h-6 w-6" />
                         History Materi
                       </h2>
                     </div>
                     <div className="p-6">
                       {loading ? (
                         <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                           <div className="animate-pulse flex flex-col items-center">
                             <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4 flex items-center justify-center">
                               <ClipboardDocumentIcon className="h-6 w-6 text-emerald-500" />
                             </div>
                             <p className="text-gray-500">Memuat history...</p>
                           </div>
                         </div>
                       ) : historyMateri.length === 0 ? (
                         <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                           <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                           <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada history materi</h3>
                           <p className="mt-1 text-sm text-gray-500">History materi akan muncul setelah mentor mengirim laporan pembelajaran.</p>
                         </div>
                       ) : (
                         <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
                           <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50/50">
                               <tr>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materi Diajarkan</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil Pembelajaran</th>
                               </tr>
                             </thead>
                             <tbody className="bg-white/30 divide-y divide-gray-200">
                               {historyMateri && Array.from(historyMateri).map((item, index) => (
                                 <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {formatDateForDisplay(item.tanggal)}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {item.nama_kelas || '-'}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {item.nama_mentor || '-'}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {item.nama_mapel || '-'}
                                   </td>
                                   <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                     {item.materi_diajarkan || '-'}
                                   </td>
                                   <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                     {item.hasil_belajar || '-'}
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       )}
                     </div>
                   </Card>
                 )}

                 {tab === 'mentor-approval' && (
                   <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                     <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                       <div className="flex items-center justify-between">
                         <h2 className="text-xl font-bold text-white flex items-center gap-2">
                           <AcademicCapIcon className="h-6 w-6" />
                           Mentor Approval
                         </h2>
                         <div className="flex gap-2">
                           <button
                             onClick={fetchPendingMentors}
                             className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                             title="Refresh pending mentors"
                           >
                             🔄 Refresh
                           </button>
                           <button
                             onClick={async () => {
                               try {
                                 const response = await api.get('/debug/all-mentors');
                                 console.log('🔍 Debug all mentors:', response.data);
                                 alert(`Found ${response.data.count} mentors in database. Check console for details.`);
                               } catch (error) {
                                 console.error('Debug error:', error);
                                 alert('Debug failed: ' + error.message);
                               }
                             }}
                             className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                             title="Debug all mentors"
                           >
                             🔍 Debug
                           </button>
                         </div>
                       </div>
                     </div>
                     <div className="p-6">
                       {loadingPendingMentors ? (
                         <div className="flex justify-center items-center h-64 bg-white/50 rounded-xl backdrop-blur-sm">
                           <div className="animate-pulse flex flex-col items-center">
                             <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4 flex items-center justify-center">
                               <AcademicCapIcon className="h-6 w-6 text-orange-500" />
                             </div>
                             <p className="text-gray-500">Memuat data mentor...</p>
                           </div>
                         </div>
                       ) : pendingMentors.length === 0 ? (
                         <div className="text-center py-12 bg-white/50 rounded-lg backdrop-blur-sm">
                           <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                           <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada mentor yang menunggu persetujuan</h3>
                           <p className="mt-1 text-sm text-gray-500">Semua mentor sudah diproses atau belum ada yang mendaftar.</p>
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
                                     <h3 className="text-lg font-semibold text-gray-900">{mentor.nama}</h3>
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
                                 <div className="flex space-x-3">
                                   <Button
                                     onClick={() => handleApproveMentor(mentor.id)}
                                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                   >
                                     <CheckCircleIcon className="h-5 w-5" />
                                     <span>Setujui</span>
                                   </Button>
                                   <Button
                                     onClick={() => openRejectModal(mentor)}
                                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                   >
                                     <XCircleIcon className="h-5 w-5" />
                                     <span>Tolak</span>
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </Card>
                 )}
                 
                 {tab === 'analytics' && (
                   <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                     <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4">
                       <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <ChartBarIcon className="h-6 w-6" />
                         Analytics Dashboard
                       </h2>
                     </div>
                     <div className="p-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-gray-200/50">
                           <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                             <ChartPieIcon className="h-5 w-5 text-violet-600" />
                             Distribusi Sesi per Mata Pelajaran
                           </h3>
                           <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                             <p className="text-gray-500">Chart will be displayed here</p>
                           </div>
                         </div>
                         <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-gray-200/50">
                           <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                             <TableCellsIcon className="h-5 w-5 text-fuchsia-600" />
                             Aktivitas Terkini
                           </h3>
                           <div className="space-y-3">
                             {Array.from([1, 2, 3, 4, 5]).map(i => (
                               <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50/50 rounded-lg transition-colors">
                                 <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 p-2 rounded-full">
                                   <LightBulbIcon className="h-5 w-5 text-violet-600" />
                                 </div>
                                 <div>
                                   <p className="text-sm font-medium text-gray-800">Aktivitas contoh {i}</p>
                                   <p className="text-xs text-gray-500">2 jam yang lalu</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     </div>
                   </Card>
                 )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </PageContainer>

      {/* Chat Modal - Use Personal Chat for better functionality */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Personal Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <div className="text-center text-gray-500">
                <p>Personal Chat feature coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Mentor Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tolak Mentor</h2>
              <p className="text-sm text-gray-600 mb-4">
                Apakah Anda yakin ingin menolak mentor <strong>{selectedMentorToReject?.nama}</strong>?
              </p>
              <div className="mb-4">
                <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan (Opsional)
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedMentorToReject(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Batal
                </Button>
                <Button
                  onClick={() => handleRejectMentor(selectedMentorToReject.id, rejectReason)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Tolak Mentor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
