import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, ExternalLink, SkipBack, SkipForward, Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';
import { ambientSynth } from '../utils/audioSynth';

interface YouTubeFriendshipPlayerProps {
  autoPlayTrigger?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YouTubeFriendshipPlayer: React.FC<YouTubeFriendshipPlayerProps> = ({
  autoPlayTrigger,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [bars, setBars] = useState<number[]>([20, 20, 20, 20, 20]);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const playerRef = useRef<any>(null);
  const VIDEO_ID = 'EatzcaVJRMs'; // Tera Yaar Hoon Main

  // Initialize Player
  useEffect(() => {
    let isMounted = true;

    const createPlayer = () => {
      if (!isMounted || !window.YT || !window.YT.Player) return;
      
      const el = document.getElementById('yt-player-target');
      if (!el) return;

      try {
        playerRef.current = new window.YT.Player('yt-player-target', {
          height: '10',
          width: '10',
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: autoPlayTrigger ? 1 : 0,
            playsinline: 1,
            enablejsapi: 1,
            loop: 1,
            playlist: VIDEO_ID,
            origin: window.location.origin,
            controls: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              setLoadError(false);
              const dur = event.target.getDuration();
              if (dur) setDuration(dur);
              
              if (autoPlayTrigger) {
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.error('Autoplay failed:', e);
                }
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // 1 = playing, 2 = paused, 0 = ended, 3 = buffering, -1 = unstarted, 5 = cued
              if (event.data === 1) {
                setIsPlaying(true);
                setLoadError(false);
                const dur = event.target.getDuration();
                if (dur) setDuration(dur);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (e: any) => {
              console.error('YouTube Player Error:', e);
              if (isMounted) setLoadError(true);
            }
          },
        });
      } catch (err) {
        console.error('Failed to create YT player:', err);
        if (isMounted) setLoadError(true);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        if (isMounted) createPlayer();
      };
    } else if (window.YT.Player) {
      createPlayer();
    } else {
      // Script is loading but callback not yet fired
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          createPlayer();
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
      }
    };
  }, []);

  // Sync autoplay trigger
  useEffect(() => {
    if (autoPlayTrigger && isReady && playerRef.current) {
      try {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch {}
    }
  }, [autoPlayTrigger, isReady]);

  // Timer Ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying && isReady && playerRef.current) {
      interval = setInterval(() => {
        try {
          const curr = playerRef.current.getCurrentTime();
          if (curr !== undefined) setCurrentTime(curr);
        } catch {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isReady]);

  // Animation Visualizer
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
    if (isReady && playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {}
    } else {
      // If YT fails, we could potentially fallback to synth here
      // But user specifically wants this song.
      setLoadError(true);
    }
  };

  const seekBy = (seconds: number) => {
    if (isReady && playerRef.current) {
      try {
        const curr = playerRef.current.getCurrentTime() || 0;
        const target = Math.max(0, Math.min(duration || 300, curr + seconds));
        playerRef.current.seekTo(target, true);
        setCurrentTime(target);
      } catch {}
    }
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (isReady && playerRef.current) {
      try {
        playerRef.current.seekTo(seekTime, true);
      } catch {}
    }
  };

  const toggleMute = () => {
    if (isReady && playerRef.current) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch {}
    }
  };

  const formatTime = (timeInSec: number) => {
    if (!timeInSec || isNaN(timeInSec)) return '0:00';
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-sky-100 rounded-2xl p-3.5 sm:p-4 shadow-md shadow-sky-500/5 relative overflow-hidden">
      {/* Tiny Invisible Player Element */}
      <div className="absolute top-0 left-0 w-[1px] h-[1px] opacity-0 overflow-hidden pointer-events-none">
        <div id="yt-player-target" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Info & Visualizer */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            {loadError ? <AlertCircle className="w-5 h-5 text-red-100 animate-pulse" /> : <Music className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-sky-950 truncate">
                Tera Yaar Hoon Main 💙
              </span>
              <span className="text-[10px] text-sky-600 font-semibold px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200 shrink-0">
                Arijit Singh
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {loadError 
                ? 'Failed to load from YouTube. Click Refresh or the Link.'
                : isPlaying 
                  ? 'Playing our friendship soundtrack...' 
                  : isReady 
                    ? 'Song ready. Click play if it didn\'t start!' 
                    : 'Connecting to YouTube servers...'}
            </p>
          </div>

          <div className="flex items-end gap-1 h-5 px-1 shrink-0">
            {bars.map((height, i) => (
              <span
                key={i}
                className="w-1 bg-sky-500 rounded-full transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {loadError && (
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-sky-600 bg-sky-50 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors"
              title="Refresh Page"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors border border-slate-200"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => seekBy(-10)}
            className="p-2 text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            title="Rewind 10s"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={togglePlayback}
            disabled={!isReady && !loadError}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Song</span>
              </>
            )}
          </button>

          <button
            onClick={() => seekBy(10)}
            className="p-2 text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            title="Forward 10s"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <a
            href="https://youtu.be/EatzcaVJRMs?si=zK5t2olO1LoUBKc1"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            title="Open on YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Progress Bar */}
      {duration > 0 && !loadError && (
        <div className="mt-2.5 pt-2 border-t border-sky-100/70 flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleSeekSlider}
            className="w-full h-1.5 bg-slate-200 rounded-lg accent-sky-600 cursor-pointer"
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};
