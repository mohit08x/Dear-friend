import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingHearts } from './components/FloatingHearts';
import { InteractiveLetter } from './components/InteractiveLetter';

export default function App() {
  // Letter State
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [friendName, setFriendName] = useState('Prince Sharma');
  const [senderName, setSenderName] = useState('Mohit');
  const [letterTitle, setLetterTitle] = useState('Dear Prince Sharma 💙');
  const [startYear, setStartYear] = useState(2018);
  const REAL_PHOTO_URL = '/assets/aistudio/Screenshot_2026-11-12-15-06-46-31_99c04817c0de5652397fc8b56c3b3817_79915471.jpg';

  const NEW_MESSAGE_TEXT = `My Best Friend – Prince Sharma ❤️\n\nPrince Sharma is not just my best friend; he is like a brother to me. We have been friends for the last 8 years. We first met in Class 4, and since then, we have shared countless memories together. Through every happy and difficult moment, our friendship has remained strong. He is someone I can trust, laugh with, and share everything with. No matter how much time passes or how far life takes us, I hope our friendship always remains the same.\n\n8 Years of Friendship, Countless Memories, and a Bond Forever! ❤️`;

  const [photoUrl, setPhotoUrl] = useState(REAL_PHOTO_URL);
  const [messageText, setMessageText] = useState(NEW_MESSAGE_TEXT);

  // State

  // Load saved preferences if existing
  useEffect(() => {
    try {
      const saved = localStorage.getItem('friendship_letter_prince');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.friendName) setFriendName(parsed.friendName);
        if (parsed.senderName) setSenderName(parsed.senderName);
        if (parsed.letterTitle) setLetterTitle(parsed.letterTitle);
        if (parsed.messageText && !parsed.messageText.includes('Looking back at 2018')) {
          setMessageText(parsed.messageText);
        } else {
          setMessageText(NEW_MESSAGE_TEXT);
        }
        // Use user's real uploaded photo
        setPhotoUrl(REAL_PHOTO_URL);
        if (parsed.startYear) setStartYear(parsed.startYear);
      }
    } catch {}
  }, []);

  const handleSaveLetter = (data: {
    friendName: string;
    senderName: string;
    letterTitle: string;
    messageText: string;
    photoUrl: string;
    startYear: number;
  }) => {
    setFriendName(data.friendName);
    setSenderName(data.senderName);
    setLetterTitle(data.letterTitle);
    setMessageText(data.messageText);
    setPhotoUrl(data.photoUrl);
    setStartYear(data.startYear);

    try {
      localStorage.setItem('friendship_letter_prince', JSON.stringify(data));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#bae6fd'],
      });
    } catch {}
  };

  const handleGlobalCelebrate = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#0284c7', '#38bdf8', '#60a5fa', '#93c5fd', '#3b82f6'],
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff5ff] via-[#c7edff] to-[#a9ddff] text-slate-800 relative selection:bg-sky-200 selection:text-sky-900 overflow-x-hidden flex flex-col justify-between">
      {/* Floating Ambient Blue Hearts & Sparkles */}
      <FloatingHearts />

      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
          {/* Zone 1: Brand wordmark */}
          <a
            href="/"
            className="font-serif-display text-lg sm:text-xl font-bold tracking-tight text-sky-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>8 Years of Friendship</span>
            <Heart className="w-4 h-4 text-sky-600 fill-current" />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setIsLetterOpen(!isLetterOpen)}
              className="hover:text-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Letter 💌
            </button>
            <button
              onClick={handleGlobalCelebrate}
              className="hover:text-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Celebrate 🎉
            </button>
          </nav>

          {/* Zone 3: Celebrate CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGlobalCelebrate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate 8 Years</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center items-center relative z-20">
        {/* Letter & Envelope */}
        <section id="letter" className="w-full">
          <InteractiveLetter
            friendName={friendName}
            senderName={senderName}
            letterTitle={letterTitle}
            messageText={messageText}
            photoUrl={photoUrl}
            startYear={startYear}
            isOpen={isLetterOpen}
            onToggleOpen={() => setIsLetterOpen(!isLetterOpen)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-sky-200/80 bg-white/70 backdrop-blur-md py-8 text-center text-xs text-slate-500 relative z-20">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-sky-900 text-sm">
              8 Years of Friendship 💙
            </span>
            <span>·</span>
            <span>Dedicated to Prince Sharma</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={handleGlobalCelebrate}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Celebrate 🎉
            </button>
          </div>

          <div>
            Crafted with love by {senderName}
          </div>
        </div>
      </footer>
    </div>
  );
}
