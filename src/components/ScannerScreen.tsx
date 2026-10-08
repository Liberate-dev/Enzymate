import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { SAMPLE_SCAN_PRESETS } from '../ruleEngine';
import { ScannedMaterial } from '../types';

interface ScannerScreenProps {
  onStartFermentation: (material: ScannedMaterial) => void;
  onOpenCalculator: () => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  onStartFermentation,
  onOpenCalculator
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ScannedMaterial>(SAMPLE_SCAN_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
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
    }, 400);
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
          onClick={onOpenCalculator}
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
            <div className="w-28 h-28 rounded-3xl bg-stone-800/80 border border-stone-700 flex items-center justify-center mb-3">
              <Sparkles className="w-12 h-12 text-emerald-400" />
            </div>
            <p className="text-xs text-stone-400 max-w-xs">
              Simulator Kamera AI: Pilih contoh bahan organik di bawah untuk menguji klasifikasi Edge AI seketika.
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
            {Math.round(selectedMaterial.confidence * 100)}% Presisi
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
                onClick={() => onStartFermentation(selectedMaterial)}
                className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm"
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
            Uji Sampel Bahan (4 Kelas PRD):
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
    </div>
  );
};
