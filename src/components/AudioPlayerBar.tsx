import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Upload, Sparkles } from 'lucide-react';
import { ambientSynth } from '../utils/audioSynth';

interface AudioPlayerBarProps {
  onPlayStateChange?: (playing: boolean) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ onPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('memories');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>([40, 65, 85, 50, 70]);

  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync volume to synth and audio tag
  useEffect(() => {
    const activeVol = isMuted ? 0 : volume;
    ambientSynth.setVolume(activeVol);
    if (customAudioRef.current) {
      customAudioRef.current.volume = activeVol;
    }
  }, [volume, isMuted]);

  // Visualizer animation
  useEffect(() => {
    if (!isPlaying) {
      setBars([20, 20, 20, 20, 20]);
      return;
    }

    const interval = setInterval(() => {
      setBars([
        Math.floor(Math.random() * 60) + 25,
        Math.floor(Math.random() * 70) + 30,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 65) + 35,
        Math.floor(Math.random() * 75) + 25,
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayback = () => {
    if (customAudioUrl && customAudioRef.current) {
      if (isPlaying) {
        customAudioRef.current.pause();
        setIsPlaying(false);
        onPlayStateChange?.(false);
      } else {
        customAudioRef.current.play().then(() => {
          setIsPlaying(true);
          onPlayStateChange?.(true);
        }).catch(() => {
          // Fallback to synth if custom playback fails
          ambientSynth.start();
          setIsPlaying(true);
          onPlayStateChange?.(true);
        });
      }
      return;
    }

    const state = ambientSynth.toggle();
    setIsPlaying(state);
    onPlayStateChange?.(state);
  };

  const handleTrackChange = (track: string) => {
    setCurrentTrack(track);
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      setCustomAudioUrl(null);
      setCustomFileName(null);
    }
    ambientSynth.setTrack(track);
    if (isPlaying) {
      ambientSynth.stop();
      ambientSynth.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      ambientSynth.stop();
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomFileName(file.name);
      setIsPlaying(false);

      setTimeout(() => {
        if (customAudioRef.current) {
          customAudioRef.current.play().then(() => {
            setIsPlaying(true);
            onPlayStateChange?.(true);
          }).catch(() => {});
        }
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border border-sky-100 rounded-2xl p-3 sm:p-4 shadow-md shadow-sky-500/5">
      {customAudioUrl && (
        <audio
          ref={customAudioRef}
          src={customAudioUrl}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Title & Equalizer */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-300">
            <Music className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-800 truncate">
                {customFileName ? customFileName : currentTrack === 'memories' ? 'Memories in D Major' : currentTrack === 'starlit' ? 'Starlit Chimes' : 'Golden Sunset Chill'}
              </span>
              <span className="text-[10px] text-sky-600 font-medium">· Ambient</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {isPlaying ? 'Playing soothing friendship melody' : 'Click play to start song'}
            </p>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-end gap-1 h-5 px-1 shrink-0" aria-label="Audio Visualizer">
            {bars.map((height, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-sky-500 to-cyan-400 rounded-full transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Preset Track Dropdown */}
          <select
            value={currentTrack}
            onChange={(e) => handleTrackChange(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            title="Choose soundtrack"
          >
            <option value="memories">Piano: Memories</option>
            <option value="starlit">Chimes: Starlit</option>
            <option value="golden">Rhodes: Golden</option>
          </select>

          {/* Upload Custom Song Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
            title="Upload your own song (MP3/WAV)"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Volume Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 sm:w-20 accent-sky-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            title="Volume"
          />

          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayback}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-sm shadow-sky-300 transition-all cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Song</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
