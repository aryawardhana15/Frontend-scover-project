import { useEffect, useState } from 'react';
import CalendarView from '../components/CalendarView';
import api from '../api/axios';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';

const MENTOR_ID = 1;

export default function MentorDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kelasMap, setKelasMap] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/kelas'),
      api.get('/jadwal-sesi'),
    ])
      .then(([kelasRes, jadwalRes]) => {
        const kelasObj = {};
        kelasRes.data.forEach(k => { kelasObj[k.id] = k.nama; });
        setKelasMap(kelasObj);
        const mapped = jadwalRes.data.filter(item => item.mentor_id === MENTOR_ID).map(item => ({
          id: item.id,
          title: `Sesi ${item.sesi} - ${kelasObj[item.kelas_id] || 'Kelas'}`,
          start: new Date(item.tanggal + 'T' + item.jam_mulai),
          end: new Date(item.tanggal + 'T' + item.jam_selesai),
        }));
        setEvents(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError('Gagal mengambil data jadwal/kelas');
        setLoading(false);
      });
  }, []);

  const handleInputAvailability = () => {
    alert('Fitur input/ubah availability mentor (akan diimplementasikan)');
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-green-800">Dashboard Mentor</h1>
        <p className="mb-4 text-gray-600">Lihat jadwal mengajar dan atur ketersediaan sesi Anda di sini.</p>
      </div>
      <Button onClick={handleInputAvailability} variant="success" size="md" className="mb-4">Input/Ubah Availability</Button>
      <Card>
        <h2 className="text-xl font-semibold mb-2 text-green-700">Kalender Jadwal Mengajar</h2>
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