import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-jar-card',
    title: 'Toples Fermentasi Aktif',
    description: 'Lihat perkembangan toplesmu, umur hari fermentasi, dan pastikan cairan tidak melebihi batas aman 2/3 kapasitas wadah.',
    placement: 'bottom'
  },
  {
    targetId: 'tour-calculator-card',
    title: 'Kalkulator Takaran 1 : 3 : 10',
    description: 'Gunakan kalkulator ini untuk menghitung takaran presisi gula merah, sisa kulit buah, dan air sesuai volume toplesmu.',
    placement: 'bottom'
  },
  {
    targetId: 'tour-mission-card',
    title: 'Misi & Observasi Harian',
    description: 'Setiap hari, buka toples perlahan untuk merilis gas, lalu catat warna, aroma, dan jamur di kartu observasi harian.',
    placement: 'top'
  },
  {
    targetId: 'tour-scanner-button',
    title: 'AI Camera Scanner',
    description: 'Pindai sisa kulit buah atau sayur segar menggunakan kamera Edge AI offline untuk memastikan bahan layak sebelum difermentasi.',
    placement: 'top'
  },
  {
    targetId: 'tour-header-stats',
    title: 'Streak & Poin Kedisiplinan',
    description: 'Pertahankan streak harian dan raih poin untuk membuka lencana serta membawa kelasmu memimpin klasemen sekolah!',
    placement: 'bottom'
  }
];

interface AppTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  showInitialPrompt: boolean;
  onDismissPrompt: () => void;
}

export const AppTourGuide: React.FC<AppTourGuideProps> = ({
  isOpen,
  onClose,
  onStartTour,
  showInitialPrompt,
  onDismissPrompt
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Update target bounding box ketika step berganti atau window di-resize
  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const step = TOUR_STEPS[currentStepIndex];
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Beri sedikit jeda scroll agar posisi rect akurat
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
        }, 150);
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [isOpen, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    setCurrentStepIndex(0);
    onClose();
  };

  // ================= 1. MODAL TANYA PERTAMA KALI =================
  if (showInitialPrompt && !isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-2xl border border-stone-200 text-stone-800 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-lg flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            🌱
          </div>
          <h3 className="font-extrabold text-base text-stone-900">
            Selamat Datang di EnzyMate!
          </h3>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Ingin mengikuti panduan tur singkat untuk mengenal fitur-fitur penting pembuatan eco-enzyme?
          </p>

          <div className="w-full space-y-2 mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => {
                onDismissPrompt();
                onStartTour();
              }}
              className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center shadow-sm"
            >
              Mulai Tur Panduan
            </button>
            <button
              onClick={onDismissPrompt}
              className="w-full py-2 px-4 rounded-xl text-stone-500 hover:text-stone-800 font-semibold text-xs transition-colors"
            >
              Nanti Saja (Bisa Dibuka Kapan Saja)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. SPOTLIGHT & BOKEH OVERLAY TOUR =================
  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  // Hitung posisi kotak sorot dengan margin aman
  const padding = 6;
  const spotlightStyle: React.CSSProperties = targetRect
    ? {
        position: 'fixed',
        top: Math.max(8, targetRect.top - padding),
        left: Math.max(8, targetRect.left - padding),
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
        borderRadius: '16px',
        boxShadow: '0 0 0 9999px rgba(12, 16, 20, 0.72)',
        border: '2px solid rgba(52, 211, 153, 0.9)',
        zIndex: 51,
        pointerEvents: 'none',
        transition: 'all 0.25s ease-out'
      }
    : {};

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* Efek Bokeh Latar Belakang */}
      <div className="fixed inset-0 backdrop-blur-[2px] pointer-events-none" />

      {/* Kotak Sorotan Lampu (Spotlight Cutout) */}
      {targetRect && <div style={spotlightStyle} />}

      {/* Dialog Panduan & Penunjuk Panah */}
      <div className="fixed inset-x-4 z-52 flex justify-center bottom-6 sm:bottom-10 pointer-events-auto">
        <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-stone-100 flex flex-col text-stone-900 animate-in slide-in-from-bottom-2 duration-200">
          {/* Header Dialog */}
          <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-stone-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Langkah {currentStepIndex + 1} dari {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleFinish}
              className="text-stone-400 hover:text-stone-700 text-xs font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>Lewati</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indikator Panah Penunjuk */}
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
            {currentStep.placement === 'bottom' ? (
              <ArrowUp className="w-4 h-4 text-emerald-600 animate-bounce" />
            ) : (
              <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
            )}
            <span>{currentStep.title}</span>
          </div>

          {/* Deskripsi Langkah */}
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            {currentStep.description}
          </p>

          {/* Navigasi Next & Back */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                isFirst
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleNext}
              className="enzymate-btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span>{isLast ? 'Selesai Tur' : 'Lanjut'}</span>
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
