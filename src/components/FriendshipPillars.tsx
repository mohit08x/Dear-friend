import React, { useState } from 'react';
import { ShieldCheck, Laugh, Target, HeartHandshake, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FriendshipPillarsProps {
  friendName?: string;
}

export const FriendshipPillars: React.FC<FriendshipPillarsProps> = ({ friendName = 'Prince Sharma' }) => {
  const [revealedIdx, setRevealedIdx] = useState<number | null>(null);

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Unshakable Loyalty',
      subtitle: 'The 3:00 AM Anchor',
      description: `Never once did you hesitate when I needed someone. Through thick and thin, you’ve proven that real brotherhood doesn't back down.`,
      highlight: '8 years of unwavering trust',
    },
    {
      icon: Laugh,
      title: 'Uncensored Laughter',
      subtitle: 'A Language Only We Speak',
      description: `The crazy inside jokes, laughing at the most inappropriate moments, and recalling stupid college stories that still bring tears of joy.`,
      highlight: '10,000+ shared laughs',
    },
    {
      icon: Target,
      title: 'Shared Growth & Ambition',
      subtitle: 'Pushing Each Other Higher',
      description: `Watching each other level up from our humble beginnings to where we are today. Always the loudest cheer in the room for my wins.`,
      highlight: 'From dreamers to achievers',
    },
    {
      icon: HeartHandshake,
      title: 'Family by Choice',
      subtitle: 'More Than A Friend',
      description: `Blood makes relatives, but heart makes brothers. Having you in my corner makes every challenge in life feel completely conquerable.`,
      highlight: 'Brother for life',
    },
  ];

  const handleCardClick = (idx: number) => {
    setRevealedIdx(idx);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#0284c7', '#93c5fd'],
      });
    } catch {}
  };

  return (
    <div className="w-full bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm shadow-sky-500/5">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-xs uppercase tracking-widest text-sky-600 font-semibold mb-1">
          The 4 Pillars of Our Brotherhood
        </h2>
        <p className="font-serif-display text-2xl sm:text-3xl text-slate-800 font-bold">
          Why Prince Sharma Is Irreplaceable
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Click any pillar to celebrate that bond with a burst of sparkle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isSelected = revealedIdx === idx;

          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden ${
                isSelected
                  ? 'bg-sky-50/90 border-sky-300 shadow-md shadow-sky-400/10'
                  : 'bg-white hover:bg-sky-50/40 border-slate-200/80 hover:border-sky-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Celebrated
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-0.5">
                {pillar.title}
              </h3>
              <p className="text-xs font-semibold text-sky-600 mb-2">
                {pillar.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {pillar.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">
                  {pillar.highlight}
                </span>
                <span className="text-sky-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Tap to salute 💙
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
