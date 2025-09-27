import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  UsersIcon,
  MegaphoneIcon,
  BookOpenIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../config/api';
import {
  DashboardTab,
  JadwalSesiTab,
  SilabusTab,
  PermintaanJadwalTab,
  KetersediaanMentorTab,
  UsersTab,
  PengumumanTab,
  HistoryMateriTab,
  PendingMentorsTab
} from '../components/AdminTabs';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { key: 'jadwal-sesi', label: 'Jadwal Sesi', icon: CalendarIcon },
  { key: 'silabus', label: 'Silabus', icon: DocumentTextIcon },
  { key: 'permintaan-jadwal', label: 'Permintaan Jadwal', icon: ClipboardDocumentListIcon },
  { key: 'ketersediaan-mentor', label: 'Ketersediaan Mentor', icon: ClockIcon },
  { key: 'users', label: 'Users', icon: UsersIcon },
  { key: 'pengumuman', label: 'Pengumuman', icon: MegaphoneIcon },
  { key: 'history-materi', label: 'History Materi', icon: BookOpenIcon },
  { key: 'pending-mentors', label: 'Pending Mentors', icon: UserPlusIcon }
];

const AdminDashboardOptimized = () => {
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [jadwal, setJadwal] = useState([]);
  const [permintaan, setPermintaan] = useState([]);
  const [silabus, setSilabus] = useState([]);
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [historyMateri, setHistoryMateri] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  
  // Maps for quick lookup
  const [kelasMap, setKelasMap] = useState({});
  const [mentorMap, setMentorMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        jadwalRes,
        permintaanRes,
        silabusRes,
        usersRes,
        mentorsRes,
        kelasRes,
        mapelRes,
        historyMateriRes,
        pengumumanRes,
        pendingMentorsRes
      ] = await Promise.all([
        api.get('/jadwal-sesi'),
        api.get('/permintaan-jadwal'),
        api.get('/silabus'),
        api.get('/users'),
        api.get('/mentors'),
        api.get('/kelas'),
        api.get('/mata-pelajaran'),
        api.get('/history-materi'),
        api.get('/pengumuman'),
        api.get('/admin/pending-mentors')
      ]);

      setJadwal(jadwalRes.data || []);
      setPermintaan(permintaanRes.data || []);
      setSilabus(silabusRes.data || []);
      setUsers(usersRes.data || []);
      setMentors(mentorsRes.data || []);
      setKelas(kelasRes.data || []);
      setMapel(mapelRes.data || []);
      setHistoryMateri(historyMateriRes.data || []);
      setPengumuman(pengumumanRes.data || []);
      setPendingMentors(pendingMentorsRes.data || []);

      // Create maps for quick lookup
      const kelasMapData = {};
      (kelasRes.data || []).forEach(k => {
        kelasMapData[k.id] = k.nama;
      });
      setKelasMap(kelasMapData);

      const mentorMapData = {};
      (mentorsRes.data || []).forEach(m => {
        mentorMapData[m.id] = m.nama;
      });
      setMentorMap(mentorMapData);

      const mapelMapData = {};
      (mapelRes.data || []).forEach(mp => {
        mapelMapData[mp.id] = mp.nama;
      });
      setMapelMap(mapelMapData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderTabContent = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <DashboardTab
            stats={{}}
            jadwal={jadwal}
            permintaan={permintaan}
            silabus={silabus}
            users={users}
            mentors={mentors}
            historyMateri={historyMateri}
            pengumuman={pengumuman}
          />
        );
      case 'jadwal-sesi':
        return (
          <JadwalSesiTab
            jadwal={jadwal}
            kelasMap={kelasMap}
            mentorMap={mentorMap}
            mapelMap={mapelMap}
            mentors={mentors}
            kelas={kelas}
            mapel={mapel}
            onRefresh={fetchAllData}
          />
        );
      case 'silabus':
        return (
          <SilabusTab
            silabus={silabus}
            onRefresh={fetchAllData}
          />
        );
      case 'permintaan-jadwal':
        return (
          <PermintaanJadwalTab
            permintaan={permintaan}
            onRefresh={fetchAllData}
          />
        );
      case 'ketersediaan-mentor':
        return <KetersediaanMentorTab />;
      case 'users':
        return <UsersTab users={users} />;
      case 'pengumuman':
        return (
          <PengumumanTab
            pengumuman={pengumuman}
            onRefresh={fetchAllData}
          />
        );
      case 'history-materi':
        return <HistoryMateriTab historyMateri={historyMateri} />;
      case 'pending-mentors':
        return (
          <PendingMentorsTab
            pendingMentors={pendingMentors}
            onRefresh={fetchAllData}
          />
        );
      default:
        return <div>Tab tidak ditemukan</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola sistem penjadwalan pembelajaran</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
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
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <t.icon className="h-5 w-5" />
                    <span className="font-medium">{t.label}</span>
                  </motion.button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOptimized;
