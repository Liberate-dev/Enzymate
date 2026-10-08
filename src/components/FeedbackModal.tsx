import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MascotBot } from './MascotBot';
import { EvaluationResult } from '../ruleEngine';
import { ShieldAlert, Star, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface FeedbackModalProps {
  result: EvaluationResult;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ result, onClose }) => {
  useEffect(() => {
    // Jalankan efek selebrasi jika kondisi sehat/normal
    if (result.status === 'normal') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  }, [result.status]);

  const statusConfig = {
    normal: {
      badgeText: 'Berjalan Normal & Sehat',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle
    },
    observe: {
      badgeText: 'Perlu Diamati',
      badgeClass: 'bg-lime-100 text-lime-800 border-lime-300',
      icon: CheckCircle
    },
    attention: {
      badgeText: 'Perlu Perhatian',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle
    },
    failed: {
      badgeText: 'Kemungkinan Gagal (Perlu Guru/Ortu)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: ShieldAlert
    }
  }[result.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-100 flex flex-col items-center text-center">
        {/* Maskot AI Robot */}
        <MascotBot mood={result.mascotMood} size="lg" className="mb-2" />

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border mb-2 ${statusConfig.badgeClass}`}
        >
          <statusConfig.icon className="w-3.5 h-3.5" />
          <span>{statusConfig.badgeText}</span>
        </div>

        {/* Headline */}
        <h3 className="text-base font-bold text-stone-900 mb-1">{result.headline}</h3>

        {/* Pesan Edukatif Maskot */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed mb-3 text-left">
          <p className="font-medium">{result.feedback}</p>
        </div>

        {/* Peringatan Khusus Dewasa jika status Gagal / Darurat */}
        {result.requiresAdult && (
          <div className="w-full bg-rose-50 border border-rose-300 p-3 rounded-2xl text-left mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Protokol Keamanan Anak</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-snug">
              {result.actionAdvice}
            </p>
          </div>
        )}

        {/* Rekomendasi Tindakan jika bukan gagal */}
        {!result.requiresAdult && (
          <div className="w-full bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-left mb-3 text-[11px] text-emerald-900">
            <span className="font-bold">Saran AI: </span>
            {result.actionAdvice}
          </div>
        )}

        {/* Reward Bintang */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 mb-4">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{result.points} Bintang Kedisiplinan Ditambahkan!</span>
        </div>

        {/* Tombol Selesai */}
        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <span>Kembali ke Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
