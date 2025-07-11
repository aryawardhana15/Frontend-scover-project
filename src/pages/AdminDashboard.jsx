import { useEffect, useState } from 'react';
import CalendarView from '../components/CalendarView';
import api from '../api/axios';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kelasMap, setKelasMap] = useState({});
  const [mentorMap, setMentorMap] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/kelas'),
      api.get('/mentors'),
      api.get('/jadwal-sesi'),
    ])
      .then(([kelasRes, mentorRes, jadwalRes]) => {
        const kelasObj = {};
        kelasRes.data.forEach(k => { kelasObj[k.id] = k.nama; });
        setKelasMap(kelasObj);
        const mentorObj = {};
        mentorRes.data.forEach(m => { mentorObj[m.id] = m.nama; });
        setMentorMap(mentorObj);
        const mapped = jadwalRes.data.map(item => ({
          id: item.id,
          title: `Sesi ${item.sesi} - ${kelasObj[item.kelas_id] || 'Kelas'} (${mentorObj[item.mentor_id] || 'Mentor'})`,
          start: new Date(item.tanggal + 'T' + item.jam_mulai),
          end: new Date(item.tanggal + 'T' + item.jam_selesai),
        }));
        setEvents(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError('Gagal mengambil data jadwal/kelas/mentor');
        setLoading(false);
      });
  }, []);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-blue-800">Dashboard Admin</h1>
        <p className="mb-4 text-gray-600">Kelola jadwal, approval, dan monitoring sesi mentoring di sini.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">{events.length}</span>
          <span className="text-gray-500">Total Sesi Terjadwal</span>
        </Card>
        <Card className="flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">5</span>
          <span className="text-gray-500">Mentor Aktif</span>
        </Card>
        <Card className="flex flex-col items-center">
          <span className="text-2xl font-bold text-yellow-600">3</span>
          <span className="text-gray-500">Permintaan Pending</span>
        </Card>
      </div>
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Kalender Jadwal Sesi</h2>
          <Button variant="primary" size="sm">+ Tambah Jadwal</Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading jadwal...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <CalendarView
            events={events}
            onSelectEvent={e => alert(e.title)}
            onSelectSlot={slotInfo => console.log(slotInfo)}
          />
        )}
      </Card>
    </PageContainer>
  );
} 