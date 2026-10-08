import React, { useState } from 'react';
import {
  Palette,
  Wind,
  Search,
  Gauge,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
  RotateCcw
} from 'lucide-react';
import { FermentColor, FermentAroma, FermentSurface, FermentGas } from '../types';

interface ObservationScreenProps {
  jarName: string;
  dayNumber: number;
  hasObservedToday: boolean;
  onSubmitObservation: (data: {
    color: FermentColor;
    aroma: FermentAroma;
    surface: FermentSurface;
    gas: FermentGas;
  }) => void;
  onResetTodayStatus: () => void;
}

export const ObservationScreen: React.FC<ObservationScreenProps> = ({
  jarName,
  dayNumber,
  hasObservedToday,
  onSubmitObservation,
  onResetTodayStatus
}) => {
  const [selectedColor, setSelectedColor] = useState<FermentColor>('oranye_cokelat');
  const [selectedAroma, setSelectedAroma] = useState<FermentAroma>('asam_segar');
  const [selectedSurface, setSelectedSurface] = useState<FermentSurface>('putih_tipis');
  const [selectedGas, setSelectedGas] = useState<FermentGas>('sedikit');

  const colorOptions: { value: FermentColor; label: string; bgClass: string; desc: string }[] = [
    {
      value: 'bening_kuning',
      label: 'Bening Kuning',
      bgClass: 'bg-amber-200 border-amber-300',
      desc: 'Fase awal fermentasi'
    },
    {
      value: 'oranye_cokelat',
      label: 'Oranye Cokelat',
      bgClass: 'bg-amber-600/30 border-amber-500',
      desc: 'Warna ideal normal'
    },
    {
      value: 'cokelat_tua',
      label: 'Cokelat Gelap',
      bgClass: 'bg-stone-700/30 border-stone-600',
      desc: 'Fase matang molase'
    }
  ];

  const aromaOptions: { value: FermentAroma; label: string; desc: string }[] = [
    { value: 'asam_segar', label: 'Asam Segar', desc: 'Wangi khas eco-enzyme' },
    { value: 'manis', label: 'Manis Gula', desc: 'Gula belum terurai penuh' },
    { value: 'alkohol', label: 'Alkohol', desc: 'Aroma tajam fermentasi' },
    { value: 'busuk', label: 'Bau Busuk', desc: 'Perhatian! Perlu bantuan' }
  ];

  const surfaceOptions: { value: FermentSurface; label: string; desc: string; danger?: boolean }[] = [
    { value: 'bersih', label: 'Permukaan Bersih', desc: 'Cairan bening alami' },
    { value: 'putih_tipis', label: 'Lapisan Putih Tipis', desc: 'Ragi pitera (Bagus!)' },
    { value: 'jamur_berbulu', label: 'Jamur Berbulu Warna', desc: 'Jamur hijau/hitam/merah', danger: true }
  ];

  const gasOptions: { value: FermentGas; label: string; desc: string }[] = [
    { value: 'banyak', label: 'Banyak Gas', desc: 'Desisan kuat saat dibuka' },
    { value: 'sedikit', label: 'Gas Sedikit', desc: 'Sedikit bunyi letupan' },
    { value: 'tidak_ada', label: 'Tidak Ada Gas', desc: 'Tenang tanpa desisan' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitObservation({
      color: selectedColor,
      aroma: selectedAroma,
      surface: selectedSurface,
      gas: selectedGas
    });
  };

  // Jika sudah observasi hari ini, kunci form sesuai aturan PRD (1x per hari)
  if (hasObservedToday) {
    return (
      <div className="flex-1 flex flex-col p-5 bg-[#F8FAF8] justify-center items-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold text-stone-800">Misi Observasi Hari Ini Selesai!</h2>
        <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
          Hebat! Data kondisi toples untuk <strong>Hari ke-{dayNumber}</strong> sudah tercatat.
        </p>

        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left max-w-xs text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Aturan Penting Toples</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Untuk menjaga agar bakteri baik bekerja maksimal, toples tidak boleh dibuka berkali-kali dalam sehari. Jadwal berikutnya dibuka besok ya!
          </p>
        </div>

        {/* Tombol Demo Reset untuk keperluan review pengujian */}
        <button
          onClick={onResetTodayStatus}
          className="mt-6 flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 bg-stone-200/60 px-3 py-1.5 rounded-full transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Uji Coba Observasi Lagi (Mode Demo)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#F8FAF8] overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
              <span>Kartu Observasi Harian</span>
            </h2>
            <p className="text-xs text-stone-500">
              {jarName} • <span className="font-semibold text-emerald-700">Hari ke-{dayNumber}</span>
            </p>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-300">
            Misi 1x Sehari
          </span>
        </div>

        {/* Progress Bar Misi Hari Ini */}
        <div className="mt-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Misi Harian: Periksa & Lepas Gas
            </span>
            <span className="text-emerald-600 font-bold text-[11px]">Siap Diisi</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Variabel 1: WARNA */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>1. Warna Cairan Fermentasi</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((c) => {
              const selected = selectedColor === c.value;
              return (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mb-1.5 border ${c.bgClass}`} />
                  <div className="text-xs font-bold text-stone-800 leading-tight">{c.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{c.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variabel 2: AROMA */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>2. Aroma yang Tercium</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {aromaOptions.map((a) => {
              const selected = selectedAroma === a.value;
              return (
                <button
                  type="button"
                  key={a.value}
                  onClick={() => setSelectedAroma(a.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-800">{a.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{a.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variabel 3: PERMUKAAN / JAMUR */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>3. Kondisi Permukaan Cairan</span>
          </label>
          <div className="space-y-2">
            {surfaceOptions.map((s) => {
              const selected = selectedSurface === s.value;
              return (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setSelectedSurface(s.value)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                    selected
                      ? s.danger
                        ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-400/20'
                        : 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-stone-800">{s.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{s.desc}</div>
                  </div>
                  {s.danger && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                      Perlu Dicek
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variabel 4: GAS */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
            <Gauge className="w-4 h-4 text-emerald-600" />
            <span>4. Tekanan Gas Saat Tutup Dibuka</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {gasOptions.map((g) => {
              const selected = selectedGas === g.value;
              return (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => setSelectedGas(g.value)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-800">{g.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{g.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Kirim Observasi */}
        <button
          type="submit"
          className="w-full enzymate-btn-primary py-3.5 px-4 flex items-center justify-center gap-2 text-sm shadow-md mt-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Kirim Pengamatan ke AI Enzy</span>
        </button>
      </form>
    </div>
  );
};
