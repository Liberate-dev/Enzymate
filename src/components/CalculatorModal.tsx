import React, { useState } from 'react';
import { X } from 'lucide-react';
import { calculateEcoEnzymeRecipe } from '../ruleEngine';
import { ScannedMaterial } from '../types';
import { useLanguage, UI_TEXT, localizeText } from '../i18n';

interface CalculatorModalProps {
  initialMaterial?: ScannedMaterial | null;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  initialMaterial,
  onClose
}) => {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang].calculatorModal;
  const [containerSize, setContainerSize] = useState<number>(3); // default 3 liter
  const recipe = calculateEcoEnzymeRecipe(containerSize, lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col text-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Header Bersih */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">
              {t.title}
            </h3>
            <p className="text-[11px] text-stone-500">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Jika terhubung dari hasil scan */}
        {initialMaterial && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-[11px] text-emerald-900 leading-snug">
              {t.scannedMaterialNote} <strong>{localizeText(initialMaterial.name, lang)}</strong> (~{initialMaterial.suggestedWeight || 150}g).
            </div>
          </div>
        )}

        {/* Pilihan Ukuran Toples */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-stone-800 block mb-2">
            {t.capacityLabel}
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {[1, 2, 3, 5].map((size) => (
              <button
                key={size}
                onClick={() => setContainerSize(size)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  containerSize === size
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {size} {t.literUnit}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium">{t.customLabel}</span>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={containerSize}
              onChange={(e) => setContainerSize(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-800 cursor-pointer"
            />
            <span className="text-xs font-bold text-emerald-800 min-w-10 text-right">
              {containerSize} L
            </span>
          </div>
        </div>

        {/* Indikator 2/3 batas aman */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <p className="font-bold text-[11px] text-amber-900">
            {t.safeLimitTitle}
          </p>
          <p className="text-[10px] text-amber-800 leading-snug mt-0.5">
            {t.safeLimitDesc(recipe.maxSafeVolumeLiters)}
          </p>
        </div>

        {/* Rincian Takaran Bahan (Format Rapi, Tipografis Bersih) */}
        <div className="space-y-1.5 mb-4">
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-800">{t.sugarTitle}</div>
              <div className="text-[10px] text-stone-500">{t.sugarDesc}</div>
            </div>
            <div className="text-sm font-bold text-stone-900">{recipe.gulaGram} g</div>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-800">{t.organicTitle}</div>
              <div className="text-[10px] text-stone-500">{t.organicDesc}</div>
            </div>
            <div className="text-sm font-bold text-emerald-800">{recipe.organikGram} g</div>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-800">{t.waterTitle}</div>
              <div className="text-[10px] text-stone-500">{t.waterDesc}</div>
            </div>
            <div className="text-sm font-bold text-stone-900">{recipe.airMl} ml</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center mt-auto"
        >
          {t.closeBtn}
        </button>
      </div>
    </div>
  );
};
