import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-jar-card',
    title: 'Toples Fermentasi Aktif',
    description: 'Lihat perkembangan toplesmu, umur hari fermentasi, dan pastikan cairan tidak melebihi batas aman 2/3 kapasitas wadah.'
  },
  {
    targetId: 'tour-calculator-card',
    title: 'Kalkulator Takaran 1 : 3 : 10',
    description: 'Gunakan kalkulator ini untuk menghitung takaran presisi gula merah, sisa kulit buah, dan air sesuai volume toplesmu.'
  },
  {
    targetId: 'tour-mission-card',
    title: 'Misi & Observasi Harian',
    description: 'Setiap hari, buka toples perlahan untuk merilis gas, lalu catat warna, aroma, dan jamur di kartu observasi harian.'
  },
  {
    targetId: 'tour-scanner-button',
    title: 'AI Camera Scanner',
    description: 'Pindai sisa kulit buah atau sayur segar menggunakan kamera Edge AI offline untuk memastikan bahan layak sebelum difermentasi.'
  },
  {
    targetId: 'tour-header-stats',
    title: 'Streak & Poin Kedisiplinan',
    description: 'Pertahankan streak harian dan raih poin untuk membuka lencana serta membawa kelasmu memimpin klasemen sekolah!'
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

  // Fungsi mengukur koordinat elemen target secara real-time
  const measureTarget = useCallback(() => {
    if (!isOpen) return;
    const step = TOUR_STEPS[currentStepIndex];
    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [isOpen, currentStepIndex]);

  // Handle scroll & sinkronisasi koordinat saat step berganti
  useEffect(() => {
    if (!isOpen) return;

    const step = TOUR_STEPS[currentStepIndex];
    const el = document.getElementById(step.targetId);
    const scrollContainer = document.getElementById('main-scroll-container');

    if (step.targetId === 'tour-header-stats') {
      // Untuk langkah 5 (header stats), scroll container ke paling atas seketika
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    } else if (el && step.targetId !== 'tour-scanner-button') {
      // Scroll instan ke elemen jika bukan navbar yang sudah fixed di bawah
      el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
    }

    // Ukur koordinat langsung dan pastikan sinkron pada frame render berikutnya
    measureTarget();
    rafRef.current = requestAnimationFrame(() => {
      measureTarget();
    });

    const handleSync = () => {
      measureTarget();
    };

    window.addEventListener('resize', handleSync);
    window.addEventListener('scroll', handleSync, true);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleSync, { passive: true });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleSync);
      window.removeEventListener('scroll', handleSync, true);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleSync);
      }
    };
  }, [isOpen, currentStepIndex, measureTarget]);

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

  // ================= 2. SPOTLIGHT SHROUD (BAGIAN TARGET 100% TIDAK KENA BLUR) =================
  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  // Margin padding di sekitar target
  const pad = 6;
  const targetTop = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const targetLeft = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const targetWidth = targetRect ? targetRect.width + pad * 2 : 0;
  const targetHeight = targetRect ? targetRect.height + pad * 2 : 0;
  const targetRight = targetLeft + targetWidth;
  const targetBottom = targetTop + targetHeight;

  // Tentukan apakah target berada di bagian bawah layar
  const isTargetAtBottom = targetRect ? targetRect.top > window.innerHeight * 0.45 : false;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* 4 PANEL PENUTUP (SHROUD) YANG MEMBLUR SEMUA AREA LAIN, SEMENTARA AREA TARGET BEBAS DARI BLUR */}
      {targetRect ? (
        <>
          {/* Panel Atas (Menutup area di atas target -> Kena Blur & Gelap) */}
          <div
            className="fixed pointer-events-none z-50 bg-stone-950/75 backdrop-blur-[4px] transition-all duration-150"
            style={{
              top: 0,
              left: 0,
              width: '100vw',
              height: `${targetTop}px`
            }}
          />

          {/* Panel Bawah (Menutup area di bawah target -> Kena Blur & Gelap) */}
          <div
            className="fixed pointer-events-none z-50 bg-stone-950/75 backdrop-blur-[4px] transition-all duration-150"
            style={{
              top: `${targetBottom}px`,
              left: 0,
              width: '100vw',
              height: `calc(100vh - ${targetBottom}px)`
            }}
          />

          {/* Panel Kiri (Menutup area di sebelah kiri target -> Kena Blur & Gelap) */}
          <div
            className="fixed pointer-events-none z-50 bg-stone-950/75 backdrop-blur-[4px] transition-all duration-150"
            style={{
              top: `${targetTop}px`,
              left: 0,
              width: `${targetLeft}px`,
              height: `${targetHeight}px`
            }}
          />

          {/* Panel Kanan (Menutup area di sebelah kanan target -> Kena Blur & Gelap) */}
          <div
            className="fixed pointer-events-none z-50 bg-stone-950/75 backdrop-blur-[4px] transition-all duration-150"
            style={{
              top: `${targetTop}px`,
              left: `${targetRight}px`,
              width: `calc(100vw - ${targetRight}px)`,
              height: `${targetHeight}px`
            }}
          />

          {/* KOTAK BINGKAI HIGHLIGHT HIJAU TEPAT DI AREA TARGET (100% TAJAM, TANPA BLUR) */}
          <div
            className="fixed pointer-events-none z-51 rounded-2xl border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-150"
            style={{
              top: `${targetTop}px`,
              left: `${targetLeft}px`,
              width: `${targetWidth}px`,
              height: `${targetHeight}px`
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-50 bg-stone-950/75 backdrop-blur-[4px]" />
      )}

      {/* KOTAK KETERANGAN ADAPTIF (OTOMATIS MUNCUL DI ATAS JIKA TARGET DI BAWAH AGAR TIDAK MENUTUPI MENU) */}
      <div
        className={`fixed inset-x-4 z-52 flex justify-center pointer-events-auto transition-all duration-200 ${
          isTargetAtBottom ? 'top-6 sm:top-10' : 'bottom-6 sm:bottom-10'
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

          {/* Indikator Panah Penunjuk Fleksibel */}
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
