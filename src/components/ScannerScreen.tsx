import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  ChevronRight,
  ArrowRight
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
    }, 300);
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
          <h2 className="text-sm font-bold text-white tracking-wide">
            AI Camera Scanner
          </h2>
          <p className="text-[11px] text-stone-300">
            Pemrosesan lokal offline
          </p>
        </div>

        <button
          onClick={() => onOpenCalculator()}
          className="bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-700 transition-colors flex items-center gap-1"
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
            <div className="w-20 h-20 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mb-3 text-stone-400">
              <Camera className="w-8 h-8 text-stone-300" />
            </div>
            <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
              Kamera siap mendeteksi. Pilih sampel bahan di bawah untuk menguji klasifikasi lokal.
            </p>
          </div>
        )}

        {/* Viewfinder Target Bounding Box */}
        <div className="relative z-10 w-64 h-64 border border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3 pointer-events-none shadow-[0_0_20px_rgba(52,211,153,0.15)]">
          {/* Sudut-sudut bidik */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br" />

          {/* Garis Pemindai Animasi */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-black/60 text-emerald-300">
              Area Deteksi Bahan
            </span>
          </div>

          <div className="text-[11px] text-right text-emerald-300 font-mono">
            {Math.round(selectedMaterial.confidence * 100)}% Presisi
          </div>
        </div>

        {/* Floating Labels (Hasil Pemindai AI) */}
        <div className="absolute bottom-5 left-4 right-4 z-20">
          <div
            className={`p-4 rounded-xl backdrop-blur-md border shadow-lg ${
              isMaterialValid
                ? 'bg-stone-900/90 border-emerald-500/40 text-white'
                : selectedMaterial.category === 'spoiled'
                ? 'bg-stone-900/90 border-amber-500/40 text-stone-100'
                : 'bg-stone-900/90 border-stone-700 text-stone-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isMaterialValid
                        ? 'bg-emerald-400'
                        : selectedMaterial.category === 'spoiled'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <h3 className="font-bold text-sm tracking-wide">{selectedMaterial.name}</h3>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Kondisi: <span className="text-white font-medium">{selectedMaterial.condition}</span>
                </p>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isMaterialValid
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
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
            <div className="text-xs bg-black/50 p-2.5 rounded-lg border border-white/5 mb-3">
              <span className="font-semibold text-stone-300">Rekomendasi: </span>
              <span className="text-stone-200">{selectedMaterial.aiAdvice}</span>
            </div>

            {/* Tombol aksi: Mulai Fermentasi muncul jika valid */}
            {isMaterialValid ? (
              <button
                onClick={() => handleTriggerConfirmation(selectedMaterial)}
                className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center shadow-md"
              >
                Mulai Fermentasi dengan Bahan Ini
              </button>
            ) : (
              <div className="text-xs text-center text-amber-300 py-1.5 font-medium bg-amber-950/40 rounded-lg border border-amber-800/40">
                Bahan tidak memenuhi syarat untuk difermentasi.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="bg-stone-900 border-t border-stone-800 p-3 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            Sampel Uji Bahan:
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_SCAN_PRESETS.map((item) => {
            const isSelected = selectedMaterial.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-600 font-semibold shadow-xs'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                <div className="truncate max-w-[130px]">{item.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL KONFIRMASI IN-APP (BERSIH & PROFESIONAL) */}
      {confirmedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white text-stone-900 rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Bahan Terverifikasi
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                +30 Poin
              </span>
            </div>

            <h3 className="font-extrabold text-base text-stone-900 mt-1">
              {confirmedMaterial.name}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Estimasi berat: <strong>~{confirmedMaterial.suggestedWeight || 150} gram</strong>. Bahan memenuhi syarat untuk diolah ke dalam toples.
            </p>

            <div className="w-full space-y-2 mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={handleGoToCalculator}
                className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Hitung Takaran Air & Gula (Panduan 1:3:10)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleGoToHome}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs text-center transition-colors"
              >
                Simpan & Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
