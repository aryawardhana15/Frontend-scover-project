import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const DashboardTab = ({ 
  stats,
  jadwal,
  permintaan,
  silabus,
  users,
  mentors,
  historyMateri,
  pengumuman
}) => {
  const statCards = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-100 to-blue-200'
    },
    {
      title: 'Total Mentors',
      value: mentors?.length || 0,
      icon: AcademicCapIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-100 to-green-200'
    },
    {
      title: 'Jadwal Sesi',
      value: jadwal?.length || 0,
      icon: CalendarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-100 to-purple-200'
    },
    {
      title: 'Silabus',
      value: silabus?.length || 0,
      icon: DocumentTextIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-100 to-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-r ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 text-gradient-to-r ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
          <TableCellsIcon className="h-5 w-5 text-fuchsia-600" />
          Aktivitas Terkini
        </h3>
        <div className="space-y-3">
          {Array.from([1, 2, 3, 4, 5]).map(i => (
            <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50/50 rounded-lg transition-colors">
              <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 p-2 rounded-full">
                <LightBulbIcon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aktivitas {i}</p>
                <p className="text-xs text-gray-500">Deskripsi aktivitas terkini</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="font-medium text-gray-800 mb-4">Permintaan Jadwal</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">
                {permintaan?.filter(p => p.status === 'pending').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="text-sm font-medium text-green-600">
                {permintaan?.filter(p => p.status === 'approved').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rejected</span>
              <span className="text-sm font-medium text-red-600">
                {permintaan?.filter(p => p.status === 'rejected').length || 0}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="font-medium text-gray-800 mb-4">History Materi</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Laporan</span>
              <span className="text-sm font-medium text-blue-600">
                {historyMateri?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Minggu Ini</span>
              <span className="text-sm font-medium text-green-600">
                {historyMateri?.filter(h => {
                  const date = new Date(h.tanggal);
                  const now = new Date();
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return date >= weekAgo;
                }).length || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardTab;
