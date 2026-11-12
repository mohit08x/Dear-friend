import React, { useState, useRef } from 'react';
import { X, Camera, Check, RefreshCw } from 'lucide-react';

interface EditLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendName: string;
  senderName: string;
  letterTitle: string;
  messageText: string;
  photoUrl: string;
  startYear: number;
  onSave: (data: {
    friendName: string;
    senderName: string;
    letterTitle: string;
    messageText: string;
    photoUrl: string;
    startYear: number;
  }) => void;
}

export const EditLetterModal: React.FC<EditLetterModalProps> = ({
  isOpen,
  onClose,
  friendName,
  senderName,
  letterTitle,
  messageText,
  photoUrl,
  startYear,
  onSave,
}) => {
  const [fName, setFName] = useState(friendName);
  const [sName, setSName] = useState(senderName);
  const [lTitle, setLTitle] = useState(letterTitle);
  const [msg, setMsg] = useState(messageText);
  const [img, setImg] = useState(photoUrl);
  const [year, setYear] = useState(startYear);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg(url);
    }
  };

  const handleResetDefaults = () => {
    setFName('Prince Sharma');
    setSName('Mohit Kumar');
    setLTitle('For Prince Sharma 💙');
    setMsg(
      `Dear Prince,\n\nLooking back at 2018 when our journey began, I never could have imagined gaining not just a best friend, but a true brother for life. Through every exam, late-night tea session, road trip, and tough transition, you've been my constant anchor.\n\nEight years is thousands of shared laughs, unconditional support, and unspoken understanding. Thank you for always believing in me, celebrating every win, and standing beside me in every struggle.\n\nHere’s to 8 incredible years of brotherhood, and a lifetime more to come!`
    );
    setImg('/assets/aistudio/Screenshot_2026-11-12-15-06-46-31_99c04817c0de5652397fc8b56c3b3817_79915471.jpg');
    setYear(2018);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      friendName: fName,
      senderName: sName,
      letterTitle: lTitle,
      messageText: msg,
      photoUrl: img,
      startYear: year,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-sky-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-1">
          Personalize Your Friendship Letter
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Customize the message, names, start year, and photo for Prince.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Friend's Name
              </label>
              <input
                type="text"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Signature
              </label>
              <input
                type="text"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Letter Header Title
              </label>
              <input
                type="text"
                value={lTitle}
                onChange={(e) => setLTitle(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Friendship Start Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2018)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Main Friendship Photo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Custom Picture</span>
              </button>
              {img && (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Heartfelt Letter Message
            </label>
            <textarea
              rows={6}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 leading-relaxed font-serif"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm shadow-sky-300"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
