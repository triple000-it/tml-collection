'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Crown, Zap, Star, Sparkles, MapPin, ChevronRight, X } from 'lucide-react';

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
  awards?: string[];
  categories: string[];
}

interface SpinningCardProps {
  djData: DjData;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SpinningCard: React.FC<SpinningCardProps> = ({
  djData,
  onClick,
  className = '',
  style
}) => {

  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return {
          border: 'border-yellow-500',
          background: 'bg-gradient-to-br from-yellow-500/10 via-yellow-400/5 to-yellow-500/10',
          glow: 'shadow-yellow-500/25',
          badge: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black',
          text: 'text-yellow-400',
          icon: <Crown className="w-4 h-4" />,
          rarityText: 'LEGENDARY',
          rarityColor: '#F59E0B'
        };
      case 'EPIC':
        return {
          border: 'border-purple-500',
          background: 'bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-500/10',
          glow: 'shadow-purple-500/25',
          badge: 'bg-gradient-to-r from-purple-500 to-purple-400 text-white',
          text: 'text-purple-400',
          icon: <Zap className="w-4 h-4" />,
          rarityText: 'EPIC',
          rarityColor: '#8B5CF6'
        };
      case 'RARE':
        return {
          border: 'border-blue-500',
          background: 'bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-500/10',
          glow: 'shadow-blue-500/25',
          badge: 'bg-gradient-to-r from-blue-500 to-blue-400 text-white',
          text: 'text-blue-400',
          icon: <Star className="w-4 h-4" />,
          rarityText: 'RARE',
          rarityColor: '#3B82F6'
        };
      default: // COMMON
        return {
          border: 'border-gray-500',
          background: 'bg-gradient-to-br from-gray-500/10 via-gray-400/5 to-gray-500/10',
          glow: 'shadow-gray-500/25',
          badge: 'bg-gradient-to-r from-gray-500 to-gray-400 text-white',
          text: 'text-gray-400',
          icon: <Sparkles className="w-4 h-4" />,
          rarityText: 'COMMON',
          rarityColor: '#6B7280'
        };
    }
  };

  const rarityStyles = getRarityStyles(djData.rarity);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    resetRotation();
  };

  const flipCard = () => {
    // Simple flip between front and back
    setIsFlipped(!isFlipped);
  };

  const resetRotation = () => {
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      openPopup();
    }
  };

  // Portal popup component
  const PopupModal = () => {
    if (!showPopup) return null;

    return createPortal(
      <div className="fixed inset-0 z-[999999] bg-black flex items-center justify-center">
        <button
          onClick={closePopup}
          className="absolute top-8 right-8 bg-white/20 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center max-w-6xl mx-auto px-8">

          
          <button
            onClick={flipCard}
            className="mb-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
          >
            {isFlipped ? 'Show Front' : 'Show Back'}
          </button>
          
          <div 
            className="relative w-[361px] h-[487px] cursor-pointer mb-8 select-none"
            onClick={flipCard}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
              transition: 'transform 0.6s ease-in-out'
            }}
          >
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
              }}
            >
              {djData.image_url && (
                <Image
                  src={djData.image_url}
                  alt={djData.stage_name}
                  fill
                  className="object-contain"
                  sizes="361px"
                  priority
                />
              )}
            </div>

            {djData.back_image_url && (
              <div 
                className="absolute inset-0 w-full h-full"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
                }}
              >
                <Image
                  src={djData.back_image_url}
                  alt={`${djData.stage_name} - Back`}
                  fill
                  className="object-contain"
                  sizes="361px"
                  priority
                />
              </div>
            )}
          </div>

          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-2">{djData.stage_name}</h3>
            <p className="text-gray-300 text-sm mb-4">
              {djData.nationality} • {djData.total_appearances} appearances
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {djData.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30"
                >
                  {genre}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className={`relative w-full bg-black border border-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${rarityStyles.glow} ${className}`}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        <div className="absolute top-4 right-4 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${rarityStyles.badge}`}>
            {rarityStyles.icon}
            <span>{rarityStyles.rarityText}</span>
          </div>
        </div>

        <div
          className="relative h-[500px] bg-gray-900 cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered || isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s ease-in-out'
          }}
          onClick={handleCardClick}
        >
            {/* Front Image */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)'
              }}
            >
              {djData.image_url ? (
                <Image
                  src={djData.image_url}
                  alt={djData.stage_name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-6xl">🎵</div>
                </div>
              )}
            </div>
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            {/* Back Image */}
            {djData.back_image_url && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <Image
                  src={djData.back_image_url}
                  alt={`${djData.stage_name} - Back`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                {/* Image Overlay for back */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
            )}

        </div>

        <div className="p-6 bg-black">
          <h3 className="text-lg font-bold text-white mb-4 leading-tight">
            {djData.stage_name}
          </h3>

          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              {djData.nationality} • {djData.total_appearances} appearances
            </span>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {djData.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700"
                >
                  {genre}
                </span>
              ))}
              {djData.genres.length > 2 && (
                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                  +{djData.genres.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={openPopup}
              className="flex-1 bg-transparent border border-white text-white px-4 py-2 rounded text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <span>INFO</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button className="flex-1 bg-white text-black px-4 py-2 rounded text-sm font-medium uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-1">
              <span>COLLECT</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
        )}
      </div>

      <PopupModal />
    </>
  );
};

export default SpinningCard;