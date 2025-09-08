'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Crown, Settings, ArrowLeft, CheckCircle, AlertCircle, Plus, Edit, Trash2, Eye, Search, RefreshCw, Users, BarChart3, Package } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';
import ImageUpload from '@/components/admin/ImageUpload';

interface DjData {
  id: string;
  stage_name: string;
  real_name?: string;
  nationality: string;
  genres: string[];
  total_appearances: number;
  years_active: number;
  image_url?: string;
  back_image_url?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  biography?: string;
  first_tomorrowland_year: number;
  record_label?: string;
  categories: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

interface StatsData {
  totalDjs: number;
  totalUsers: number;
  totalCards: number;
  activeUsers: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'djs' | 'users' | 'settings'>('dashboard');
  const [djs, setDjs] = useState<DjData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<StatsData>({ totalDjs: 0, totalUsers: 0, totalCards: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  
  // DJ Management States
  const [showDjForm, setShowDjForm] = useState(false);
  const [editingDj, setEditingDj] = useState<DjData | null>(null);
  const [djFormData, setDjFormData] = useState({
    stage_name: '',
    real_name: '',
    nationality: '',
    genres: [] as string[],
    biography: '',
    first_tomorrowland_year: new Date().getFullYear(),
    record_label: '',
    rarity: 'COMMON' as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY',
    total_appearances: 0,
    years_active: 0,
    categories: ['mainstage'] as string[],
    image_url: '',
    back_image_url: ''
  });
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Settings States
  const [streamUrl, setStreamUrl] = useState('https://playerservices.streamtheworld.com/api/livestream-redirect/OWR_INTERNATIONALAAC.aac');
  const [streamTitle, setStreamTitle] = useState('Tomorrowland Radio');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [databaseStatus, setDatabaseStatus] = useState<'connected' | 'error' | 'checking'>('checking');

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up periodic refresh for real-time-like updates
  useEffect(() => {
    // Refresh data every 30 seconds to simulate real-time updates
    const refreshInterval = setInterval(() => {
      console.log('Refreshing dashboard data...');
      loadDashboardData();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDjs(),
        loadUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDjs = async () => {
    try {
      console.log('Loading DJs via API route...');
      
      const response = await fetch('/api/admin/djs');
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error:', result.error);
        setDatabaseStatus('error');
        setDjs([]);
        setUploadStatus('error');
        setUploadMessage('Failed to load DJs: ' + result.error);
        return;
      }
      
      console.log('✅ Loaded', result.data?.length || 0, 'DJs from database');
      setDatabaseStatus('connected');
      setDjs(result.data || []);
    } catch (error) {
      console.error('API connection failed:', error);
      setDjs([]);
      setDatabaseStatus('error');
      setUploadStatus('error');
      setUploadMessage('Failed to connect to API. Please check your server configuration.');
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users via API route...');
      
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error:', result.error);
        setUsers([]);
        return;
      }
      
      console.log('✅ Loaded', result.data?.length || 0, 'users from database');
      setUsers(result.data || []);
    } catch (error) {
      console.error('API connection failed:', error);
      setUsers([]);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Loading stats via API route...');
      
      const response = await fetch('/api/admin/stats');
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error:', result.error);
        setStats({ 
          totalDjs: 0, 
          totalUsers: 0, 
          totalCards: 0, 
          activeUsers: 0 
        });
        return;
      }
      
      console.log('✅ Loaded stats from database');
      setStats(result.data);
    } catch (error) {
      console.error('API connection failed for stats:', error);
      setStats({ 
        totalDjs: 0, 
        totalUsers: 0, 
        totalCards: 0, 
        activeUsers: 0 
      });
    }
  };


  const handleDjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const url = editingDj ? '/api/admin/djs' : '/api/admin/djs';
      const method = editingDj ? 'PUT' : 'POST';
      const body = editingDj 
        ? { id: editingDj.id, ...djFormData }
        : djFormData;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error:', result.error);
        setUploadStatus('error');
        setUploadMessage('Failed to save DJ. API error: ' + result.error);
        return;
      }
      
      setUploadStatus('success');
      setUploadMessage(editingDj ? 'DJ updated successfully!' : 'DJ created successfully!');
      
      // Reset form
      setDjFormData({
        stage_name: '',
        real_name: '',
        nationality: '',
        genres: [],
        biography: '',
        first_tomorrowland_year: new Date().getFullYear(),
        record_label: '',
        rarity: 'COMMON',
        total_appearances: 0,
        years_active: 0,
        categories: ['mainstage'],
        image_url: '',
        back_image_url: ''
      });
      setEditingDj(null);
      setShowDjForm(false);
      
      // Reload data
      await loadDjs();
      
    } catch (error) {
      console.error('Error saving DJ:', error);
      setUploadStatus('error');
      setUploadMessage('Failed to save DJ. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDj = async (djId: string) => {
    if (!confirm('Are you sure you want to delete this DJ?')) return;
    
    try {
      const response = await fetch(`/api/admin/djs?id=${djId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error:', result.error);
        setUploadStatus('error');
        setUploadMessage('Failed to delete DJ. API error: ' + result.error);
        return;
      }
      
      setUploadStatus('success');
      setUploadMessage('DJ deleted successfully!');
      await loadDjs();
    } catch (error) {
      console.error('API connection failed:', error);
      setUploadStatus('error');
      setUploadMessage('Failed to delete DJ. Connection error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEditDj = (dj: DjData) => {
    setEditingDj(dj);
    setDjFormData({
      stage_name: dj.stage_name,
      real_name: dj.real_name || '',
      nationality: dj.nationality,
      genres: dj.genres,
      biography: dj.biography || '',
      first_tomorrowland_year: dj.first_tomorrowland_year,
      record_label: dj.record_label || '',
      rarity: dj.rarity,
      total_appearances: dj.total_appearances,
      years_active: dj.years_active,
      categories: dj.categories || ['mainstage'],
      image_url: dj.image_url || '',
      back_image_url: dj.back_image_url || ''
    });
    setShowDjForm(true);
  };

  const filteredDjs = djs.filter(dj => {
    const matchesSearch = dj.stage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'ALL' || dj.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });


  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'text-yellow-400';
      case 'EPIC': return 'text-purple-400';
      case 'RARE': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'bg-yellow-400/10 border-yellow-400/20';
      case 'EPIC': return 'bg-purple-400/10 border-purple-400/20';
      case 'RARE': return 'bg-blue-400/10 border-blue-400/20';
      default: return 'bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="glass-effect border-b border-gray-800/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">
                      Admin Dashboard
                    </div>
                    <div className="text-gray-400 text-sm">
                      TML Collections Management
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={loadDashboardData}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </button>
                
                {/* Database Status Indicator */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                  databaseStatus === 'connected' 
                    ? 'bg-green-500/20 text-green-400' 
                    : databaseStatus === 'error'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    databaseStatus === 'connected' 
                      ? 'bg-green-400' 
                      : databaseStatus === 'error'
                      ? 'bg-red-400'
                      : 'bg-yellow-400 animate-pulse'
                  }`}></div>
                  <span>
                    {databaseStatus === 'connected' ? 'Database Connected' : 
                     databaseStatus === 'error' ? 'Database Error' : 'Checking...'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'djs', label: 'DJs', icon: User },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'dashboard' | 'djs' | 'users' | 'settings')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-white text-black'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800/70'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total DJs', value: stats.totalDjs, icon: User, color: 'blue' },
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'green' },
                  { label: 'Total Cards', value: stats.totalCards, icon: Package, color: 'purple' },
                  { label: 'Active Users', value: stats.activeUsers, icon: BarChart3, color: 'yellow' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{label}</p>
                        <p className="text-3xl font-bold text-white">{value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${color}-400`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {djs.slice(0, 5).map((dj) => (
                    <div key={dj.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{dj.stage_name}</p>
                          <p className="text-gray-400 text-sm">{dj.nationality} • {dj.rarity}</p>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(dj.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DJs Tab */}
          {activeTab === 'djs' && (
            <div className="space-y-6">
              {/* DJ Management Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">DJ Management</h2>
                  <p className="text-gray-400">Manage Tomorrowland DJs and their information</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDj(null);
                    setShowDjForm(true);
                    setDjFormData({
                      stage_name: '',
                      real_name: '',
                      nationality: '',
                      genres: [],
                      biography: '',
                      first_tomorrowland_year: new Date().getFullYear(),
                      record_label: '',
                      rarity: 'COMMON',
                      total_appearances: 0,
                      years_active: 0,
                      categories: ['mainstage'],
                      image_url: '',
                      back_image_url: ''
                    });
                  }}
                  className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add DJ</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search DJs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="ALL">All Rarities</option>
                  <option value="COMMON">Common</option>
                  <option value="RARE">Rare</option>
                  <option value="EPIC">Epic</option>
                  <option value="LEGENDARY">Legendary</option>
                </select>
              </div>

              {/* DJ List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDjs.map((dj) => (
                  <div key={dj.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{dj.stage_name}</h3>
                        {dj.real_name && (
                          <p className="text-gray-400 text-sm mb-2">{dj.real_name}</p>
                        )}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRarityBgColor(dj.rarity)} ${getRarityColor(dj.rarity)}`}>
                          {dj.rarity}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDj(dj)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDj(dj.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nationality:</span>
                        <span className="text-white">{dj.nationality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Appearances:</span>
                        <span className="text-white">{dj.total_appearances}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Years Active:</span>
                        <span className="text-white">{dj.years_active}</span>
                      </div>
                      {dj.record_label && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Label:</span>
                          <span className="text-white">{dj.record_label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DJ Form Modal */}
          {showDjForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {editingDj ? 'Edit DJ' : 'Add New DJ'}
                  </h3>
                  <button
                    onClick={() => setShowDjForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleDjSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Stage Name *
                      </label>
                      <input
                        type="text"
                        value={djFormData.stage_name}
                        onChange={(e) => setDjFormData({...djFormData, stage_name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Real Name
                      </label>
                      <input
                        type="text"
                        value={djFormData.real_name}
                        onChange={(e) => setDjFormData({...djFormData, real_name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Nationality *
                      </label>
                      <input
                        type="text"
                        value={djFormData.nationality}
                        onChange={(e) => setDjFormData({...djFormData, nationality: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Rarity
                      </label>
                      <select
                        value={djFormData.rarity}
                        onChange={(e) => setDjFormData({...djFormData, rarity: e.target.value as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="COMMON">Common</option>
                        <option value="RARE">Rare</option>
                        <option value="EPIC">Epic</option>
                        <option value="LEGENDARY">Legendary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        First Tomorrowland Year
                      </label>
                      <input
                        type="number"
                        value={djFormData.first_tomorrowland_year}
                        onChange={(e) => setDjFormData({...djFormData, first_tomorrowland_year: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Record Label
                      </label>
                      <input
                        type="text"
                        value={djFormData.record_label}
                        onChange={(e) => setDjFormData({...djFormData, record_label: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Categories
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'mainstage', label: 'Mainstage' },
                          { value: 'asot', label: 'ASOT (Trance)' },
                          { value: 'core', label: 'Core (Techno)' },
                          { value: 'qdance', label: 'Q-Dance (Hardstyle)' },
                          { value: 'elixir', label: 'Elixir (House)' },
                          { value: 'liveact', label: 'Live Act' }
                        ].map((category) => (
                          <label key={category.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={djFormData.categories.includes(category.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDjFormData({
                                    ...djFormData,
                                    categories: [...djFormData.categories, category.value]
                                  });
                                } else {
                                  setDjFormData({
                                    ...djFormData,
                                    categories: djFormData.categories.filter(c => c !== category.value)
                                  });
                                }
                              }}
                              className="w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white focus:ring-2"
                            />
                            <span className="text-gray-300">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Biography
                    </label>
                    <textarea
                      value={djFormData.biography}
                      onChange={(e) => setDjFormData({...djFormData, biography: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Images
                    </h4>
                    
                    <div className="max-w-md">
                      <ImageUpload
                        djId={editingDj?.id || ''}
                        imageType="front"
                        currentImageUrl={djFormData.image_url}
                        onImageUpdate={(url) => setDjFormData({...djFormData, image_url: url})}
                        label="Front Image"
                        aspectRatio="1/1"
                        maxSize={10}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Saving...' : (editingDj ? 'Update DJ' : 'Create DJ')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDjForm(false)}
                      className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-gray-400">Manage user accounts and permissions</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Email</th>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Username</th>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Role</th>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Status</th>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Last Login</th>
                        <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-800/30">
                          <td className="px-6 py-4 text-white">{user.email}</td>
                          <td className="px-6 py-4 text-gray-300">{user.username}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.is_active 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="text-gray-400">Configure application settings</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Audio Stream Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Stream URL
                    </label>
                    <input
                      type="url"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Stream Title
                    </label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSavingSettings(true);
                      setTimeout(() => {
                        setSavingSettings(false);
                        setSettingsStatus('success');
                        setSettingsMessage('Settings saved successfully!');
                      }, 1000);
                    }}
                    disabled={savingSettings}
                    className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Game Card Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src="/cards/BACK.png"
                        alt="Card Back Preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">Card Back Image</p>
                      <p className="text-sm text-gray-400">
                        Using default back image: /public/cards/BACK.png
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        To change the back image, replace the file at /public/cards/BACK.png
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Status Messages */}
          {(uploadStatus !== 'idle' || settingsStatus !== 'idle') && (
            <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${
              uploadStatus === 'success' || settingsStatus === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {uploadStatus === 'success' || settingsStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{uploadMessage || settingsMessage}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}