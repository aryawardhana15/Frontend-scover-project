import { useEffect, useState } from 'react';
import api from '../config/api';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserCircleIcon, 
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockOutlineIcon
} from '@heroicons/react/24/outline';
import PengumumanCarousel from '../components/PengumumanCarousel';
import { 
  ChatBubbleOvalLeftEllipsisIcon as ChatSolidIcon,
  AcademicCapIcon as AcademicSolidIcon 
} from '@heroicons/react/24/solid';

const TABS = [
  { key: 'jadwal', label: 'Jadwal Saya', icon: CalendarIcon },
  { key: 'permintaan', label: 'Minta Jadwal', icon: ClockOutlineIcon },
  { key: 'history', label: 'Riwayat Belajar', icon: BookOpenIcon },
];

export default function UserDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('jadwal');
  const [jadwal, setJadwal] = useState([]);
  const [permintaan, setPermintaan] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentorOptions, setMentorOptions] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedSesi, setSelectedSesi] = useState('1');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(true);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [history, setHistory] = useState([]);


  // Fetch data awal
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/kelas'),
      api.get('/mentors'),
      api.get('/mata-pelajaran'),
      api.get(`/permintaan-jadwal/user/${user.id}`),
      api.get(`/jadwal-sesi/user/${user.id}`),
      api.get(`/history-materi/user/${user.id}`),
    ]).then(([kelasRes, mentorRes, mapelRes, permintaanRes, jadwalRes, historyRes]) => {
      setKelas(kelasRes.data);
      setMentors(mentorRes.data);
      setHistory(historyRes.data);
      setMapel(mapelRes.data);
      setPermintaan(permintaanRes.data);
      setJadwal(jadwalRes.data);
      setLoading(false);
    });
  }, [user.id]);

  // Fetch mentor yang mampu mapel & available di waktu tsb
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
      .catch(() => setMentorOptions([]))
      .finally(() => setMentorOptionsLoading(false));
  }, [selectedMapel, selectedTanggal, selectedSesi, selectedKelas]);

  // Submit permintaan jadwal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitLoading(true);
    try {
      const res = await api.post('/permintaan-jadwal', {
        user_id: user.id,
        mentor_id: selectedMentor,
        kelas_id: selectedKelas,
        tanggal: selectedTanggal,
        sesi: selectedSesi,
        status: 'pending',
      });
      setSubmitSuccess('Permintaan jadwal berhasil dikirim!');
      setPermintaan(p => [...p, res.data]);
      // Reset form
      setSelectedKelas('');
      setSelectedMapel('');
      setSelectedTanggal('');
      setSelectedSesi('1');
      setSelectedMentor('');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Gagal mengirim permintaan jadwal');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format tanggal Indonesia
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format waktu
  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  // Status badge dengan styling
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon }
    };
    
    const { color, icon: Icon } = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <PageContainer>
        <PengumumanCarousel />

        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2 flex items-center">
            <AcademicCapIcon className="h-8 w-8 mr-2" />
            Dashboard Siswa
          </h1>
          <p className="text-indigo-600">Selamat belajar, {user.name}! Mari eksplorasi pengetahuan baru hari ini.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all ${
                tab === key
                  ? 'bg-white text-indigo-700 border-t-2 border-l-2 border-r-2 border-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'jadwal' && (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white border border-indigo-600 rounded-lg">
              <h2 className="text-xl font-semibold flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2" />
                Jadwal Belajar Saya
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Jadwal belajar yang telah ditetapkan untuk Anda</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : jadwal.length === 0 ? (
              <div className="text-center py-12 px-4">
                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Belum ada jadwal</h3>
                <p className="text-gray-500">Silakan minta jadwal belajar melalui tab "Minta Jadwal"</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jadwal.map(j => (
                      <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(j.tanggal)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Sesi {j.sesi}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-indigo-500" />
                            {formatTime(j.jam_mulai)} - {formatTime(j.jam_selesai)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{kelas.find(k => k.id === j.kelas_id)?.nama || j.kelas_id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserCircleIcon className="h-5 w-5 mr-1 text-gray-400" />
                            <div className="text-sm text-gray-900">{mentors.find(m => m.id === j.mentor_id)?.nama || j.mentor_id}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={j.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
        
        {tab === 'permintaan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="h-fit">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white rounded-t-lg">
                <h2 className="text-xl font-semibold flex items-center">
                  <ClockOutlineIcon className="h-6 w-6 mr-2" />
                  Minta Jadwal Belajar
                </h2>
                <p className="text-green-100 text-sm mt-1">Isi formulir untuk meminta jadwal belajar baru</p>
              </div>
              
              <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Kelas</label>
                  <select 
                    value={selectedKelas} 
                    onChange={e => setSelectedKelas(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
                  <select 
                    value={selectedMapel} 
                    onChange={e => setSelectedMapel(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  >
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    {mapel.map(mp => <option key={mp.id} value={mp.id}>{mp.nama}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                  <input 
                    type="date" 
                    value={selectedTanggal} 
                    onChange={e => setSelectedTanggal(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sesi</label>
                  <select 
                    value={selectedSesi} 
                    onChange={e => setSelectedSesi(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  >
                    {[1,2,3,4,5].map(s => <option key={s} value={s}>Sesi {s}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mentor</label>
                  <select 
                    value={selectedMentor} 
                    onChange={e => setSelectedMentor(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                    required
                    disabled={mentorOptionsLoading}
                  >
                    <option value="">
                      {mentorOptionsLoading 
                        ? "Memuat mentor yang tersedia..." 
                        : mentorOptions.length === 0 
                          ? "-- Tidak ada mentor yang tersedia --" 
                          : "-- Pilih Mentor --"
                      }
                    </option>
                    {mentorOptions.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nama} - {mapel.find(mp => mp.id === selectedMapel)?.nama || 'Mata Pelajaran'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Hanya mentor yang tersedia pada tanggal dan sesi terpilih yang ditampilkan
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="success" 
                    className="w-full py-3 flex justify-center items-center" 
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : 'Kirim Permintaan Jadwal'}
                  </Button>
                  
                  {submitError && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                      <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  
                  {submitSuccess && (
                    <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                      <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}
                </div>
              </form>
            </Card>
            
            <Card>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center">
                  <ClockOutlineIcon className="h-5 w-5 mr-2" />
                  Status Permintaan Jadwal
                </h3>
                <p className="text-purple-100 text-sm mt-1">Riwayat permintaan jadwal yang Anda buat</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : permintaan.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <ClockOutlineIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Belum ada permintaan jadwal</h3>
                  <p className="text-gray-500">Isi formulir di samping untuk membuat permintaan jadwal baru</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {permintaan.map(p => {
                    const mentor = mentors.find(m => m.id === p.mentor_id);
                    const kelasItem = kelas.find(k => k.id === p.kelas_id);
                    const mapelItem = mapel.find(m => m.id === p.mata_pelajaran_id);
                    
                    return (
                      <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(p.tanggal)} - Sesi {p.sesi}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {kelasItem?.nama || p.kelas_id} • {mapelItem?.nama || 'Mata Pelajaran'}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <UserCircleIcon className="h-4 w-4 mr-1" />
                              {mentor?.nama || p.mentor_id}
                            </p>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
        
        {tab === 'history' && (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2" />
                Riwayat Belajar
              </h2>
              <p className="text-purple-100 text-sm mt-1">Catatan pembelajaran yang telah Anda selesaikan</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Belum ada riwayat belajar</h3>
                <p className="text-gray-500">Riwayat pembelajaran akan muncul di sini setelah sesi belajar selesai</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {history.map(h => {
                  const mentor = mentors.find(m => m.id === h.mentor_id);
                  const mapelItem = mapel.find(m => m.id === h.mata_pelajaran_id);
                  
                  return (
                    <div key={h.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900 text-lg">
                            {mapelItem?.nama || 'Mata Pelajaran'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 flex items-center">
                            <UserCircleIcon className="h-4 w-4 mr-1" />
                            Mentor: {mentor?.nama || h.mentor_id}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(h.tanggal)}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-1 text-indigo-500" />
                          Hasil Pembelajaran
                        </h4>
                        <p className="text-gray-700 whitespace-pre-line">{h.hasil_belajar}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </PageContainer>
    </>
  );
}