import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import PageContainer from '../components/PageContainer';
import Header from '../components/Header';
import { getWeekNumber, getWeekRange } from '../utils/dateUtils';

const TABS = [
  { key: 'jadwal', label: 'Jadwal Sesi' },
  { key: 'permintaan', label: 'Permintaan Jadwal' },
  { key: 'availability', label: 'Availability Mentor' },
  { key: 'silabus', label: 'Silabus' },
  { key: 'history', label: 'History Materi' },
  { key: 'notifikasi', label: 'Notifikasi' },
];

const WEEK_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESI_LABELS = ['1', '2', '3', '4', '5'];

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
  const monthLabel = weekStart.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const today = new Date();

  return (
    <>
      <div className="mb-2 text-gray-700 font-medium">
        Minggu ke-{mingguKe}: {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} – {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} <br/>
        Bulan: {monthLabel}
      </div>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => mingguKe > 1 && setMingguKe(mingguKe - 1)} size="sm">Minggu Sebelumnya</Button>
        <Button onClick={() => setMingguKe(mingguKe + 1)} size="sm">Minggu Berikutnya</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Sesi/Hari</th>
              {WEEK_LABELS.map((h, idx) => {
                const tgl = new Date(weekStart);
                tgl.setDate(weekStart.getDate() + idx);
                const isToday = tgl.toDateString() === today.toDateString();
                return (
                  <th key={h} className={`border px-2 py-1 ${isToday ? 'bg-yellow-200' : ''}`}>
                    {h} <br/> <span className="text-xs">{tgl.getDate()}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {SESI_LABELS.map(sesi => (
              <tr key={sesi}>
                <td className="border px-2 py-1 font-semibold">Sesi {sesi}</td>
                {WEEK_LABELS.map(hari => {
                  const item = data.find(d => d.hari === hari && d.sesi === sesi);
                  return (
                    <td key={hari} className={`border px-2 py-1 text-center ${item?.is_available ? 'bg-green-100' : 'bg-red-100'}`}>
                      {item?.is_available ? '✓' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div>Loading...</div>}
      </div>
    </>
  );
}

export default function AdminDashboard({ user }) {
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
  const [jamMulai, setJamMulai] = useState('08:00');
  const [jamSelesai, setJamSelesai] = useState('09:30');
  const [mentorOptions, setMentorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [mingguKe, setMingguKe] = useState(1);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/kelas'),
      api.get('/mentors'),
      api.get('/jadwal-sesi'),
      api.get('/permintaan-jadwal'),
      api.get('/mata-pelajaran'),
    ]).then(([kelasRes, mentorRes, jadwalRes, permintaanRes, mapelRes]) => {
      setKelas(kelasRes.data);
      setMapel(mapelRes.data);
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
    });
  }, []);

  // Fetch mentor yang mampu mapel & available di waktu tsb
  useEffect(() => {
    if (!selectedMapel || !selectedTanggal || !selectedSesi || !selectedKelas) {
      setMentorOptions([]);
      setSelectedMentor(''); // Reset selected mentor
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

  // Reset selectedMentor jika mentor yang dipilih tidak ada dalam options yang baru
  useEffect(() => {
    if (selectedMentor && mentorOptions.length > 0) {
      const mentorExists = mentorOptions.some(m => m.id.toString() === selectedMentor.toString());
      if (!mentorExists) {
        setSelectedMentor('');
      }
    }
  }, [mentorOptions, selectedMentor]);

  const handleApprove = (id) => {
    api.post(`/permintaan-jadwal/approve`, { id })
      .then(() => setPermintaan(p => p.map(x => x.id === id ? { ...x, status: 'approved' } : x)));
  };
  const handleReject = (id) => {
    api.post(`/permintaan-jadwal/reject`, { id })
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
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      status: 'scheduled',
      mata_pelajaran_id: selectedMapel,
    })
      .then(res => {
        setAssignSuccess('Jadwal berhasil ditambahkan!');
        setJadwal(j => [...j, res.data]);
      })
      .catch(err => {
        setAssignError(err.response?.data?.error || 'Gagal menambah jadwal');
      })
      .finally(() => setAssignLoading(false));
  };

  return (
    <>
      <Header user={user} onLogout={() => window.location.reload()} />
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6 text-green-800">Dashboard Admin</h1>
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <Button key={t.key} variant={tab === t.key ? 'success' : 'secondary'} onClick={() => setTab(t.key)}>{t.label}</Button>
          ))}
        </div>
        {tab === 'jadwal' && (
          <Card className="shadow-xl rounded-2xl bg-white/90 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2 text-green-700">Semua Jadwal Sesi</h2>
            {/* Form assign jadwal */}
            <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAssignJadwal}>
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
                  {SESI_LABELS.map(s => <option key={s} value={s}>Sesi {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1">Jam Mulai</label>
                <input type="time" value={jamMulai} onChange={e => setJamMulai(e.target.value)} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block mb-1">Jam Selesai</label>
                <input type="time" value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} className="w-full border rounded p-2" required />
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
                {mentorOptions.length === 0 && !mentorOptionsLoading && selectedMapel && selectedTanggal && selectedSesi && selectedKelas && (
                  <div className="text-sm text-orange-600 mt-1">
                    Tidak ada mentor yang available untuk mata pelajaran, tanggal, dan sesi yang dipilih
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex gap-2 items-center">
                <Button type="submit" variant="success" disabled={assignLoading}>Assign Jadwal</Button>
                {assignError && <span className="text-red-600">{assignError}</span>}
                {assignSuccess && <span className="text-green-600">{assignSuccess}</span>}
              </div>
            </form>
            {/* Tabel jadwal sesi */}
            {loading ? <div>Loading...</div> : (
              <table className="min-w-full border rounded-xl overflow-hidden shadow-md bg-white">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border px-2 py-1">Kelas</th>
                    <th className="border px-2 py-1">Mata Pelajaran</th>
                    <th className="border px-2 py-1">Mentor</th>
                    <th className="border px-2 py-1">Tanggal</th>
                    <th className="border px-2 py-1">Sesi</th>
                    <th className="border px-2 py-1">Jam</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.map(j => (
                    <tr key={j.id} className="hover:bg-green-50 transition">
                      <td className="border px-2 py-1">{kelasMap[j.kelas_id] || '-'}</td>
                      <td className="border px-2 py-1">{mapelMap[j.mata_pelajaran_id] || '-'}</td>
                      <td className="border px-2 py-1">{mentorMap[j.mentor_id] || '-'}</td>
                      <td className="border px-2 py-1">{j.tanggal}</td>
                      <td className="border px-2 py-1">{j.sesi}</td>
                      <td className="border px-2 py-1">{j.jam_mulai} - {j.jam_selesai}</td>
                      <td className="border px-2 py-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow 
                          ${j.status === 'scheduled' ? 'bg-blue-200 text-blue-800' : ''}
                          ${j.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                          ${j.status === 'approved' ? 'bg-green-200 text-green-800' : ''}
                          ${j.status === 'rejected' ? 'bg-red-200 text-red-800' : ''}
                        `}>{j.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        )}
        {tab === 'permintaan' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-green-700">Permintaan Jadwal</h2>
            {loading ? <div>Loading...</div> : (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">User</th>
                    <th className="border px-2 py-1">Kelas</th>
                    <th className="border px-2 py-1">Mentor</th>
                    <th className="border px-2 py-1">Tanggal</th>
                    <th className="border px-2 py-1">Sesi</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {permintaan.map(p => (
                    <tr key={p.id}>
                      <td className="border px-2 py-1">{p.user_id}</td>
                      <td className="border px-2 py-1">{kelasMap[p.kelas_id] || '-'}</td>
                      <td className="border px-2 py-1">{mentorMap[p.mentor_id] || '-'}</td>
                      <td className="border px-2 py-1">{p.tanggal}</td>
                      <td className="border px-2 py-1">{p.sesi}</td>
                      <td className="border px-2 py-1">{p.status}</td>
                      <td className="border px-2 py-1">
                        {p.status === 'pending' && (
                          <>
                            <Button variant="success" size="sm" onClick={() => handleApprove(p.id)}>Approve</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleReject(p.id)}>Reject</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        )}
        {tab === 'availability' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-green-700">Availability Mentor</h2>
            <div className="flex gap-2 mb-2 items-center">
              <label>Pilih Mentor:</label>
              <select value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)} className="border rounded px-2 py-1">
                <option value="">-- Pilih Mentor --</option>
                {mentors.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </select>
              <label>Minggu ke:</label>
              <input type="number" min={1} max={53} value={mingguKe} onChange={e => setMingguKe(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
            </div>
            {selectedMentor && mingguKe ? (
              <AvailabilityGrid mentorId={selectedMentor} mingguKe={mingguKe} setMingguKe={setMingguKe} />
            ) : <div>Pilih mentor dan minggu untuk melihat availability.</div>}
          </Card>
        )}
        {/* Tab silabus, history, notifikasi bisa diimplementasikan selanjutnya */}
      </PageContainer>
    </>
  );
} 