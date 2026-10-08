import React, { useState } from 'react';
import { X, Scale, AlertCircle, Droplets, Apple, Cookie, Sparkles } from 'lucide-react';
import { calculateEcoEnzymeRecipe } from '../ruleEngine';
import { ScannedMaterial } from '../types';

interface CalculatorModalProps {
  initialMaterial?: ScannedMaterial | null;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  initialMaterial,
  onClose
}) => {
  const [containerSize, setContainerSize] = useState<number>(3); // default 3 liter
  const recipe = calculateEcoEnzymeRecipe(containerSize);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-100 flex flex-col text-stone-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">Kalkulator Formula 1 : 3 : 10</h3>
              <p className="text-[11px] text-stone-500">Panduan Takaran & Batas Aman Toples</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Jika terhubung dari hasil scan AI */}
        {initialMaterial && (
          <div className="mb-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300">
            <div className="text-[11px] text-emerald-900 leading-snug">
              Bahan dari Scan AI: <strong>{initialMaterial.name}</strong> (~{initialMaterial.suggestedWeight || 150}g).
            </div>
          </div>
        )}

        {/* Pilihan Ukuran Toples */}
        <div className="mb-3">
          <label className="text-xs font-bold text-stone-800 block mb-2">
            Pilih Ukuran Toples yang Tersedia di Rumah:
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {[1, 2, 3, 5].map((size) => (
              <button
                key={size}
                onClick={() => setContainerSize(size)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  containerSize === size
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {size} Liter
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
            <span className="text-[11px] text-stone-600 font-semibold">Kustom:</span>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={containerSize}
              onChange={(e) => setContainerSize(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-emerald-800 min-w-10 text-right">
              {containerSize} L
            </span>
          </div>
        </div>

        {/* Indikator visual 2/3 batas aman */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 mb-3">
          <div className="flex items-start gap-2 text-xs text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-[11px] text-amber-900">
                Aturan Keselamatan: Batas Maksimal 2/3 Toples!
              </p>
              <p className="text-[10px] text-amber-800 leading-snug mt-0.5">
                Total campuran air & bahan maksimal <strong>{recipe.maxSafeVolumeLiters} Liter</strong>. Sisakan 1/3 bagian kosong di atas untuk ruang desisan gas agar toples tidak meledak.
              </p>
            </div>
          </div>
        </div>

        {/* Rincian Takaran Bahan */}
        <div className="space-y-2 mb-4">
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Cookie className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">1 Bagian Gula Merah / Molase</div>
                <div className="text-[10px] text-stone-500">Makanan mikroba fermentasi</div>
              </div>
            </div>
            <div className="text-sm font-extrabold text-amber-700">{recipe.gulaGram} g</div>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Apple className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">3 Bagian Sisa Kulit Buah / Sayur</div>
                <div className="text-[10px] text-stone-500">Sisa segar tanpa minyak & mentah</div>
              </div>
            </div>
            <div className="text-sm font-extrabold text-emerald-700">{recipe.organikGram} g</div>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">10 Bagian Air Bersih</div>
                <div className="text-[10px] text-stone-500">Air sumur/galon (bebas kaporit)</div>
              </div>
            </div>
            <div className="text-sm font-extrabold text-sky-700">{recipe.airMl} ml</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center mt-auto"
        >
          Selesai & Paham Takaran
        </button>
      </div>
    </div>
  );
};
