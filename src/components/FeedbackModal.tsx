import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MascotBot } from './MascotBot';
import { EvaluationResult } from '../ruleEngine';

interface FeedbackModalProps {
  result: EvaluationResult;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ result, onClose }) => {
  useEffect(() => {
    if (result.status === 'normal') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  }, [result.status]);

  const statusConfig = {
    normal: {
      badgeText: 'Kondisi Normal & Sehat',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    },
    observe: {
      badgeText: 'Perlu Pengamatan Lanjutan',
      badgeClass: 'bg-stone-100 text-stone-800 border-stone-300'
    },
    attention: {
      badgeText: 'Perlu Perhatian Khusus',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300'
    },
    failed: {
      badgeText: 'Kontaminasi Terdeteksi',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300'
    }
  }[result.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col items-center text-center">
        {/* Maskot Robot */}
        <MascotBot mood={result.mascotMood} size="lg" className="mb-2" />

        {/* Status Badge */}
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border mb-2 ${statusConfig.badgeClass}`}
        >
          <span>{statusConfig.badgeText}</span>
        </div>

        {/* Headline */}
        <h3 className="text-base font-bold text-stone-900 mb-1">{result.headline}</h3>

        {/* Pesan Evaluasi */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed mb-3 text-left">
          <p className="font-medium">{result.feedback}</p>
        </div>

        {/* Peringatan Khusus Dewasa jika status Gagal / Darurat */}
        {result.requiresAdult && (
          <div className="w-full bg-rose-50 border border-rose-300 p-3 rounded-xl text-left mb-3">
            <div className="text-xs font-bold text-rose-900 mb-0.5">
              Instruksi Keselamatan Pendamping:
            </div>
            <p className="text-[11px] text-rose-800 leading-snug">
              {result.actionAdvice}
            </p>
          </div>
        )}

        {/* Rekomendasi Tindakan jika bukan gagal */}
        {!result.requiresAdult && (
          <div className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-left mb-3 text-[11px] text-stone-700">
            <span className="font-bold">Saran: </span>
            {result.actionAdvice}
          </div>
        )}

        {/* Reward Poin */}
        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-4">
          +{result.points} Poin Kedisiplinan Ditambahkan
        </div>

        {/* Tombol Selesai */}
        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};
