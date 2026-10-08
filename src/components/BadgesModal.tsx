import React from 'react';
import { X, Award, Flame, Star, Trophy, Users, Leaf, Check } from 'lucide-react';
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
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-100 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Prestasi & Peringkat Sekolah</h3>
              <p className="text-[11px] text-stone-500">Misi SDG 12 & 13 Lingkungan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ringkasan Dampak Lingkungan */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-center">
            <Leaf className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-emerald-800">{organicSavedGrams} g</div>
            <div className="text-[9px] text-emerald-700">Sampah Diolah</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-center">
            <Flame className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-amber-800">{streakDays} Hari</div>
            <div className="text-[9px] text-amber-700">Streak Disiplin</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-2.5 text-center">
            <Star className="w-4 h-4 text-yellow-600 mx-auto mb-1 fill-yellow-500" />
            <div className="text-xs font-extrabold text-yellow-800">{totalPoints}</div>
            <div className="text-[9px] text-yellow-700">Total Bintang</div>
          </div>
        </div>

        {/* Koleksi Lencana (PRD Section 4.5) */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Koleksi Lencana Disiplin</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  b.unlocked
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {b.unlocked ? <Check className="w-3.5 h-3.5" /> : '🔒'}
                  </div>
                  {b.unlocked && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Terbuka
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-stone-800">{b.name}</div>
                <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{b.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Antar Kelas Sekolah */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Klasemen Toples Sekolah</span>
          </h4>
          <div className="space-y-1.5">
            {schoolLeaderboard.map((item) => (
              <div
                key={item.rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  item.isUser
                    ? 'bg-emerald-100/70 border-emerald-400 font-bold'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      item.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : item.rank === 2
                        ? 'bg-stone-300 text-stone-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="text-stone-800">{item.class}</span>
                </div>
                <div className="text-right">
                  <div className="text-emerald-800 font-bold">{item.points} pts</div>
                  <div className="text-[9px] text-stone-500">{item.weightKg} kg organik</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center mt-auto"
        >
          Tutup Prestasi
        </button>
      </div>
    </div>
  );
};
