import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  preferredPlacement?: 'top' | 'bottom';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-jar-card',
    title: 'Toples Fermentasi Aktif',
    description: 'Lihat perkembangan toplesmu, umur hari fermentasi, dan pastikan cairan tidak melebihi batas aman 2/3 kapasitas wadah.',
    preferredPlacement: 'bottom'
  },
  {
    targetId: 'tour-calculator-card',
    title: 'Kalkulator Takaran 1 : 3 : 10',
    description: 'Gunakan kalkulator ini untuk menghitung takaran presisi gula merah, sisa kulit buah, dan air sesuai volume toplesmu.',
    preferredPlacement: 'bottom'
  },
  {
    targetId: 'tour-mission-card',
    title: 'Misi & Observasi Harian',
    description: 'Setiap hari, buka toples perlahan untuk merilis gas, lalu catat warna, aroma, dan jamur di kartu observasi harian.',
    preferredPlacement: 'top'
  },
  {
    targetId: 'tour-scanner-button',
    title: 'AI Camera Scanner',
    description: 'Pindai sisa kulit buah atau sayur segar menggunakan kamera Edge AI offline untuk memastikan bahan layak sebelum difermentasi.',
    preferredPlacement: 'top'
  },
  {
    targetId: 'tour-header-stats',
    title: 'Streak & Poin Kedisiplinan',
    description: 'Pertahankan streak harian dan raih poin untuk membuka lencana serta membawa kelasmu memimpin klasemen sekolah!',
    preferredPlacement: 'bottom'
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
  const rafRef = useRef<number | null>(null);

  // Fungsi sinkronisasi koordinat posisi elemen target
  const syncRect = useCallback(() => {
    if (!isOpen) return;
    const step = TOUR_STEPS[currentStepIndex];
    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [isOpen, currentStepIndex]);

  // Handle scroll & penyesuaian saat step berganti
  useEffect(() => {
    if (!isOpen) return;

    const step = TOUR_STEPS[currentStepIndex];
    const el = document.getElementById(step.targetId);

    if (el) {
      if (step.targetId === 'tour-header-stats') {
        // Untuk header stats di langkah 5, scroll container ke paling atas seketika
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        // Scroll instan ke elemen agar tidak terjadi delay animasi getBoundingClientRect
        el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }

    // Ambil koordinat awal
    syncRect();

    // Pastikan posisi ter-update setelah frame berikutnya
    rafRef.current = requestAnimationFrame(() => {
      syncRect();
    });

    const scrollContainer = document.getElementById('main-scroll-container');
    const handleScroll = () => {
      syncRect();
    };

    window.addEventListener('resize', handleScroll);
    window.addEventListener('scroll', handleScroll, true);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', handleScroll, true);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpen, currentStepIndex, syncRect]);

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
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. SPOTLIGHT DENGAN HOLE-CUTOUT (TIDAK BLUR DI AREA TARGET) =================
  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  // Hitung posisi kotak sorot dengan margin aman
  const pad = 6;
  const spotlightX = targetRect ? Math.max(4, targetRect.left - pad) : 0;
  const spotlightY = targetRect ? Math.max(4, targetRect.top - pad) : 0;
  const spotlightW = targetRect ? targetRect.width + pad * 2 : 0;
  const spotlightH = targetRect ? targetRect.height + pad * 2 : 0;

  // Logika posisi tooltip dinamis: jika target di bagian bawah layar (misal tombol Scan),
  // tempatkan tooltip di bagian ATAS agar tidak menutupi tombol!
  const isTargetAtBottom = targetRect ? targetRect.top > window.innerHeight * 0.45 : false;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* SVG MASK UNTUK MENG-CUTOUT BLUR & WARNA GELAP DI AREA HIGHLIGHT */}
      {targetRect && (
        <svg className="fixed inset-0 w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <mask id="spotlight-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              {/* Bagian putih: dilapisi gelap & blur */}
              <rect width="100vw" height="100vh" fill="white" />
              {/* Bagian hitam (cutout): 100% tembus pandang, TANPA BLUR, TANPA GELAP */}
              <rect
                x={spotlightX}
                y={spotlightY}
                width={spotlightW}
                height={spotlightH}
                rx={16}
                ry={16}
                fill="black"
              />
            </mask>
          </defs>
        </svg>
      )}

      {/* OVERLAY GELAP & BOKEH DENGAN CUTOUT MASK (BAGIAN HIGHLIGHT TIDAK KENA BLUR) */}
      <div
        className="fixed inset-0 pointer-events-none z-50 transition-all duration-200"
        style={{
          backgroundColor: 'rgba(12, 16, 20, 0.72)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          mask: targetRect ? 'url(#spotlight-mask)' : 'none',
          WebkitMask: targetRect ? 'url(#spotlight-mask)' : 'none'
        }}
      />

      {/* BINGKAI HIGHLIGHT HIJAU MENYALA DI SEKELILING ELEMEN TARGET */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-51 rounded-2xl border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-200"
          style={{
            top: spotlightY,
            left: spotlightX,
            width: spotlightW,
            height: spotlightH
          }}
        />
      )}

      {/* KOTAK KETERANGAN FLEKSIBEL (MUNCUL DI ATAS ATAU DI BAWAH SESUAI POSISI TARGET) */}
      <div
        className={`fixed inset-x-4 z-52 flex justify-center pointer-events-auto transition-all duration-200 ${
          isTargetAtBottom ? 'top-6 sm:top-8' : 'bottom-6 sm:bottom-8'
        }`}
      >
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

          {/* Indikator Panah Penunjuk Sesuai Posisi Elemen Target */}
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
            {isTargetAtBottom ? (
              <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
            ) : (
              <ArrowUp className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
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
