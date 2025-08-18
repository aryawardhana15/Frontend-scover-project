import { useEffect, useState } from 'react';
import api from '../api/axios';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import PengumumanCarousel from '../components/PengumumanCarousel';
import Chat from '../components/Chat';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

const TABS = [
  { key: 'jadwal', label: 'Jadwal Saya' },
  { key: 'permintaan', label: 'Minta Jadwal' },
  { key: 'history', label: 'Riwayat Belajar' },
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
  const [showChat, setShowChat] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);

  const handleOpenChat = () => {
    api.post('/chat/conversations')
      .then(res => {
        setConversationId(res.data.id);
        setShowChat(true);
      })
      .catch(console.error);
  };

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

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <PageContainer>
        <PengumumanCarousel />

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Chat dengan Admin</h2>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
              </div>
              <Chat conversationId={conversationId} user={user} />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Dashboard Siswa</h1>
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <Button key={t.key} variant={tab === t.key ? 'success' : 'secondary'} onClick={() => setTab(t.key)}>{t.label}</Button>
          ))}
        </div>
        {tab === 'jadwal' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Jadwal Belajar Saya</h2>
            {loading ? <div>Loading...</div> : (
              jadwal.length === 0 ? <div className="text-gray-500">Belum ada jadwal.</div> : (
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Tanggal</th>
                      <th className="border px-2 py-1">Sesi</th>
                      <th className="border px-2 py-1">Jam</th>
                      <th className="border px-2 py-1">Kelas</th>
                      <th className="border px-2 py-1">Mentor</th>
                      <th className="border px-2 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwal.map(j => (
                      <tr key={j.id}>
                        <td className="border px-2 py-1">{j.tanggal}</td>
                        <td className="border px-2 py-1">{j.sesi}</td>
                        <td className="border px-2 py-1">{j.jam_mulai} - {j.jam_selesai}</td>
                        <td className="border px-2 py-1">{j.kelas_id}</td>
                        <td className="border px-2 py-1">{j.mentor_id}</td>
                        <td className="border px-2 py-1">{j.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </Card>
        )}
        {tab === 'permintaan' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-green-700">Minta Jadwal Belajar</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Kelas</label>
                <select value={selectedKelas} onChange={e => setSelectedKelas(e.target.value)} className="w-full border rounded p-2" required>
                  <option value="">-- Pilih Kelas --</option>
                  {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1">Mata Pelajaran</label>
                <select value={selectedMapel} onChange={e => setSelectedMapel(e.target.value)} className="w-full border rounded p-2" required>
                  <option value="">-- Pilih Mapel --</option>
                  {mapel.map(mp => <option key={mp.id} value={mp.id}>{mp.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1">Tanggal</label>
                <input type="date" value={selectedTanggal} onChange={e => setSelectedTanggal(e.target.value)} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block mb-1">Sesi</label>
                <select value={selectedSesi} onChange={e => setSelectedSesi(e.target.value)} className="w-full border rounded p-2" required>
                  {[1,2,3,4,5].map(s => <option key={s} value={s}>Sesi {s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Mentor</label>
                <select 
                  value={selectedMentor} 
                  onChange={e => setSelectedMentor(e.target.value)} 
                  className="w-full border rounded p-2" 
                  required
                  disabled={mentorOptionsLoading}
                >
                  <option value="">
                    {mentorOptionsLoading 
                      ? "Loading mentor..." 
                      : mentorOptions.length === 0 
                        ? "-- Tidak ada mentor available --" 
                        : "-- Pilih Mentor --"
                    }
                  </option>
                  {mentorOptions.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2 items-center">
                <Button type="submit" variant="success" disabled={submitLoading}>Kirim Permintaan</Button>
                {submitError && <span className="text-red-600">{submitError}</span>}
                {submitSuccess && <span className="text-green-600">{submitSuccess}</span>}
              </div>
            </form>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Status Permintaan Jadwal</h3>
              {loading ? <div>Loading...</div> : (
                permintaan.length === 0 ? <div className="text-gray-500">Belum ada permintaan jadwal.</div> : (
                  <table className="min-w-full border">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Tanggal</th>
                        <th className="border px-2 py-1">Sesi</th>
                        <th className="border px-2 py-1">Kelas</th>
                        <th className="border px-2 py-1">Mentor</th>
                        <th className="border px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permintaan.map(p => (
                        <tr key={p.id}>
                          <td className="border px-2 py-1">{p.tanggal}</td>
                          <td className="border px-2 py-1">{p.sesi}</td>
                          <td className="border px-2 py-1">{p.kelas_id}</td>
                          <td className="border px-2 py-1">{p.mentor_id}</td>
                          <td className="border px-2 py-1">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
    </div>
          </Card>
        )}
        {tab === 'history' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">Riwayat Belajar</h2>
            {loading ? <div>Loading...</div> : (
              history.length === 0 ? <div className="text-gray-500">Belum ada riwayat belajar.</div> : (
                <div className="space-y-4">
                  {history.map(h => (
                    <div key={h.id} className="border p-4 rounded-lg">
                      <p className="font-bold">{h.tanggal}</p>
                      <p>Mentor: {mentors.find(m => m.id === h.mentor_id)?.nama || 'N/A'}</p>
                      <p>Mapel: {mapel.find(m => m.id === h.mata_pelajaran_id)?.nama || 'N/A'}</p>
                      <p className="mt-2 bg-gray-100 p-2 rounded">{h.hasil_belajar}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </Card>
        )}
      </PageContainer>
    </>
  );
}
