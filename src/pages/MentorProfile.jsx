import { useEffect, useState } from 'react';
import api from '../config/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { PencilIcon, CameraIcon } from '@heroicons/react/24/solid';

export default function MentorProfile({ user, onBack, onProfileUpdate }) {
  const [mapel, setMapel] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch mentor data from database
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const [mapelRes, mentorRes] = await Promise.all([
          api.get(`/mentor-mata-pelajaran/by-mentor?mentor_id=${user.id}`),
          api.get(`/mentors/${user.id}`)
        ]);
        
        setMapel(mapelRes.data);
        setMentorData(mentorRes.data);
        console.log('👤 [MENTOR PROFILE] Mentor data loaded:', mentorRes.data);
      } catch (error) {
        console.error('❌ [MENTOR PROFILE] Error loading data:', error);
        setMapel([]);
        setMentorData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('foto_profil', selectedFile);

    api.put(`/mentors/${user.id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        onProfileUpdate(res.data);
        setSelectedFile(null);
        setPreview(null);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal mengunggah gambar.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const profileImageUrl = preview || (user?.foto_profil ? `https://myscover.my.id/${user.foto_profil}` : null);

  return (
    <div className="max-w-lg mx-auto mt-8">
      <Card className="p-8 flex flex-col items-center shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-green-50">
        <div className="relative">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 shadow-lg">
              {(mentorData?.nama || user?.nama || user?.name || 'M')[0].toUpperCase()}
            </div>
          )}
          <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition">
            <CameraIcon className="h-5 w-5 text-gray-600" />
            <input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        {selectedFile && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">File dipilih: {selectedFile.name}</p>
            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={uploading} size="sm">
                {uploading ? 'Mengunggah...' : 'Unggah Gambar'}
              </Button>
              <Button onClick={() => { setSelectedFile(null); setPreview(null); }} variant="secondary" size="sm">Batal</Button>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold mt-4 mb-1 text-gray-800">
              {mentorData?.nama || user?.nama || user?.name || 'Mentor'}
            </div>
            <div className="text-gray-600 mb-4">
              {mentorData?.email || user?.email || 'mentor@example.com'}
            </div>
            {mentorData?.status && (
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  mentorData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : mentorData.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {mentorData.status === 'active' ? 'Aktif' : 
                          mentorData.status === 'pending' ? 'Menunggu Persetujuan' : 
                          mentorData.status}
                </span>
              </div>
            )}
          </>
        )}
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
