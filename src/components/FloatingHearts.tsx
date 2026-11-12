import React, { useEffect, useState, useCallback } from 'react';

interface HeartItem {
  id: number;
  x: number;
  y?: number;
  size: number;
  symbol: string;
  duration: number;
  color: string;
}

const HEART_ICONS = ['💙', '🩵', '✨', '💎', '🤍', '⭐'];
const BLUE_SHADES = ['#0284c7', '#38bdf8', '#0ea5e9', '#60a5fa', '#2563eb'];

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<HeartItem[]>([]);

  // Spawn a floating heart
  const addHeart = useCallback((xPercent?: number, yPercent?: number) => {
    const newHeart: HeartItem = {
      id: Date.now() + Math.random(),
      x: xPercent ?? Math.random() * 94 + 3,
      y: yPercent,
      size: Math.floor(Math.random() * 16) + 18,
      symbol: HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)],
      duration: Math.random() * 3 + 4.5,
      color: BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)],
    };

    setHearts((prev) => [...prev.slice(-30), newHeart]);
  }, []);

  // Ambient heart emitter
  useEffect(() => {
    const interval = setInterval(() => {
      addHeart();
    }, 1800);

    return () => clearInterval(interval);
  }, [addHeart]);

  // Clean up hearts after animation duration
  useEffect(() => {
    if (hearts.length === 0) return;
    const timeout = setTimeout(() => {
      setHearts((prev) => prev.filter((h) => Date.now() - h.id < 7000));
    }, 3000);
    return () => clearTimeout(timeout);
  }, [hearts]);

  // Global click to spawn hearts at click position
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if clicking interactive buttons or inputs
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, a, select')) {
        return;
      }
      const xPercent = (e.clientX / window.innerWidth) * 100;
      addHeart(xPercent);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [addHeart]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute animate-float-heart select-none"
          style={{
            left: `${heart.x}%`,
            bottom: heart.y !== undefined ? `${100 - heart.y}%` : '-30px',
            fontSize: `${heart.size}px`,
            filter: `drop-shadow(0 4px 10px ${heart.color}55)`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          {heart.symbol}
        </span>
      ))}
    </div>
  );
};
