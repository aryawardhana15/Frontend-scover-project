import { useState } from 'react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Header({ user, onLogout, onProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          Dashboard Penjadwalan
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <UserCircleIcon className="h-8 w-8" />
            <span className="font-semibold">{user.nama}</span>
          </div>
          {onProfile && (
            <button
              onClick={onProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Profil</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-10 backdrop-blur-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex items-center space-x-2 text-white px-3 py-2">
              <UserCircleIcon className="h-8 w-8" />
              <span className="font-semibold">{user.nama}</span>
            </div>
            {onProfile && (
              <button
                onClick={() => {
                  onProfile();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-white rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span>Profil</span>
              </button>
            )}
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-white bg-red-500 bg-opacity-80 rounded-md hover:bg-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
