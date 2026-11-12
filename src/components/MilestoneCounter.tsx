import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Award } from 'lucide-react';

interface MilestoneCounterProps {
  startDateYear?: number;
}

export const MilestoneCounter: React.FC<MilestoneCounterProps> = ({ startDateYear = 2018 }) => {
  const [secondsTogether, setSecondsTogether] = useState<number>(0);

  useEffect(() => {
    // Start date approximately Nov 12, 2018
    const startDate = new Date(startDateYear, 10, 12, 10, 0, 0).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSec = Math.floor(Math.max(0, now - startDate) / 1000);
      setSecondsTogether(diffSec);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDateYear]);

  const days = Math.floor(secondsTogether / (3600 * 24));
  const hours = Math.floor((secondsTogether % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsTogether % 3600) / 60);
  const seconds = secondsTogether % 60;
  const years = Math.floor(days / 365.25);
  const totalMonths = years * 12;

  const milestones = [
    { label: 'Years of Brotherhood', value: `${years}`, icon: Award, sub: 'Unbreakable bond' },
    { label: 'Total Months', value: `${totalMonths}`, icon: Calendar, sub: 'Countless memories' },
    { label: 'Days Together', value: days.toLocaleString(), icon: Heart, sub: 'Through thick & thin' },
    { label: 'Live Seconds', value: secondsTogether.toLocaleString(), icon: Clock, sub: 'And counting forever' },
  ];

  return (
    <div className="w-full bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm shadow-sky-500/5">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-xs uppercase tracking-widest text-sky-600 font-semibold mb-1">
          Friendship Counter & Milestone
        </h2>
        <p className="font-serif-display text-2xl sm:text-3xl text-slate-800 font-bold">
          {years} Years, Every Second Cherished
        </p>
        <p className="text-sm text-slate-500 mt-2">
          From the day we first met in {startDateYear} to this very moment, standing strong side by side.
        </p>
      </div>

      {/* Grid of counter tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {milestones.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-sky-50/70 border border-sky-100/80 rounded-2xl p-4 text-center hover:bg-sky-50 transition-colors"
            >
              <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-white text-sky-600 flex items-center justify-center shadow-xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-sky-900 font-mono tabular-nums tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-sky-800 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-sky-600/70 mt-0.5">
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live breakdown clock */}
      <div className="mt-5 pt-4 border-t border-sky-100/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-mono tabular-nums">
        <span><strong className="text-sky-700">{days}</strong> days</span>
        <span className="text-slate-300">·</span>
        <span><strong className="text-sky-700">{hours}</strong> hours</span>
        <span className="text-slate-300">·</span>
        <span><strong className="text-sky-700">{minutes}</strong> mins</span>
        <span className="text-slate-300">·</span>
        <span><strong className="text-sky-700 text-sm">{seconds}</strong> secs</span>
      </div>
    </div>
  );
};
