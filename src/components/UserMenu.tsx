import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../lib/auth';

function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span>{user?.name?.[0] || '👋'}</span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-1">
          <button
            onClick={() => {
              setShowMenu(false);
              // Add profile settings functionality
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <UserIcon size={16} className="mr-2" />
            Profile Settings
          </button>
          
          <button
            onClick={() => {
              setShowMenu(false);
              // Add app settings functionality
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} className="mr-2" />
            App Settings
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
