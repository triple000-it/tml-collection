'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, Crown, Star, Gift, Shield } from 'lucide-react';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@tmlcollect.com';

  const handleSignOut = async () => {
    await signOut();
    if (onClose) onClose();
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user.email?.split('@')[0]}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Admin Panel - Only show for admin users */}
            {isAdmin && (
              <button 
                onClick={() => {
                  router.push('/admin');
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Admin Panel</span>
              </button>
            )}
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              <Crown className="w-5 h-5" />
              <span>VIP Status</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              <Star className="w-5 h-5" />
              <span>My Collection</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              <Gift className="w-5 h-5" />
              <span>Rewards</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-700 py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
