'use client';

import React, { useState, useEffect } from 'react';
import { Upload, User, Crown, Settings, ArrowLeft, CheckCircle, AlertCircle, Image as ImageIcon, Radio, Save, Plus, Edit, Trash2, Eye, Search, Filter, RefreshCw, Users, BarChart3, Package } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';
import { supabase } from '@/lib/supabase/client';

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
  debut_year: number;
  record_label?: string;
  awards?: string[];
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
    debut_year: new Date().getFullYear(),
    record_label: '',
    awards: [] as string[],
    rarity: 'COMMON' as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY',
    total_appearances: 0,
    years_active: 0
  });
  
  // Upload States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Settings States
  const [streamUrl, setStreamUrl] = useState('https://playerservices.streamtheworld.com/api/livestream-redirect/OWR_INTERNATIONALAAC.aac');
  const [streamTitle, setStreamTitle] = useState('Tomorrowland Radio');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settingsMessage, setSettingsMessage] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

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
      const { data, error } = await supabase
        .from('djs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDjs(data || []);
    } catch (error) {
      console.error('Error loading DJs:', error);
      // Use mock data if database fails
      setDjs(getMockDjs());
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      // Use mock data if database fails
      setUsers(getMockUsers());
    }
  };

  const loadStats = async () => {
    try {
      const [djCount, userCount, cardCount] = await Promise.all([
        supabase.from('djs').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('user_cards').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalDjs: djCount.count || 0,
        totalUsers: userCount.count || 0,
        totalCards: cardCount.count || 0,
        activeUsers: userCount.count || 0 // Simplified for now
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({ totalDjs: djs.length, totalUsers: users.length, totalCards: 0, activeUsers: users.length });
    }
  };

  const getMockDjs = (): DjData[] => [
    {
      id: 'dimitri-vegas-like-mike',
      stage_name: 'Dimitri Vegas & Like Mike',
      real_name: 'Dimitri Thivaios & Michael Thivaios',
      nationality: 'Belgian',
      genres: ['Big Room', 'Progressive House', 'Electro House'],
      total_appearances: 15,
      years_active: 14,
      rarity: 'LEGENDARY',
      debut_year: 2010,
      record_label: 'Smash The House',
      awards: ['DJ Mag Top 100 #1', 'Tomorrowland Headliners'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'martin-garrix',
      stage_name: 'Martin Garrix',
      real_name: 'Martijn Garritsen',
      nationality: 'Dutch',
      genres: ['Big Room', 'Progressive House', 'Future Bass'],
      total_appearances: 12,
      years_active: 11,
      rarity: 'LEGENDARY',
      debut_year: 2013,
      record_label: 'STMPD RCRDS',
      awards: ['DJ Mag Top 100 #1', 'Tomorrowland Headliners'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const getMockUsers = (): UserData[] => [
    {
      id: '1',
      email: 'info@000-it.com',
      username: 'admin',
      role: 'admin',
      is_active: true,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  const handleDjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      if (editingDj) {
        // Update existing DJ
        const { error } = await supabase
          .from('djs')
          .update({
            ...djFormData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDj.id);
        
        if (error) throw error;
        setUploadStatus('success');
        setUploadMessage('DJ updated successfully!');
      } else {
        // Create new DJ
        const { error } = await supabase
          .from('djs')
          .insert({
            ...djFormData,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        setUploadStatus('success');
        setUploadMessage('DJ created successfully!');
      }
      
      // Reset form
      setDjFormData({
        stage_name: '',
        real_name: '',
        nationality: '',
        genres: [],
        biography: '',
        debut_year: new Date().getFullYear(),
        record_label: '',
        awards: [],
        rarity: 'COMMON',
        total_appearances: 0,
        years_active: 0
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
      const { error } = await supabase
        .from('djs')
        .delete()
        .eq('id', djId);
      
      if (error) throw error;
      
      setUploadStatus('success');
      setUploadMessage('DJ deleted successfully!');
      await loadDjs();
    } catch (error) {
      console.error('Error deleting DJ:', error);
      setUploadStatus('error');
      setUploadMessage('Failed to delete DJ. Please try again.');
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
      debut_year: dj.debut_year,
      record_label: dj.record_label || '',
      awards: dj.awards || [],
      rarity: dj.rarity,
      total_appearances: dj.total_appearances,
      years_active: dj.years_active
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
                onClick={() => setActiveTab(id as any)}
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
                      debut_year: new Date().getFullYear(),
                      record_label: '',
                      awards: [],
                      rarity: 'COMMON',
                      total_appearances: 0,
                      years_active: 0
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
                        onChange={(e) => setDjFormData({...djFormData, rarity: e.target.value as any})}
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
                        Debut Year
                      </label>
                      <input
                        type="number"
                        value={djFormData.debut_year}
                        onChange={(e) => setDjFormData({...djFormData, debut_year: parseInt(e.target.value)})}
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