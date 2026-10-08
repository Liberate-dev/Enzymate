import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { FermentColor, FermentAroma, FermentSurface, FermentGas } from '../types';
import { MascotBot } from './MascotBot';

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
  const [viewMode, setViewMode] = useState<'landing' | 'form'>('landing');

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

  // ================= TAMPILAN 1: PENGANTAR OBSERVASI =================
  if (viewMode === 'landing') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-[#F8FAF8] overflow-y-auto pb-24">
        {/* Welcome Mascot & Briefing Title */}
        <div className="enzymate-card p-5 text-center mb-3.5 bg-white">
          <MascotBot mood="happy" size="md" className="mx-auto mb-2" />
          <span className="text-[10px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Jadwal Observasi Harian
          </span>
          <h2 className="text-base font-bold text-stone-900 mt-2">
            Pusat Pengamatan & Observasi
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
            Pantau kondisi <strong className="text-stone-800">{jarName}</strong> hari ini bersama AI Enzy.
          </p>
        </div>

        {/* 3 Langkah Praktis Observasi Sebelum Isi Form (BERSIH, TANPA ICON WARNA-WARNI) */}
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-bold text-stone-800 px-0.5">
            3 Langkah Pengamatan Bersama Pendamping:
          </h3>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-stone-100 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800">Dengarkan Desisan Gas</h4>
              <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                Buka tutup toples perlahan. Dengarkan apakah ada bunyi letupan desisan gas mikroba aktif.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-stone-100 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800">Cium Aromanya</h4>
              <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                Dekatkan hidung tanpa menyentuh cairan. Rasakan apakah beraroma asam segar, manis, atau busuk.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-stone-100 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800">Amati Warna & Jamur</h4>
              <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                Cek perubahan warna cairan dan pastikan tidak ada jamur berbulu hitam atau hijau.
              </p>
            </div>
          </div>
        </div>

        {/* Status Observasi Hari Ini & Tombol Aksi */}
        {hasObservedToday ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center mb-4">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-semibold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Observasi Hari ke-{dayNumber} Sudah Selesai</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed mb-3">
              Toples telah dicatat hari ini dan tertutup rapat agar bakteri bekerja optimal.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('form')}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
              >
                Lihat Catatan Form
              </button>
              <button
                onClick={onResetTodayStatus}
                className="py-2 px-3 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-800 font-semibold text-xs flex items-center gap-1 transition-colors"
                title="Reset mode demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            <button
              onClick={() => setViewMode('form')}
              className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center gap-1.5 text-xs shadow-sm"
            >
              <span>Mulai Isi Kartu Observasi Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-center text-stone-500 mt-2">
              Dibatasi 1x per hari demi menjaga kestabilan fermentasi wadah
            </p>
          </div>
        )}
      </div>
    );
  }

  // ================= TAMPILAN 2: FORMULIR INPUT OBSERVASI =================
  return (
    <div className="flex-1 flex flex-col p-4 bg-[#F8FAF8] overflow-y-auto pb-24">
      {/* Header dengan Tombol Kembali ke Landing */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Panduan</span>
          </button>
          <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold border border-stone-200">
            Hari ke-{dayNumber}
          </span>
        </div>

        <h2 className="text-base font-bold text-stone-900 mt-2">
          Formulir Pengamatan Visual
        </h2>
        <p className="text-xs text-stone-500">
          Pilih kondisi yang sesuai dengan hasil pemeriksaan toples hari ini.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Variabel 1: WARNA */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 block mb-2">
            1. Warna Cairan Fermentasi
          </label>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((c) => {
              const selected = selectedColor === c.value;
              return (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selected
                      ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700 font-semibold'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full mb-1.5 border ${c.bgClass}`} />
                  <div className="text-xs text-stone-800 leading-tight">{c.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{c.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variabel 2: AROMA */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 block mb-2">
            2. Aroma yang Tercium
          </label>
          <div className="grid grid-cols-2 gap-2">
            {aromaOptions.map((a) => {
              const selected = selectedAroma === a.value;
              return (
                <button
                  type="button"
                  key={a.value}
                  onClick={() => setSelectedAroma(a.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selected
                      ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700 font-semibold'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs text-stone-800">{a.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{a.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variabel 3: PERMUKAAN / JAMUR */}
        <div className="enzymate-card p-3.5">
          <label className="text-xs font-bold text-stone-800 block mb-2">
            3. Kondisi Permukaan Cairan
          </label>
          <div className="space-y-2">
            {surfaceOptions.map((s) => {
              const selected = selectedSurface === s.value;
              return (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setSelectedSurface(s.value)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-start justify-between transition-all ${
                    selected
                      ? s.danger
                        ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-600 font-semibold'
                        : 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700 font-semibold'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="text-xs text-stone-800">{s.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{s.desc}</div>
                  </div>
                  {s.danger && (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
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
          <label className="text-xs font-bold text-stone-800 block mb-2">
            4. Tekanan Gas Saat Tutup Dibuka
          </label>
          <div className="grid grid-cols-3 gap-2">
            {gasOptions.map((g) => {
              const selected = selectedGas === g.value;
              return (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => setSelectedGas(g.value)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selected
                      ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700 font-semibold'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs text-stone-800">{g.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{g.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Kirim Observasi */}
        <button
          type="submit"
          className="w-full enzymate-btn-primary py-3 px-4 flex items-center justify-center text-xs shadow-sm mt-1"
        >
          <span>Kirim Pengamatan ke AI Enzy</span>
        </button>
      </form>
    </div>
  );
};
