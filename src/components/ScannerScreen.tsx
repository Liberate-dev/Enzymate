import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Scale,
  Home,
  Star,
  Check
} from 'lucide-react';
import { SAMPLE_SCAN_PRESETS } from '../ruleEngine';
import { ScannedMaterial } from '../types';

interface ScannerScreenProps {
  onStartFermentation: (material: ScannedMaterial) => void;
  onOpenCalculator: (material?: ScannedMaterial) => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  onStartFermentation,
  onOpenCalculator
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ScannedMaterial>(SAMPLE_SCAN_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [confirmedMaterial, setConfirmedMaterial] = useState<ScannedMaterial | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Inisialisasi kamera jika diizinkan browser
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
            setCameraError(null);
          }
        }
      } catch (err) {
        setCameraActive(false);
        setCameraError('Kamera tidak aktif / mode simulasi offline aktif');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectPreset = (material: ScannedMaterial) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedMaterial(material);
      setIsScanning(false);
    }, 350);
  };

  const handleTriggerConfirmation = (material: ScannedMaterial) => {
    setConfirmedMaterial(material);
  };

  const handleGoToCalculator = () => {
    if (confirmedMaterial) {
      const mat = confirmedMaterial;
      setConfirmedMaterial(null);
      onStartFermentation(mat);
      onOpenCalculator(mat);
    }
  };

  const handleGoToHome = () => {
    if (confirmedMaterial) {
      const mat = confirmedMaterial;
      setConfirmedMaterial(null);
      onStartFermentation(mat);
    }
  };

  const isMaterialValid = selectedMaterial.isValid;

  return (
    <div className="flex-1 flex flex-col bg-stone-900 text-white relative overflow-hidden">
      {/* Top Bar Scanner */}
      <div className="p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-base font-bold flex items-center gap-1.5 text-emerald-400">
            <Camera className="w-5 h-5 text-emerald-400" />
            AI Camera Scanner
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>100% Edge AI Offline • Tanpa Cloud</span>
          </div>
        </div>

        <button
          onClick={() => onOpenCalculator()}
          className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border border-emerald-400/30 transition-all flex items-center gap-1"
        >
          <span>Panduan Takaran</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center bg-stone-950 overflow-hidden">
        {/* Video feed or mock surface */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-900">
            <div className="w-24 h-24 rounded-3xl bg-stone-800/80 border border-stone-700 flex items-center justify-center mb-3">
              <Sparkles className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="text-xs text-stone-300 max-w-xs leading-relaxed">
              Kamera siap mendeteksi. Gunakan tombol preset di bawah untuk simulasi langsung berbagai jenis bahan organik.
            </p>
          </div>
        )}

        {/* Viewfinder Target Bounding Box */}
        <div className="relative z-10 w-64 h-64 border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3 pointer-events-none shadow-[0_0_20px_rgba(52,211,153,0.2)]">
          {/* Sudut-sudut bidik */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

          {/* Garis Pemindai Animasi */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 text-emerald-300 backdrop-blur-sm">
              Area Deteksi Bahan
            </span>
          </div>

          <div className="text-[11px] text-right text-emerald-300 font-mono">
            {Math.round(selectedMaterial.confidence * 100)}% Akurasi Edge
          </div>
        </div>

        {/* Floating Labels (Hasil Pemindai AI) */}
        <div className="absolute bottom-6 left-4 right-4 z-20 transition-all">
          <div
            className={`p-4 rounded-2xl backdrop-blur-md border shadow-xl ${
              isMaterialValid
                ? 'bg-emerald-950/85 border-emerald-500/50 text-white'
                : selectedMaterial.category === 'spoiled'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : 'bg-stone-900/90 border-stone-600/50 text-stone-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  {isMaterialValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : selectedMaterial.category === 'spoiled' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <h3 className="font-bold text-sm tracking-wide">{selectedMaterial.name}</h3>
                </div>
                <p className="text-xs text-stone-300 mt-0.5 font-medium">
                  Kondisi: <span className="font-semibold text-white">{selectedMaterial.condition}</span>
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isMaterialValid
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
                }`}
              >
                {selectedMaterial.category === 'fresh_fruit'
                  ? 'Kulit Buah Segar'
                  : selectedMaterial.category === 'fresh_veg'
                  ? 'Sayur Segar'
                  : selectedMaterial.category === 'spoiled'
                  ? 'Tidak Segar'
                  : 'Bukan Organik'}
              </span>
            </div>

            {/* Saran AI */}
            <div className="text-xs bg-black/40 p-2.5 rounded-xl border border-white/10 mb-3">
              <span className="font-semibold text-emerald-300">Saran AI: </span>
              <span>{selectedMaterial.aiAdvice}</span>
            </div>

            {/* Tombol aksi: Mulai Fermentasi muncul jika valid */}
            {isMaterialValid ? (
              <button
                onClick={() => handleTriggerConfirmation(selectedMaterial)}
                className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Mulai Fermentasi dengan Bahan Ini</span>
              </button>
            ) : (
              <div className="text-xs text-center text-amber-300 py-1 font-medium bg-amber-900/30 rounded-lg border border-amber-600/30">
                Bahan tidak dapat difermentasi. Sisihkan ke wadah kompos ya!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Selector Bar (Quick Testing 4 Classes) */}
      <div className="bg-stone-900 border-t border-stone-800 p-3 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            Pilih Sampel Uji Bahan (PRD 4.1):
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_SCAN_PRESETS.map((item) => {
            const isSelected = selectedMaterial.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                <div className="truncate max-w-[140px]">{item.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL KONFIRMASI IN-APP (Bukan Browser Alert!) */}
      {confirmedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>

            <h3 className="font-extrabold text-base text-stone-900">
              Bahan Siap Difermentasi!
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              <strong>{confirmedMaterial.name}</strong> (~{confirmedMaterial.suggestedWeight || 150}g) telah divalidasi oleh AI EnzyMate.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 my-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>+30 Bintang Kedisiplinan Diperoleh!</span>
            </div>

            <p className="text-[11px] text-stone-500 mb-4">
              Pilih langkah selanjutnya yang ingin kamu lakukan:
            </p>

            {/* Tombol Terhubung: Menghitung takaran atau kembali ke beranda */}
            <div className="w-full space-y-2">
              <button
                onClick={handleGoToCalculator}
                className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center gap-2 text-xs shadow-md"
              >
                <Scale className="w-4 h-4 text-emerald-200" />
                <span>Hitung Takaran Air & Gula (Panduan 1:3:10)</span>
              </button>

              <button
                onClick={handleGoToHome}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Home className="w-4 h-4 text-stone-500" />
                <span>Simpan & Kembali ke Dashboard Toples</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
