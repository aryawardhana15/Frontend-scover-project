import { useEffect, useState } from 'react';
import api from '../api/axios';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import MentorProfile from './MentorProfile';

const WEEK_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESI_LABELS = ['1', '2', '3', '4', '5'];

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function getWeekRange(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const weekStart = new Date(simple);
  weekStart.setDate(simple.getDate() - ((dow + 6) % 7)); // Senin
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return [weekStart, weekEnd];
}

function AvailabilityGrid({ mentorId, mingguKe, onSuccess }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  // Debug: log setiap render data
  useEffect(() => {
    console.log('Render data:', data);
  }, [data]);

  // Generate default grid
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
    if (!mentorId || !mingguKe) return;
    setLoading(true);
    api.get(`/availability-mentor?mentor_id=${mentorId}&minggu_ke=${mingguKe}`)
      .then(res => {
        let avail = generateDefaultGrid();
        if (res.data && res.data.length > 0) {
          avail = avail.map(item => {
            const found = res.data.find(d => d.hari === item.hari && d.sesi === item.sesi);
            return found ? { ...item, ...found, is_available: !!found.is_available } : item;
          });
        }
        setData(avail);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal mengambil data availability');
        setLoading(false);
      });
  }, [mentorId, mingguKe]);

  const handleCheck = (hari, sesi, checked) => {
    setData(prev => {
      const idx = prev.findIndex(item => item.hari === hari && item.sesi === sesi);
      if (idx === -1) return prev;
      const newArr = [...prev];
      newArr[idx] = { ...newArr[idx], is_available: checked };
      return newArr;
    });
  };

  const handleSubmit = () => {
    console.log('handleSubmit called', { mentorId, mingguKe, data });
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
    <Card className="mb-8">
      <h2 className="text-xl font-bold mb-2 text-green-800">Input/Ubah Availability Mingguan</h2>
      <div className="mb-2 text-gray-700 font-medium">
        Minggu ke-{mingguKe}: {weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} – {weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} <br/>
        Bulan: {monthLabel}
      </div>
      {loading ? <div>Loading...</div> : (
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
                      <td key={`${hari}-${sesi}`} className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={item?.is_available || false}
                          onChange={e => handleCheck(hari, sesi, e.target.checked)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {conflicts.length > 0 && (
            <div className="mb-2 text-red-600">
              <b>Tabrakan jadwal:</b>
              <ul className="list-disc ml-5">
                {conflicts.map((c, i) => (
                  <li key={i}>{c.type === 'double_booking' ? `Double booking di ${c.tanggal} sesi ${c.sesi}` : `Kelas sama 2x di hari yang sama (${c.tanggal})`}</li>
                ))}
              </ul>
            </div>
          )}
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={handleSubmit} variant="success" disabled={loading}>Simpan</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function MentorDashboard({ user }) {
  const [showProfile, setShowProfile] = useState(false);
  console.log('User login:', user);
  // Ambil mentorId dari user.id atau user.mentor_id (fallback)
  const mentorId = user?.id !== undefined ? user.id : user?.mentor_id;
  const [mingguKe, setMingguKe] = useState(getCurrentWeekNumber());

  if (showProfile) {
    return <MentorProfile user={user} onBack={() => setShowProfile(false)} />;
  }
  return (
    <>
      <Header user={user} onLogout={() => window.location.reload()} onProfile={() => setShowProfile(true)} />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1 text-green-800">Dashboard Mentor</h1>
          <p className="mb-4 text-gray-600">Atur ketersediaan sesi Anda per minggu di bawah ini.</p>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-gray-600">Minggu ke:</label>
          <input type="number" min={1} max={53} value={mingguKe} onChange={e => setMingguKe(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
          <Button onClick={() => setMingguKe(mingguKe - 1)} disabled={mingguKe <= 1} size="sm">Minggu Sebelumnya</Button>
          <Button onClick={() => setMingguKe(mingguKe + 1)} size="sm">Minggu Berikutnya</Button>
        </div>
        <AvailabilityGrid mentorId={mentorId} mingguKe={mingguKe} onSuccess={() => {}} />
      </PageContainer>
    </>
  );
} 