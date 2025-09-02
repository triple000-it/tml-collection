'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Hardcoded stream URL
  const STREAM_URL = 'https://playerservices.streamtheworld.com/api/livestream-redirect/OWR_INTERNATIONALAAC.aac';
  const TRACK_TITLE = 'Tomorrowland Radio';
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Initialize audio with stream URL
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = STREAM_URL;
      audio.volume = 1; // Set initial volume to 100%
      audio.load();
    }
  }, []);

  // Ensure volume is properly set when audio loads
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleCanPlay = () => {
        audio.volume = volume;
      };
      
      const handleLoadedData = () => {
        audio.volume = volume;
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [volume]);

  // Handle play/pause
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Error playing audio. Please check your connection.');
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    setVolume(newVolume);
    const audio = audioRef.current;
    if (audio) {
      // Force volume update
      audio.volume = newVolume;
      // Double-check and force again if needed
      setTimeout(() => {
        if (audio && audio.volume !== newVolume) {
          audio.volume = newVolume;
        }
      }, 10);
    }
    setIsMuted(newVolume === 0);
  };

  // Handle mute toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmute: restore previous volume
      audio.volume = volume;
      setIsMuted(false);
    } else {
      // Mute: set volume to 0
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle time seek
  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };



  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-4 ${className}`}>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError('Error loading audio stream');
          setIsLoading(false);
        }}
      />

      <div className="flex items-center space-x-3">
        {/* Left Icon */}
        <div className="w-8 h-8 bg-purple-800 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Music className="w-4 h-4 text-white" />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm truncate">
            {TRACK_TITLE}
          </div>
          <div className="text-white/80 text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0 mx-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleTimeSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={toggleMute}
            className="text-white hover:text-white/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            onInput={handleVolumeChange}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}



      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
