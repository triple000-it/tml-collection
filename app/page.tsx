'use client';

import React, { useState, useEffect } from 'react';
import DjCard from '@/components/DjCard';
import SpinningCard from '@/components/SpinningCard';
import AudioPlayer from '@/components/AudioPlayer';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, User, Search, Filter, Calendar } from 'lucide-react';

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
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const { user } = useAuth();

  // Mock data for demonstration
  const mockDjs: DjData[] = [
    {
      id: 'dimitri-vegas-like-mike',
      stage_name: 'Dimitri Vegas & Like Mike',
      nationality: 'Belgian',
      genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
      total_appearances: 15,
      years_active: 14,
      image_url: '/cards/test-front.png',
      back_image_url: '/cards/test-back.png',
      rarity: 'LEGENDARY',
      biography: 'Belgian DJ duo and brothers known for their explosive energy and Tomorrowland residency. They have headlined major festivals worldwide and are recognized for their crowd interaction and festival anthems.',
      debut_year: 2010,
      record_label: 'Smash The House',
      awards: ['DJ Mag Top 100 #1 (2015, 2019)', 'Tomorrowland Residents', 'Best Festival Performance 2018']
    },
    {
      id: 'martin-garrix',
      stage_name: 'Martin Garrix',
      nationality: 'Dutch',
      genres: ['Big Room', 'Progressive House', 'Future Bass', 'Electro House'],
      total_appearances: 12,
      years_active: 11,
      image_url: '/dj-images/martin-garrix.jpg',
      rarity: 'LEGENDARY',
      biography: 'Dutch DJ and producer who became the youngest DJ to reach #1 in DJ Mag Top 100 at age 17. Known for his melodic big room sound and massive festival performances.',
      debut_year: 2013,
      record_label: 'STMPD RCRDS',
      awards: ['DJ Mag Top 100 #1 (2016, 2017, 2018)', 'Tomorrowland Residents', 'Youngest #1 DJ Ever']
    },
    {
      id: 'armin-van-buuren',
      stage_name: 'Armin van Buuren',
      nationality: 'Dutch',
      genres: ['Trance', 'Progressive House', 'Uplifting Trance', 'Psytrance'],
      total_appearances: 18,
      years_active: 19,
      image_url: '/dj-images/armin-van-buuren.jpg',
      rarity: 'LEGENDARY',
      biography: 'Dutch trance legend and producer, host of the iconic A State of Trance radio show. Known as the "King of Trance" with over 20 years of experience.',
      debut_year: 2005,
      record_label: 'Armada Music',
      awards: ['DJ Mag Top 100 #1 (2007-2010, 2012)', 'Tomorrowland Legends', 'Trance Hall of Fame']
    },
    {
      id: 'hardwell',
      stage_name: 'Hardwell',
      nationality: 'Dutch',
      genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
      total_appearances: 8,
      years_active: 13,
      image_url: '/dj-images/hardwell.jpg',
      rarity: 'EPIC',
      biography: 'Dutch DJ and producer, founder of Revealed Recordings. Known for his energetic big room sound and spectacular live performances with incredible stage production.',
      debut_year: 2011,
      record_label: 'Revealed Recordings',
      awards: ['DJ Mag Top 100 #1 (2013, 2014)', 'Best Big Room Producer', 'Ultra Music Festival Headliner']
    },
    {
      id: 'afrojack',
      stage_name: 'Afrojack',
      nationality: 'Dutch',
      genres: ['Big Room', 'Electro House', 'Future Bass', 'Trap'],
      total_appearances: 9,
      years_active: 14,
      image_url: '/dj-images/afrojack.jpg',
      rarity: 'EPIC',
      biography: 'Dutch DJ and producer, founder of Wall Recordings. Known for his distinctive sound and collaborations with major pop artists. Pioneer of the Dutch house movement.',
      debut_year: 2010,
      record_label: 'Wall Recordings',
      awards: ['DJ Mag Top 100 #8 (2011)', 'Grammy Winner', 'Best Dutch DJ 2015']
    },
    {
      id: 'don-diablo',
      stage_name: 'Don Diablo',
      nationality: 'Dutch',
      genres: ['Future House', 'Progressive House', 'Future Bass', 'Trap'],
      total_appearances: 4,
      years_active: 8,
      image_url: '/dj-images/don-diablo.jpg',
      rarity: 'RARE',
      biography: 'Dutch DJ and producer, pioneer of the future house genre. Known for his innovative sound design and cinematic approach to electronic music production.',
      debut_year: 2016,
      record_label: 'Hexagon',
      awards: ['DJ Mag Top 100 #11 (2018)', 'Future House Pioneer', 'Best New Artist 2017']
    },
    {
      id: 'charlotte-de-witte',
      stage_name: 'Charlotte de Witte',
      nationality: 'Belgian',
      genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
      total_appearances: 1,
      years_active: 5,
      image_url: '/dj-images/charlotte-de-witte.jpg',
      rarity: 'COMMON',
      biography: 'Belgian techno DJ and producer, founder of KNTXT label. Rising star in the techno scene known for her dark, industrial sound and powerful performances.',
      debut_year: 2019,
      record_label: 'KNTXT',
      awards: ['DJ Mag Top 100 #13 (2020)', 'Best Techno DJ 2021', 'Rising Star Award']
    }
  ];

  useEffect(() => {
    const fetchDjs = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchDjs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredDjs = mockDjs.filter(dj => {
    const matchesSearch = dj.stage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRarity = selectedRarity === 'ALL' || dj.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const rarityOptions = [
    { value: 'ALL', label: 'All Cards', count: mockDjs.length },
    { value: 'LEGENDARY', label: 'Legendary', count: mockDjs.filter(dj => dj.rarity === 'LEGENDARY').length },
    { value: 'EPIC', label: 'Epic', count: mockDjs.filter(dj => dj.rarity === 'EPIC').length },
    { value: 'RARE', label: 'Rare', count: mockDjs.filter(dj => dj.rarity === 'RARE').length },
    { value: 'COMMON', label: 'Common', count: mockDjs.filter(dj => dj.rarity === 'COMMON').length },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">T</span>
              </div>
              <span className="text-white font-bold text-xl">TML COLLECTIONS</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-gray-300 uppercase text-sm font-medium tracking-wide flex items-center space-x-1">
                <span>COLLECTION</span>
                <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 uppercase text-sm font-medium tracking-wide flex items-center space-x-1">
                <span>TRADING</span>
                <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 uppercase text-sm font-medium tracking-wide flex items-center space-x-1">
                <span>RARITY</span>
                <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 uppercase text-sm font-medium tracking-wide flex items-center space-x-1">
                <span>ABOUT</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </nav>

            {/* Account Button */}
            {user ? (
              <UserProfile />
            ) : (
              <button 
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="button-primary flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>MY ACCOUNT</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Collect All Tomorrowland DJ Cards
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover, collect, and trade premium digital cards of your favorite Tomorrowland artists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <button className="button-primary">
                  START COLLECTING
                </button>
                <button className="button-secondary">
                  VIEW COLLECTION
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="button-primary"
                >
                  START COLLECTING
                </button>
                <button 
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="button-secondary"
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                DJ Collection
              </h2>
              <p className="text-gray-400 text-lg">
                Discover and collect cards from your favorite Tomorrowland artists
              </p>
            </div>
            <button className="button-primary flex items-center space-x-2 mt-4 md:mt-0">
              <Calendar className="w-4 h-4" />
              <span>VIEW ALL</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search DJs, genres, or labels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Rarity Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
              >
                {rarityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* DJ Cards Grid - Full Width */}
        {!loading && (
          <div className="w-full mt-16">
            <div className="dj-grid">
              {filteredDjs.map((dj, index) => (
                <div 
                  key={dj.id} 
                  className="card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {dj.id === 'dimitri-vegas-like-mike' ? (
                    <SpinningCard djData={dj} />
                  ) : (
                    <DjCard djData={dj} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDjs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🎵</div>
            <h3 className="text-2xl font-bold text-white mb-4">No DJs Found</h3>
            <p className="text-gray-400 mb-8">
              Try adjusting your search or filter criteria
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedRarity('ALL');
              }}
              className="button-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-white">TML Collections</span>
            </div>
            <p className="text-gray-400 mb-4">
              &copy; 2025 TML Collections. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              This is a fan-made project and is not affiliated with Tomorrowland.
            </p>
          </div>
        </div>
      </footer>

      {/* Audio Player */}
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
        <AudioPlayer />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}