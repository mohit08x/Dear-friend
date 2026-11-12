import React from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { YouTubeFriendshipPlayer } from './YouTubeFriendshipPlayer';
import { FriendshipTimeCounter } from './FriendshipTimeCounter';

interface InteractiveLetterProps {
  friendName: string;
  senderName: string;
  letterTitle: string;
  messageText: string;
  photoUrl: string;
  startYear: number;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const InteractiveLetter: React.FC<InteractiveLetterProps> = ({
  friendName,
  senderName,
  letterTitle,
  messageText,
  photoUrl,
  startYear,
  isOpen,
  onToggleOpen,
}) => {
  const handleOpenEnvelope = () => {
    onToggleOpen();
    // Confetti burst
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd'],
      });
    } catch {}
  };

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#0284c7', '#38bdf8', '#0ea5e9', '#60a5fa'],
      });
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto transition-all duration-500">
      {/* 1. ENVELOPE CLOSED STATE */}
      {!isOpen && (
        <div className="relative group max-w-lg mx-auto">
          {/* Subtle back decorative glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-sky-300 to-cyan-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition-opacity" />

          {/* Envelope Body */}
          <div className="relative bg-white border border-sky-100 rounded-3xl p-8 sm:p-12 shadow-2xl text-center overflow-hidden">
            {/* Top envelope triangle flap visual */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-36 bg-sky-50 border-b border-sky-200/80 transform rotate-180 rounded-b-3xl shadow-xs" />

            {/* Stamp & Airmail marks */}
            <div className="absolute top-5 right-5 flex items-center gap-1.5 p-1.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-700">
              <span className="text-[10px] font-mono font-bold">2018–2026</span>
              <Heart className="w-3.5 h-3.5 fill-current text-sky-500" />
            </div>

            {/* Circle Area with Requested Bold Text */}
            <div className="relative z-10 max-w-sm sm:max-w-md mx-auto my-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white shadow-lg shadow-sky-500/30 ring-4 ring-sky-100 transform group-hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
                <Heart className="w-5 h-5 fill-current text-white animate-pulse" />
              </div>
              <p className="text-sm sm:text-base font-bold text-white text-center leading-snug">
                Dear {friendName}, our friendship has been going on for more than 8 years
              </p>
            </div>

            {/* Text Title */}
            <div className="relative z-10 mt-3">
              <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-sky-900 mt-1">
                💌 A Special Letter
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-sm mx-auto">
                A heartfelt surprise for my best friend, <strong className="text-sky-700">{friendName}</strong>...
              </p>
            </div>

            {/* Action button */}
            <div className="relative z-10 mt-8">
              <button
                onClick={handleOpenEnvelope}
                className="group/btn inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg shadow-sky-400/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer glow-blue"
              >
                <span>Open My Letter 💙</span>
                <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              </button>
            </div>

            <p className="relative z-10 text-[11px] text-slate-500 mt-4">
              Click anywhere on the envelope to unfold the keepsake
            </p>

            {/* Live Friendship Time Counter right below Open Letter */}
            <div className="relative z-10">
              <FriendshipTimeCounter startYear={startYear} friendName={friendName} />
            </div>
          </div>
        </div>
      )}

      {/* 2. LETTER OPENED STATE */}
      {isOpen && (
        <div className="relative animate-in fade-in zoom-in-95 duration-500">
          {/* Top Quick Actions Bar */}
          <div className="flex items-center justify-between gap-3 mb-4 px-2">
            <button
              onClick={onToggleOpen}
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-white/90 hover:bg-white border border-sky-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fold Letter Back</span>
            </button>

            <button
              onClick={handleCelebrate}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 px-4 py-2 rounded-xl transition-all shadow-sm shadow-sky-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate 8 Years 🎉</span>
            </button>
          </div>

          {/* Letter Parchment Container */}
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-sky-600/10 relative overflow-hidden">
            {/* Subtle paper watermark texture background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/50 via-transparent to-transparent pointer-events-none rounded-bl-full" />

            {/* Letter Header */}
            <div className="text-center pb-6 border-b border-sky-100 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-2">
                <span>{startYear} – 2026</span>
                <span>·</span>
                <span>8 Golden Years</span>
              </div>
              <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-black text-sky-900 tracking-tight">
                Dear Prince Sharma 💙
              </h1>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                An Unbreakable Bond Written Across Time
              </p>
            </div>

            {/* Letter Message Body (Directly at top without photo) */}
            <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-sky-800 mb-4 flex items-center gap-2">
                  <span>Dear {friendName},</span>
                  <Heart className="w-5 h-5 text-sky-500 fill-current" />
                </h3>

                <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 font-serif">
                  {messageText.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-sky-100 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
                    Always your brother,
                  </span>
                  <p className="font-handwriting text-3xl sm:text-4xl font-bold text-sky-900">
                    {senderName} 💙
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-sky-600 font-semibold block">
                    Forever & Always
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Friendship Time Counter */}
            <FriendshipTimeCounter startYear={startYear} friendName={friendName} />

            {/* YouTube Friendship Soundtrack: Tera Yaar Hoon Main */}
            <div className="mt-6 pt-5 border-t border-sky-100">
              <YouTubeFriendshipPlayer autoPlayTrigger={isOpen} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
