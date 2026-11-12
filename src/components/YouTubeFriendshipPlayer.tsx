import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, ExternalLink, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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
  const [bars, setBars] = useState<number[]>([40, 65, 85, 50, 70]);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const VIDEO_ID = 'EatzcaVJRMs'; // Tera Yaar Hoon Main (Sonu Ke Titu Ki Sweety)

  useEffect(() => {
    let isMounted = true;

    // Load YouTube IFrame API script
    const loadScript = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          if (isMounted) createPlayer();
        };
      } else if (window.YT && window.YT.Player) {
        createPlayer();
      }
    };

    const createPlayer = () => {
      if (document.getElementById('yt-player-element')) {
        try {
          playerRef.current = new window.YT.Player('yt-player-element', {
            height: '200',
            width: '300',
            videoId: VIDEO_ID,
            playerVars: {
              autoplay: autoPlayTrigger ? 1 : 0,
              playsinline: 1,
              enablejsapi: 1,
              loop: 1,
              playlist: VIDEO_ID,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            },
            events: {
              onReady: (event: any) => {
                if (!isMounted) return;
                try {
                  const dur = event.target.getDuration();
                  if (dur) setDuration(dur);
                } catch {}

                if (autoPlayTrigger) {
                  try {
                    event.target.playVideo();
                    setIsPlaying(true);
                  } catch {}
                }
              },
              onStateChange: (event: any) => {
                if (!isMounted) return;
                // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
                if (event.data === 1) {
                  setIsPlaying(true);
                  try {
                    const dur = event.target.getDuration();
                    if (dur) setDuration(dur);
                  } catch {}
                } else if (event.data === 2 || event.data === 0) {
                  setIsPlaying(false);
                }
              },
            },
          });
        } catch {}
      }
    };

    loadScript();

    return () => {
      isMounted = false;
      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch {}
    };
  }, []);

  // When autoPlayTrigger turns true (user clicks "Open My Letter")
  useEffect(() => {
    if (autoPlayTrigger && playerRef.current) {
      try {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {}
    }
  }, [autoPlayTrigger]);

  // Sync timer during playback
  useEffect(() => {
    let interval: any;
    if (isPlaying && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      interval = setInterval(() => {
        try {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (curr !== undefined) setCurrentTime(curr);
          if (dur && dur !== duration) setDuration(dur);
        } catch {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Equalizer visualizer animation
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
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {}
    }
  };

  const seekBy = (seconds: number) => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
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
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seekTime, true);
      } catch {}
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      try {
        if (nextMute) playerRef.current.mute();
        else playerRef.current.unMute();
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
    <div className="w-full bg-white/95 backdrop-blur-md border border-sky-100 rounded-2xl p-3.5 sm:p-4 shadow-md shadow-sky-500/5">
      {/* YouTube Iframe element - kept in 1x1 opacity-0 container so Chrome/Safari doesn't suspend audio */}
      <div className="w-1 h-1 opacity-0 overflow-hidden pointer-events-none absolute -z-10" ref={containerRef}>
        <div id="yt-player-element" />
      </div>

      {/* Main Track Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Title & Artist */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-300">
            <Music className="w-5 h-5" />
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
              {isPlaying ? 'Playing "Tera Yaar Hoon Main" from YouTube...' : 'YouTube Song Loaded · Click Play'}
            </p>
          </div>

          {/* Equalizer Visualizer */}
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

        {/* Action Controls & Seek buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Mute button */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Skip Back 10s */}
          <button
            type="button"
            onClick={() => seekBy(-10)}
            className="flex items-center justify-center p-2 text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            title="Rewind 10s"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayback}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-300 transition-all cursor-pointer shrink-0"
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

          {/* Skip Forward 10s */}
          <button
            type="button"
            onClick={() => seekBy(10)}
            className="flex items-center justify-center p-2 text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            title="Forward 10s"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* YouTube Original Video Link */}
          <a
            href="https://youtu.be/EatzcaVJRMs?si=NCYcZArPpBiGAOHb"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            title="Open Tera Yaar Hoon Main on YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Interactive Seek Bar */}
      {duration > 0 && (
        <div className="mt-2.5 pt-2 border-t border-sky-100/70 flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekSlider}
            className="w-full h-1.5 bg-slate-200 rounded-lg accent-sky-600 cursor-pointer"
            title="Seek song"
          />
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};
