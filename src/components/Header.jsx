import React from 'react';

export default function Header({ user, onLogout, onProfile }) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-green-400 shadow-lg rounded-b-xl px-6 py-4 flex items-center justify-between mb-8">
      <div className="text-2xl font-bold text-white tracking-wide drop-shadow">Dashboard Penjadwalan</div>
      <div className="flex items-center gap-4">
        <span className="bg-white/80 px-4 py-2 rounded-full font-semibold text-gray-800 shadow flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-lg">
            {user?.nama ? user.nama[0].toUpperCase() : 'U'}
          </span>
          {user?.nama || user?.email || 'User'}
        </span>
        {onProfile && (
          <button onClick={onProfile} className="bg-white/80 hover:bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow transition">Profil</button>
        )}
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition">Logout</button>
      </div>
    </header>
  );
} 