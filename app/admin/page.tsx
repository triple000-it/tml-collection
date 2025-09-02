'use client';

import React, { useState } from 'react';
import { Upload, User, Crown, Settings, ArrowLeft, CheckCircle, AlertCircle, Image as ImageIcon, Radio, Save } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';

interface DjData {
  id: string;
  stage_name: string;
  real_name?: string;
  nationality: string;
  genres: string[];
  total_appearances: number;
  years_active: number;
  image_url?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  biography?: string;
  debut_year: number;
  record_label?: string;
  awards?: string[];
}

export default function AdminPage() {
  const [selectedDj, setSelectedDj] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'settings'>('upload');
  const [streamUrl, setStreamUrl] = useState('https://playerservices.streamtheworld.com/api/livestream-redirect/OWR_INTERNATIONALAAC.aac');
  const [streamTitle, setStreamTitle] = useState('Tomorrowland Radio');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settingsMessage, setSettingsMessage] = useState('');

  // Mock DJ data
  const djs: DjData[] = [
    {
      id: 'dimitri-vegas-like-mike',
      stage_name: 'Dimitri Vegas & Like Mike',
      nationality: 'Belgian',
      genres: ['Big Room', 'Progressive House', 'Electro House'],
      total_appearances: 15,
      years_active: 14,
      rarity: 'LEGENDARY',
      debut_year: 2010,
      record_label: 'Smash The House'
    },
    {
      id: 'martin-garrix',
      stage_name: 'Martin Garrix',
      nationality: 'Dutch',
      genres: ['Big Room', 'Progressive House', 'Future Bass'],
      total_appearances: 12,
      years_active: 11,
      rarity: 'LEGENDARY',
      debut_year: 2013,
      record_label: 'STMPD RCRDS'
    },
    {
      id: 'armin-van-buuren',
      stage_name: 'Armin van Buuren',
      nationality: 'Dutch',
      genres: ['Trance', 'Progressive House', 'Uplifting Trance'],
      total_appearances: 18,
      years_active: 19,
      rarity: 'LEGENDARY',
      debut_year: 2005,
      record_label: 'Armada Music'
    },
    {
      id: 'hardwell',
      stage_name: 'Hardwell',
      nationality: 'Dutch',
      genres: ['Big Room', 'Progressive House', 'Electro House'],
      total_appearances: 8,
      years_active: 13,
      rarity: 'EPIC',
      debut_year: 2011,
      record_label: 'Revealed Recordings'
    },
    {
      id: 'afrojack',
      stage_name: 'Afrojack',
      nationality: 'Dutch',
      genres: ['Big Room', 'Electro House', 'Future Bass'],
      total_appearances: 9,
      years_active: 14,
      rarity: 'EPIC',
      debut_year: 2010,
      record_label: 'Wall Recordings'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadStatus('error');
        setUploadMessage('Invalid file type. Please select a JPEG, PNG, or WebP image.');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus('error');
        setUploadMessage('File too large. Please select an image smaller than 10MB.');
        return;
      }

      setUploadFile(file);
      setUploadStatus('idle');
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedDj || !uploadFile) {
      setUploadStatus('error');
      setUploadMessage('Please select a DJ and upload a file.');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('djId', selectedDj);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful upload
      setUploadStatus('success');
      setUploadMessage('DJ image uploaded successfully!');
      setUploadFile(null);
      setSelectedDj('');
      
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch {
      setUploadStatus('error');
      setUploadMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!streamUrl.trim() || !streamTitle.trim()) {
      setSettingsStatus('error');
      setSettingsMessage('Please fill in all required fields.');
      return;
    }

    setSavingSettings(true);
    setSettingsStatus('idle');

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful save
      setSettingsStatus('success');
      setSettingsMessage('Stream settings saved successfully!');

    } catch {
      setSettingsStatus('error');
      setSettingsMessage('Failed to save settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const selectedDjData = djs.find(dj => dj.id === selectedDj);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'text-tml-gold';
      case 'EPIC': return 'text-tml-purple';
      case 'RARE': return 'text-tml-blue';
      default: return 'text-tml-gray-400';
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-tml-dark-bg">
      {/* Premium Header */}
      <header className="glass-effect border-b border-tml-dark-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-tml-gray-400 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-tml-purple to-tml-magenta rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    Admin Panel
                  </div>
                  <div className="text-tml-gray-400 text-sm">
                    DJ Image Management
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-tml-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="premium-card rounded-3xl p-8">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-tml-purple to-tml-magenta rounded-xl flex items-center justify-center">
              {activeTab === 'upload' ? <Upload className="w-6 h-6 text-white" /> : <Settings className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {activeTab === 'upload' ? 'Upload DJ Image' : 'Stream Settings'}
              </h1>
              <p className="text-tml-gray-400">
                {activeTab === 'upload' ? 'Manage and upload images for Tomorrowland DJs' : 'Configure audio stream settings'}
              </p>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'upload'
                  ? 'premium-button'
                  : 'bg-tml-dark-bg/50 text-tml-gray-400 hover:text-white hover:bg-tml-dark-bg/70'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>DJ Images</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'premium-button'
                  : 'bg-tml-dark-bg/50 text-tml-gray-400 hover:text-white hover:bg-tml-dark-bg/70'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4" />
                <span>Stream Settings</span>
              </div>
            </button>
          </div>

          {/* Upload Tab Content */}
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-8">
                {/* DJ Selection */}
              <div>
                <label className="block text-tml-gray-300 text-sm font-medium mb-3">
                  Select DJ
                </label>
                <select
                  value={selectedDj}
                  onChange={(e) => setSelectedDj(e.target.value)}
                  className="w-full px-4 py-4 bg-tml-dark-bg/50 border border-tml-dark-border rounded-xl text-white focus:outline-none focus:border-tml-purple focus:ring-2 focus:ring-tml-purple/20 transition-all duration-300"
                >
                  <option value="">Choose a DJ...</option>
                  {djs.map((dj) => (
                    <option key={dj.id} value={dj.id}>
                      {dj.stage_name} ({dj.rarity})
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-tml-gray-300 text-sm font-medium mb-3">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-tml-dark-border rounded-xl p-8 text-center hover:border-tml-purple transition-colors duration-300 group">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    {uploadFile ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{uploadFile.name}</p>
                          <p className="text-tml-gray-400 text-sm">
                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-tml-purple/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-tml-purple/30 transition-colors duration-300">
                          <ImageIcon className="w-8 h-8 text-tml-purple" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Click to upload image</p>
                          <p className="text-tml-gray-400 text-sm">
                            JPEG, PNG, or WebP (max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedDj || !uploadFile || uploading}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                  !selectedDj || !uploadFile || uploading
                    ? 'bg-tml-gray-600 text-tml-gray-400 cursor-not-allowed'
                    : 'premium-button'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </div>
                )}
              </button>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              {/* DJ Info Preview */}
              {selectedDjData ? (
                <div className="premium-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>DJ Preview</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {selectedDjData.stage_name}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-tml-dark-bg/50 rounded-lg p-3">
                        <p className="text-tml-gray-400 text-xs mb-1">Nationality</p>
                        <p className="text-white font-medium">{selectedDjData.nationality}</p>
                      </div>
                      <div className="bg-tml-dark-bg/50 rounded-lg p-3">
                        <p className="text-tml-gray-400 text-xs mb-1">Rarity</p>
                        <p className={`font-bold ${getRarityColor(selectedDjData.rarity)}`}>
                          {selectedDjData.rarity}
                        </p>
                      </div>
                      <div className="bg-tml-dark-bg/50 rounded-lg p-3">
                        <p className="text-tml-gray-400 text-xs mb-1">Appearances</p>
                        <p className="text-white font-medium">{selectedDjData.total_appearances}</p>
                      </div>
                      <div className="bg-tml-dark-bg/50 rounded-lg p-3">
                        <p className="text-tml-gray-400 text-xs mb-1">Record Label</p>
                        <p className="text-white font-medium">{selectedDjData.record_label}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="premium-card rounded-2xl p-6 text-center">
                  <User className="w-12 h-12 text-tml-gray-400 mx-auto mb-4" />
                  <p className="text-tml-gray-400">Select a DJ to see preview</p>
                </div>
              )}

              {/* Upload Status */}
              {uploadStatus !== 'idle' && (
                <div className={`premium-card rounded-2xl p-6 ${
                  uploadStatus === 'success' 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-center space-x-3">
                    {uploadStatus === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                    <p className={`font-medium ${
                      uploadStatus === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {uploadMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Guidelines */}
              <div className="premium-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Upload Guidelines</h3>
                <ul className="space-y-2 text-tml-gray-400 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Image should be a clear, high-quality photo of the DJ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Supported formats: JPEG, PNG, WebP</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maximum file size: 10MB</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Recommended dimensions: 400x400 pixels or larger</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Image will be automatically resized and optimized</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Settings Form */}
              <div className="space-y-8">
                {/* Stream URL */}
                <div>
                  <label className="block text-tml-gray-300 text-sm font-medium mb-3">
                    Stream URL
                  </label>
                  <input
                    type="url"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="Enter streaming URL..."
                    className="w-full px-4 py-4 bg-tml-dark-bg/50 border border-tml-dark-border rounded-xl text-white placeholder-tml-gray-400 focus:outline-none focus:border-tml-purple focus:ring-2 focus:ring-tml-purple/20 transition-all duration-300"
                  />
                  <p className="text-tml-gray-400 text-xs mt-2">
                    Direct audio stream URL (supports AAC, MP3, OGG formats)
                  </p>
                </div>

                {/* Stream Title */}
                <div>
                  <label className="block text-tml-gray-300 text-sm font-medium mb-3">
                    Stream Title
                  </label>
                  <input
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="Enter stream title..."
                    className="w-full px-4 py-4 bg-tml-dark-bg/50 border border-tml-dark-border rounded-xl text-white placeholder-tml-gray-400 focus:outline-none focus:border-tml-purple focus:ring-2 focus:ring-tml-purple/20 transition-all duration-300"
                  />
                  <p className="text-tml-gray-400 text-xs mt-2">
                    Display name for the audio stream
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings || !streamUrl.trim() || !streamTitle.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                    savingSettings || !streamUrl.trim() || !streamTitle.trim()
                      ? 'bg-tml-gray-600 text-tml-gray-400 cursor-not-allowed'
                      : 'premium-button'
                  }`}
                >
                  {savingSettings ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>Save Settings</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Right Column - Settings Info */}
              <div className="space-y-6">
                {/* Current Settings Preview */}
                <div className="premium-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Radio className="w-5 h-5" />
                    <span>Current Settings</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-tml-dark-bg/50 rounded-lg p-4">
                      <p className="text-tml-gray-400 text-xs mb-2">Stream Title</p>
                      <p className="text-white font-medium">{streamTitle}</p>
                    </div>
                    <div className="bg-tml-dark-bg/50 rounded-lg p-4">
                      <p className="text-tml-gray-400 text-xs mb-2">Stream URL</p>
                      <p className="text-white font-mono text-sm break-all">{streamUrl}</p>
                    </div>
                  </div>
                </div>

                {/* Settings Status */}
                {settingsStatus !== 'idle' && (
                  <div className={`premium-card rounded-2xl p-6 ${
                    settingsStatus === 'success' 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-red-500/30 bg-red-500/5'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {settingsStatus === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      )}
                      <p className={`font-medium ${
                        settingsStatus === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {settingsMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Settings Guidelines */}
                <div className="premium-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Stream Guidelines</h3>
                  <ul className="space-y-2 text-tml-gray-400 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Use direct audio stream URLs (not YouTube or video platforms)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Supported formats: AAC, MP3, OGG, M3U playlists</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ensure the stream URL is publicly accessible</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Changes take effect immediately after saving</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-tml-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Test the stream URL before saving to ensure it works</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      </div>
    </AdminGuard>
  );
}