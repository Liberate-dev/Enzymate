import React from 'react';
import { FermentStatus } from '../types';

interface JarIllustrationProps {
  dayNumber: number;
  totalDays?: number;
  status?: FermentStatus;
  organicWeight?: number;
  className?: string;
}

export const JarIllustration: React.FC<JarIllustrationProps> = ({
  dayNumber,
  totalDays = 90,
  status = 'normal',
  organicWeight = 300,
  className = ''
}) => {
  const percentage = Math.min(100, Math.round((dayNumber / totalDays) * 100));

  // Warna cairan berdasarkan umur & status
  let liquidColor = '#D97706'; // Golden amber
  let bubbleColor = '#FDE68A';

  if (status === 'failed') {
    liquidColor = '#78350F'; // Dark murky
    bubbleColor = '#6B7280';
  } else if (dayNumber < 10) {
    liquidColor = '#EAB308'; // Fresh yellowish
  } else if (dayNumber > 60) {
    liquidColor = '#B45309'; // Mature rich brown
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Visual Jar SVG */}
      <div className="relative w-44 h-56 flex items-center justify-center">
        <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Tutup Toples */}
          <rect x="45" y="10" width="70" height="14" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <rect x="52" y="24" width="56" height="8" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          
          {/* Badan Kaca Toples */}
          <rect x="25" y="30" width="110" height="160" rx="24" fill="#F0FDF4" fillOpacity="0.4" stroke="#94A3B8" strokeWidth="2.5" />

          {/* Garis Batas Aman 2/3 Kapasitas (Educational Guideline) */}
          <line x1="28" y1="84" x2="132" y2="84" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="32" y="78" fill="#D97706" fontSize="7" fontWeight="bold">BATAS AMAN (2/3)</text>
          <text x="32" y="70" fill="#94A3B8" fontSize="6.5">Ruang Gas Fermentasi</text>

          {/* Cairan Fermentasi (Maksimal 2/3) */}
          <defs>
            <clipPath id="liquidClip">
              <rect x="26.5" y="84" width="107" height="104" rx="22" />
            </clipPath>
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={liquidColor} stopOpacity="0.75" />
              <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
            </linearGradient>
          </defs>

          <g clipPath="url(#liquidClip)">
            {/* Cairan Utama */}
            <rect x="20" y="80" width="120" height="110" fill="url(#liquidGrad)" />
            
            {/* Gelombang Permukaan Cairan */}
            <path
              d="M20 84 Q45 80, 80 84 T140 84 L140 200 L20 200 Z"
              fill={liquidColor}
              fillOpacity="0.3"
            />

            {/* Potongan Kulit Buah Melayang */}
            {/* Kulit Jeruk 1 */}
            <path d="M42 120 C42 120, 52 110, 60 122" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
            {/* Kulit Jeruk 2 */}
            <path d="M90 145 C90 145, 102 138, 108 148" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
            {/* Potongan Pisang / Buah Kuning */}
            <ellipse cx="78" cy="115" rx="7" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <ellipse cx="50" cy="155" rx="8" ry="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            {/* Potongan Sayur Hijau */}
            <path d="M72 160 Q82 155, 92 165" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />

            {/* Partikel Gelembung Gas Aktif (jika bukan gagal) */}
            {status !== 'failed' && (
              <>
                <circle cx="58" cy="98" r="2.5" fill={bubbleColor} opacity="0.8" className="animate-bounce" />
                <circle cx="95" cy="105" r="2" fill={bubbleColor} opacity="0.7" />
                <circle cx="70" cy="135" r="3" fill={bubbleColor} opacity="0.6" />
                <circle cx="112" cy="120" r="1.5" fill={bubbleColor} opacity="0.8" />
              </>
            )}

            {/* Lapisan Jamur Putih Halus jika status normal & hari > 7 */}
            {status === 'normal' && dayNumber >= 7 && (
              <path
                d="M32 85 Q50 87, 80 85 T128 85"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="2 2"
                opacity="0.9"
              />
            )}
          </g>

          {/* Kilauan Kaca Toples */}
          <path d="M35 45 L35 170" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        </svg>

        {/* Floating Day Badge */}
        <div className="absolute -bottom-2 bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-600">
          <span>Hari ke-{dayNumber}</span>
          <span className="text-emerald-300">/ {totalDays}</span>
        </div>
      </div>

      {/* Progress Bar Persentase Fermentasi */}
      <div className="w-full mt-5 px-4">
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <span className="text-stone-600">Perjalanan Panen</span>
          <span className="text-emerald-700 font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-stone-600 mt-1">
          <span>Hari 1 (Mulai)</span>
          <span>90 Hari (Panen Alami)</span>
        </div>
      </div>
    </div>
  );
};
