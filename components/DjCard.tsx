'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Crown, Zap, Star, Sparkles, MapPin, ChevronRight } from 'lucide-react';

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
  categories: string[];
}

interface DjCardProps {
  djData: DjData;
  onClick?: () => void;
  className?: string;
  isFlipped?: boolean;
  onFlip?: (isFlipped: boolean) => void;
}

const DjCard: React.FC<DjCardProps> = ({
  djData,
  onClick,
  className = '',
  isFlipped = false,
  onFlip
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [internalFlipped, setInternalFlipped] = useState(false);
  
  const isFlippedState = onFlip !== undefined ? isFlipped : internalFlipped;
  
  const handleFlip = () => {
    if (onFlip) {
      onFlip(!isFlippedState);
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

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

  return (
    <div 
      className={`relative w-full max-w-sm mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${rarityStyles.glow} ${className}`}
      onClick={onClick || handleFlip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header with Date */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1">
          <div className="text-white text-xs font-bold uppercase">
            {djData.debut_year}
          </div>
        </div>
      </div>

      {/* Rarity Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${rarityStyles.badge}`}>
          {rarityStyles.icon}
          <span>{rarityStyles.rarityText}</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative h-80 bg-gray-900">
        {djData.image_url ? (
          <Image
            src={djData.image_url}
            alt={djData.stage_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-6xl">🎵</div>
          </div>
        )}
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        

      </div>

      {/* Card Content */}
      <div className="p-6 bg-black">
        {/* DJ Name */}
        <h3 className="text-lg font-bold text-white mb-4 leading-tight">
          {djData.stage_name}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">
            {djData.nationality} • {djData.total_appearances} appearances
          </span>
        </div>

        {/* Genres */}
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

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-transparent border border-white text-white px-4 py-2 rounded text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-1">
            <span>INFO</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button className="flex-1 bg-white text-black px-4 py-2 rounded text-sm font-medium uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-1">
            <span>COLLECT</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
      )}
    </div>
  );
};

export default DjCard;