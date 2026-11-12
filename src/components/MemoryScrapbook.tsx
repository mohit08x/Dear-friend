import React, { useState, useRef } from 'react';
import { Camera, Plus, X, Heart, ZoomIn, Calendar, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  note: string;
  rotation: number;
}

interface MemoryScrapbookProps {
  friendName?: string;
}

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({ friendName = 'Prince Sharma' }) => {
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: '1',
      title: 'Road Trips & Sunset Talks',
      date: 'Summer 2019',
      location: 'Highway Vista',
      imageUrl: '/src/assets/images/memories_roadtrip_1794473286789.jpg',
      note: 'Sitting on the car hood talking about what life would look like in 10 years. We promised we would never lose touch, no matter where life took us.',
      rotation: -2,
    },
    {
      id: '2',
      title: 'Endless Chai & Big Dreams',
      date: 'Winter 2021',
      location: 'Favorite Corner Cafe',
      imageUrl: '/src/assets/images/memories_cafe_1794473286861.jpg',
      note: 'Hours passed like minutes. We solved all the world’s problems over hot cups of chai and laughed until our stomachs hurt.',
      rotation: 2.5,
    },
    {
      id: '3',
      title: 'Brothers in Arms',
      date: 'Autumn 2023',
      location: 'Mountain Overlook',
      imageUrl: '/src/assets/images/friend_portrait_1794473284570.jpg',
      note: 'No masks, no pretenses. Just genuine brotherhood and unwavering trust. The best confidant and companion a guy could ask for.',
      rotation: -1.5,
    },
  ]);

  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImageUrl(url);
    }
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMem: MemoryItem = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate || '2024',
      location: newLocation || 'Somewhere Special',
      imageUrl: newImageUrl || '/src/assets/images/friend_portrait_1794473284570.jpg',
      note: newNote || 'A special moment with my best friend.',
      rotation: (Math.random() - 0.5) * 6,
    };

    setMemories([newMem, ...memories]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewNote('');
    setNewImageUrl('');

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#38bdf8', '#bae6fd'],
      });
    } catch {}
  };

  return (
    <div className="w-full bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm shadow-sky-500/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-sky-600 font-semibold mb-1">
            Memory Polaroid Scrapbook
          </h2>
          <p className="font-serif-display text-2xl sm:text-3xl text-slate-800 font-bold">
            Snapshots Along Our 8-Year Journey
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Click any Polaroid to view the story behind the photo.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm shadow-sky-300 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Memory</span>
        </button>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {memories.map((mem) => (
          <div
            key={mem.id}
            onClick={() => setActiveMemory(mem)}
            className="group cursor-pointer bg-white p-3.5 pb-5 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/80"
            style={{
              transform: `rotate(${mem.rotation}deg)`,
            }}
          >
            {/* Top washi tape effect */}
            <div className="w-16 h-4 mx-auto -mt-6 mb-2 bg-sky-200/70 border border-sky-300/40 rounded-xs shadow-xs transform -rotate-1 opacity-80" />

            {/* Photo container */}
            <div className="relative aspect-square w-full bg-slate-100 overflow-hidden rounded-xs border border-slate-100">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2 bg-white/90 rounded-full shadow-md text-sky-600">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Polaroid handwritten caption */}
            <div className="mt-3.5 text-center">
              <h3 className="font-handwriting text-xl text-slate-800 leading-tight">
                {mem.title}
              </h3>
              <p className="text-[11px] text-slate-600 mt-1 flex items-center justify-center gap-1.5">
                <span>{mem.date}</span>
                <span>·</span>
                <span>{mem.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeMemory && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveMemory(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-sky-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveMemory(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 mb-4 shadow-inner">
              <img
                src={activeMemory.imageUrl}
                alt={activeMemory.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-sky-600 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeMemory.date}</span>
              <span>·</span>
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeMemory.location}</span>
            </div>

            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
              {activeMemory.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed bg-sky-50/50 p-4 rounded-xl border border-sky-100/70">
              {activeMemory.note}
            </p>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1 text-sky-600">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Cherished with {friendName}
              </span>
              <button
                onClick={() => {
                  try {
                    confetti({
                      particleCount: 30,
                      spread: 50,
                      origin: { y: 0.6 },
                    });
                  } catch {}
                }}
                className="text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
              >
                Send A Heart 💙
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-sky-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-1">
              Add a Friendship Memory
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pin a new moment or milestone to {friendName}’s keepsake board.
            </p>

            <form onSubmit={handleAddMemory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Late night road trip to the hills"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2020 / College Year"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Campus cafeteria"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo (Upload or Preset)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Device Photo</span>
                  </button>
                  {newImageUrl && (
                    <span className="text-[11px] text-emerald-600 font-medium truncate max-w-[150px]">
                      Photo selected ✓
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Memory Note
                </label>
                <textarea
                  rows={3}
                  placeholder="What made this moment unforgettable?"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm shadow-sky-300"
                >
                  Save to Scrapbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
