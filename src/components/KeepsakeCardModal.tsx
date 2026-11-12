import React, { useRef } from 'react';
import { Award, X, Printer, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KeepsakeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendName: string;
  senderName: string;
  yearsCount: number;
}

export const KeepsakeCardModal: React.FC<KeepsakeCardModalProps> = ({
  isOpen,
  onClose,
  friendName,
  senderName,
  yearsCount,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {}
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl relative border-4 border-double border-sky-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
        ref={certificateRef}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border & Header */}
        <div className="text-center pb-6 border-b border-sky-100">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-sky-300">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-sky-600 font-bold">
            Official Keepsake & Honor
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            Certificate of Brotherhood
          </h2>
          <p className="text-sm text-sky-700 font-medium mt-1">
            Celebrating {yearsCount} Years of Unconditional Friendship
          </p>
        </div>

        {/* Certificate Body */}
        <div className="py-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            This certifies that
          </p>
          <div className="font-serif-display text-3xl sm:text-4xl text-sky-800 font-bold underline decoration-sky-300 underline-offset-8">
            {friendName}
          </div>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
            is officially recognized as the most loyal, dependable, and genuine best friend.
            For 8 continuous years (2018 – 2026), standing as an unshakable brother through every adventure,
            laugh, challenge, and milestone.
          </p>

          {/* Golden Seal badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-full text-xs font-semibold text-sky-800 shadow-xs">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Lifetime Brother Status Guaranteed</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-sky-100 flex items-center justify-between px-4 sm:px-8">
          <div className="text-center">
            <div className="font-handwriting text-2xl text-slate-800 font-bold">
              {senderName}
            </div>
            <div className="w-32 h-0.5 bg-slate-300 mx-auto mt-1" />
            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">
              Best Friend & Brother
            </p>
          </div>

          <div className="text-center">
            <div className="text-base font-mono font-bold text-sky-700">
              2018 – Forever
            </div>
            <div className="w-32 h-0.5 bg-slate-300 mx-auto mt-1" />
            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">
              {yearsCount} Golden Years
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="print:hidden mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 rounded-xl transition-all shadow-md shadow-sky-300 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
