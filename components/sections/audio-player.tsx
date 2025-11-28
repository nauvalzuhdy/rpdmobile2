'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element with proxy endpoint
    audioRef.current = new Audio('/api/radio-stream');
    audioRef.current.preload = 'none';
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    
    const handleWaiting = () => {
      setIsLoading(true);
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      setError('Unable to load stream. Please try again.');
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);

    // Cleanup
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load and play
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error playing audio:', err);
        setIsLoading(false);
        setIsPlaying(false);
        setError('Failed to play stream. Please check your connection.');
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);
      
      // Reset the audio source to stop loading
      audioRef.current.src = '/api/radio-stream';
    }
  };

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark)] mb-4">
            Airplay Radio PPI Dunia
          </h2>
          <p className="text-base text-[var(--color-text-dark-alt)] mb-8">
            Dengarkan siaran Radio PPI Dunia langsung 24 jam
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlay}
              disabled={isPlaying || isLoading}
              className="flex items-center gap-2 px-8 py-4 bg-[var(--color-success-green)] text-white font-medium rounded-lg hover:bg-[var(--color-success-green-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play className="w-5 h-5" fill="white" />
              {isLoading ? 'Loading...' : 'Play'}
            </button>
            
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isLoading}
              className="flex items-center gap-2 px-8 py-4 bg-[var(--color-accent-red)] text-white font-medium rounded-lg hover:bg-[var(--color-accent-red-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-5 h-5" fill="white" />
              Stop
            </button>
          </div>

          {isPlaying && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-[var(--color-success-green)] animate-pulse rounded"></span>
                <span className="w-1 h-4 bg-[var(--color-success-green)] animate-pulse rounded" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-4 bg-[var(--color-success-green)] animate-pulse rounded" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <span className="text-sm text-[var(--color-text-dark-alt)] ml-2">Now Playing</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}