import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, Calendar } from 'lucide-react';

interface FriendshipTimeCounterProps {
  startYear?: number;
  friendName?: string;
}

export const FriendshipTimeCounter: React.FC<FriendshipTimeCounterProps> = ({
  startYear = 2018,
  friendName = 'Prince Sharma',
}) => {
  const [time, setTime] = useState({
    years: 8,
    months: 96,
    weeks: 417,
    days: 2922,
    hours: 70128,
    minutes: 4207680,
    seconds: 252460800,
  });

  useEffect(() => {
    // Start date approximately Nov 12, 2018
    const startDate = new Date(startYear, 10, 12, 0, 0, 0).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - startDate);
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = Math.floor(totalDays / 30.4375);
      const totalYears = Math.floor(totalDays / 365.25);

      setTime({
        years: totalYears,
        months: totalMonths,
        weeks: totalWeeks,
        days: totalDays,
        hours: totalHours,
        minutes: totalMinutes,
        seconds: totalSeconds,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startYear]);

  const units = [
    { label: 'Years', val: time.years.toLocaleString(), sub: 'Brotherhood' },
    { label: 'Months', val: time.months.toLocaleString(), sub: 'Shared' },
    { label: 'Weeks', val: time.weeks.toLocaleString(), sub: 'Bond' },
    { label: 'Days', val: time.days.toLocaleString(), sub: 'Memories' },
    { label: 'Hours', val: time.hours.toLocaleString(), sub: 'Moments' },
    { label: 'Minutes', val: time.minutes.toLocaleString(), sub: 'Laughs' },
    { label: 'Seconds', val: time.seconds.toLocaleString(), sub: 'Live', isLive: true },
  ];

  return (
    <div className="w-full mt-6 pt-5 border-t border-sky-100 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-sky-800 mb-3">
        <Heart className="w-3.5 h-3.5 fill-current text-sky-500 animate-pulse" />
        <span>Together as Best Friends ({startYear} – 2026)</span>
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
      </div>

      {/* 7 Requested Units Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {units.map((unit, idx) => {
          const isLast = idx === units.length - 1;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                unit.isLive
                  ? 'bg-sky-100/80 border-sky-300 shadow-xs ring-1 ring-sky-300/60'
                  : 'bg-sky-50/70 border-sky-100/90 hover:bg-sky-50'
              } ${isLast ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className="text-base sm:text-lg font-bold text-sky-950 font-mono tabular-nums leading-tight truncate">
                {unit.val}
              </div>
              <div className="text-xs font-semibold text-sky-800 tracking-tight mt-0.5">
                {unit.label}
              </div>
              <div className="text-[10px] text-sky-600/80 uppercase tracking-tighter">
                {unit.sub}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-2.5 font-mono">
        Ticking every second with {friendName} 💙
      </p>
    </div>
  );
};
