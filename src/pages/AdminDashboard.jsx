import { useEffect, useState } from 'react';
import api from '../api/axios';
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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import Chat from '../components/Chat';

const TABS = [
  { key: 'jadwal', label: 'Jadwal Sesi', icon: CalendarIcon, color: 'from-blue-500 to-indigo-600' },
  { key: 'permintaan', label: 'Permintaan Jadwal', icon: ArrowPathIcon, color: 'from-amber-500 to-yellow-600' },
  { key: 'availability', label: 'Ketersediaan', icon: ClockIcon, color: 'from-indigo-500 to-purple-600' },
  { key: 'silabus', label: 'Silabus', icon: BookOpenIcon, color: 'from-cyan-500 to-sky-600' },
  { key: 'history', label: 'History Materi', icon: ClipboardDocumentIcon, color: 'from-emerald-500 to-teal-600' },
  { key: 'notifikasi', label: 'Notifikasi', icon: BellIcon, color: 'from-pink-500 to-rose-600' },
  { key: 'users', label: 'Pengguna', icon: UserGroupIcon, color: 'from-green-500 to-teal-600' },
  { key: 'pengumuman', label: 'Pengumuman', icon: MegaphoneIcon, color: 'from-purple-500 to-pink-600' },
  { key: 'pesan', label: 'Pesan', icon: ChatBubbleLeftRightIcon, color: 'from-sky-500 to-cyan-600' },
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
                {WEEK_LABELS.map((h, idx) => {
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
              {SESI_LABELS.map(sesi => (
                <tr key={sesi} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Sesi {sesi}
                    </div>
                  </td>
                  {WEEK_LABELS.map(hari => {
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
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [mingguKe, setMingguKe] = useState(1);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [newPengumuman, setNewPengumuman] = useState({ judul: '', isi: '' });
  const [pengumumanFile, setPengumumanFile] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [silabus, setSilabus] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatTarget, setChatTarget] = useState(null); // 'users', 'mentors', or null
  const [chatUsers, setChatUsers] = useState([]);
  const [chatMentors, setChatMentors] = useState([]);
  const [selectedChatTarget, setSelectedChatTarget] = useState(null);
  const [chatListLoading, setChatListLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
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

  useEffect(() => {
    api.get('/admin/current-week').then(res => setCurrentWeek(res.data.weekNumber));
    api.get('/admin/stats').then(res => setStats(res.data));
    api.get('/jadwal-sesi/admin-stats').then(res => setSessionStats(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/kelas'),
      api.get('/mentors'),
      api.get('/jadwal-sesi'),
      api.get('/permintaan-jadwal'),
      api.get('/mata-pelajaran'),
      api.get('/users'),
      api.get('/pengumuman'),
      api.get('/silabus'),
      api.get('/chat/users'),
      api.get('/history-materi'),
    ]).then(([kelasRes, mentorRes, jadwalRes, permintaanRes, mapelRes, usersRes, pengumumanRes, silabusRes, chatRes, historyRes]) => {
      setKelas(kelasRes.data);
      setMapel(mapelRes.data);
      setConversations(historyRes.data); // Use history data for history tab
      setUsers(usersRes.data);
      setPengumuman(pengumumanRes.data);
      setSilabus(silabusRes.data);
      const kelasObj = {};
      kelasRes.data.forEach(k => { kelasObj[k.id] = k.nama; });
      setKelasMap(kelasObj);
      const mentorObj = {};
      mentorRes.data.forEach(m => { mentorObj[m.id] = m.nama; });
      setMentorMap(mentorObj);
      const mapelObj = {};
      mapelRes.data.forEach(mp => { mapelObj[mp.id] = mp.nama; });
      setMapelMap(mapelObj);
      setMentors(mentorRes.data);
      setJadwal(jadwalRes.data);
      setPermintaan(permintaanRes.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching initial data:", err);
      setLoading(false);
    });
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

  useEffect(() => {
    if (!chatTarget) return;

    setChatListLoading(true);
    // Use the correct chat endpoints
    if (chatTarget === 'users') {
      api.get('/chat/users')
        .then(res => {
          setChatUsers(res.data.filter(user => user.role === 'user'));
        })
        .catch(err => {
          console.error('Failed to fetch users:', err);
          setChatUsers([]);
        })
        .finally(() => setChatListLoading(false));
    } else {
      api.get('/chat/users')
        .then(res => {
          setChatMentors(res.data.filter(user => user.role === 'mentor'));
        })
        .catch(err => {
          console.error('Failed to fetch mentors:', err);
          setChatMentors([]);
        })
        .finally(() => setChatListLoading(false));
    }
  }, [chatTarget]);

  const handleSelectChatTarget = (target) => {
    setSelectedChatTarget(target);
    // For now, just set the selected target and open chat
    setSelectedConversation({
      id: `chat_${target.id}`,
      targetId: target.id,
      targetRole: target.type,
      targetName: target.nama
    });
    setChatTarget(null); // Close the user/mentor list
  };

  const handleApprove = (id) => {
    api.post(`/permintaan-jadwal/approve/${id}`)
      .then(() => setPermintaan(p => p.map(x => x.id === id ? { ...x, status: 'approved' } : x)));
  };

  const handleReject = (id) => {
    api.post(`/permintaan-jadwal/reject/${id}`)
      .then(() => setPermintaan(p => p.map(x => x.id === id ? { ...x, status: 'rejected' } : x)));
  };

  const handleAssignJadwal = (e) => {
    e.preventDefault();
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
        setPengumuman([res.data, ...pengumuman]);
        setNewPengumuman({ judul: '', isi: '' });
        setPengumumanFile(null);
      })
      .catch(err => {
        console.error('Error creating pengumuman:', err);
      });
  };

  const handleDeletePengumuman = (pengumumanId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      api.delete(`/pengumuman/${pengumumanId}`)
        .then(() => {
          setPengumuman(pengumuman.filter(p => p.id !== pengumumanId));
        })
        .catch(err => {
          console.error('Error deleting pengumuman:', err);
        });
    }
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
                {TABS.map(t => (
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
                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
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
                            {mapel.map(mp => <option key={mp.id} value={mp.id}>{mp.nama}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal</label>
                          <input 
                            type="date" 
                            value={selectedTanggal} 
                            onChange={e => setSelectedTanggal(e.target.value)} 
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
                            {SESI_LABELS.map(s => <option key={s} value={s}>Sesi {s}</option>)}
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
                            {mentorOptions.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
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
                              {jadwal.map(j => (
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
                                    {new Date(j.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                              {permintaan.map(p => (
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
                                    {new Date(p.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                            {mentors.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
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
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpenIcon className="h-6 w-6" />
                        Kelola Silabus
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {silabus.map((item) => (
                          <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200/50 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-gradient-to-r from-cyan-100 to-sky-100 p-2 rounded-lg">
                                <BookOpenIcon className="h-6 w-6 text-cyan-600" />
                              </div>
                              <h3 className="font-medium text-gray-800">{item.judul}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.deskripsi}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {item.kelas} • {item.mapel}
                              </span>
                              <Button size="xs" variant="outline">
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                Unduh
                              </Button>
                            </div>
                          </motion.div>
                        ))}
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
                              {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        {u.foto_profil ? (
                                          <img className="h-10 w-10 rounded-full object-cover" src={`http://localhost:3001/${u.foto_profil}`} alt={u.nama} />
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
                          {pengumuman.map(p => (
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
                                      src={`http://localhost:3002${p.gambar_url}`} 
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

                {tab === 'pesan' && (
                  <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="h-6 w-6" />
                        Pesan
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-4 mb-4">
                        <Button
                          onClick={() => setShowChat(true)}
                          variant="primary"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Buka Chat
                        </Button>
                      </div>
                      
                      <div className="text-center text-gray-500 py-8">
                        <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Klik tombol "Buka Chat" untuk memulai percakapan dengan user atau mentor</p>
                      </div>
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
                       ) : conversations.length === 0 ? (
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
                               {conversations.map((item, index) => (
                                 <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                             {[1, 2, 3, 4, 5].map(i => (
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

      {/* Chat Modal */}
      <Chat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
