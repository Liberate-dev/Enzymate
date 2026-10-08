import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../types';

interface BadgesModalProps {
  badges: Badge[];
  streakDays: number;
  totalPoints: number;
  organicSavedGrams: number;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  badges,
  streakDays,
  totalPoints,
  organicSavedGrams,
  onClose
}) => {
  const schoolLeaderboard = [
    { rank: 1, class: 'Kelas 5B - Tim Jeruk Manis', weightKg: 14.2, points: 640 },
    { rank: 2, class: 'Kelas 5A - Tim Enzy Hebat (Kamu)', weightKg: (organicSavedGrams / 1000).toFixed(1), points: totalPoints, isUser: true },
    { rank: 3, class: 'Kelas 4C - Pejuang Kompos', weightKg: 8.5, points: 410 },
    { rank: 4, class: 'Kelas 6A - Detektif Buah', weightKg: 6.8, points: 350 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col max-h-[90vh] overflow-y-auto text-stone-800">
        {/* Header Bersih */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">Prestasi & Klasemen Sekolah</h3>
            <p className="text-[11px] text-stone-500">Misi SDG Lingkungan & Disiplin</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ringkasan Statistik Angka (Tipografi Bersih) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-center">
            <div className="text-sm font-extrabold text-stone-900">{organicSavedGrams} g</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Sampah Diolah</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-center">
            <div className="text-sm font-extrabold text-stone-900">{streakDays} Hari</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Streak Disiplin</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-center">
            <div className="text-sm font-extrabold text-emerald-800">{totalPoints}</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Total Poin</div>
          </div>
        </div>

        {/* Koleksi Lencana */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-stone-800 mb-2">
            Lencana Disiplin
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  b.unlocked
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-stone-500">
                    {b.unlocked ? 'Terbuka' : 'Terkunci'}
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-800">{b.name}</div>
                <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{b.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Klasemen Antar Kelas Sekolah */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-stone-800 mb-2">
            Klasemen Toples Sekolah
          </h4>
          <div className="space-y-1.5">
            {schoolLeaderboard.map((item) => (
              <div
                key={item.rank}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  item.isUser
                    ? 'bg-emerald-50 border-emerald-300 font-semibold'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center font-bold text-stone-500 text-[11px]">
                    #{item.rank}
                  </span>
                  <span className="text-stone-800">{item.class}</span>
                </div>
                <div className="text-right">
                  <div className="text-stone-900 font-bold">{item.points} pts</div>
                  <div className="text-[9px] text-stone-500">{item.weightKg} kg organik</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-2 px-4 text-xs font-bold text-center mt-auto"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
