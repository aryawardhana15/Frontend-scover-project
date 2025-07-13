import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MentorProfile({ user, onBack }) {
  const [mapel, setMapel] = useState([]);
  useEffect(() => {
    if (!user?.id) return;
    api.get(`/mentor-mata-pelajaran/by-mentor?mentor_id=${user.id}`)
      .then(res => setMapel(res.data))
      .catch(() => setMapel([]));
  }, [user]);

  return (
    <div className="max-w-lg mx-auto mt-8">
      <Card className="p-8 flex flex-col items-center shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-green-50">
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 shadow-lg">
          {user?.nama ? user.nama[0].toUpperCase() : 'M'}
        </div>
        <div className="text-2xl font-bold mb-1 text-gray-800">{user?.nama}</div>
        <div className="text-gray-600 mb-4">{user?.email}</div>
        <div className="w-full mb-2">
          <div className="font-semibold text-gray-700 mb-1">Mata Pelajaran yang Diajarkan:</div>
          <div className="flex flex-wrap gap-2">
            {mapel.length === 0 && <span className="text-gray-400">Belum ada mapel</span>}
            {mapel.map(m => (
              <span key={m.mata_pelajaran_id} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shadow">
                {m.nama_mapel}
              </span>
            ))}
          </div>
        </div>
        <Button onClick={onBack} className="mt-6" variant="secondary">Kembali ke Dashboard</Button>
      </Card>
    </div>
  );
} 