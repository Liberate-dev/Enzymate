import React from 'react';

interface MascotBotProps {
  mood?: 'happy' | 'thoughtful' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MascotBot: React.FC<MascotBotProps> = ({
  mood = 'happy',
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Antena */}
        <line x1="60" y1="20" x2="60" y2="8" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
        <circle
          cx="60"
          cy="7"
          r="6"
          fill={mood === 'danger' ? '#EF4444' : mood === 'warning' ? '#F59E0B' : '#0284C7'}
          className={mood === 'danger' || mood === 'warning' ? 'animate-pulse' : ''}
        />

        {/* Telinga / Sensor samping */}
        <rect x="14" y="42" width="8" height="24" rx="4" fill="#0284C7" />
        <rect x="98" y="42" width="8" height="24" rx="4" fill="#0284C7" />

        {/* Kepala Robot Utama (Biru Muda Ramah) */}
        <rect x="20" y="20" width="80" height="70" rx="24" fill="#BAE6FD" />
        <rect x="23" y="23" width="74" height="64" rx="21" stroke="#38BDF8" strokeWidth="3" />

        {/* Layar Muka (Dark visor lembut) */}
        <rect x="28" y="32" width="64" height="46" rx="14" fill="#0F172A" />

        {/* Mata & Ekspresi sesuai mood */}
        {mood === 'happy' && (
          <>
            {/* Mata lengkung tersenyum */}
            <path d="M42 50 C44 44, 48 44, 50 50" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <path d="M70 50 C72 44, 76 44, 78 50" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            {/* Senyum */}
            <path d="M52 64 Q60 70 68 64" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round" />
            {/* Pipi merona */}
            <circle cx="38" cy="60" r="3" fill="#F472B6" opacity="0.8" />
            <circle cx="82" cy="60" r="3" fill="#F472B6" opacity="0.8" />
          </>
        )}

        {mood === 'thoughtful' && (
          <>
            {/* Mata bulat heran / observasi */}
            <circle cx="46" cy="48" r="4.5" fill="#38BDF8" />
            <circle cx="74" cy="48" r="4.5" fill="#38BDF8" />
            {/* Mulut datar memikirkan */}
            <line x1="53" y1="64" x2="67" y2="64" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {mood === 'warning' && (
          <>
            {/* Mata waspada */}
            <circle cx="46" cy="48" r="4.5" fill="#F59E0B" />
            <circle cx="74" cy="48" r="4.5" fill="#F59E0B" />
            {/* Mulut 'o' waspada */}
            <circle cx="60" cy="63" r="4" stroke="#F59E0B" strokeWidth="3" fill="none" />
          </>
        )}

        {mood === 'danger' && (
          <>
            {/* Mata tanda silang kecil atau tegas */}
            <line x1="43" y1="46" x2="49" y2="52" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="49" y1="46" x2="43" y2="52" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="71" y1="46" x2="77" y2="52" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="77" y1="46" x2="71" y2="52" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            {/* Mulut cemas melengkung ke bawah */}
            <path d="M52 66 Q60 60 68 66" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* Daun Eco di dada / leher kecil */}
        <path
          d="M60 92 C60 92, 54 99, 60 106 C66 99, 60 92, 60 92 Z"
          fill="#22C55E"
          stroke="#15803D"
          strokeWidth="1.5"
        />
        <circle cx="60" cy="98" r="1.5" fill="#DCFCE7" />
      </svg>
    </div>
  );
};
