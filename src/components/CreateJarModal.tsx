import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateEcoEnzymeRecipe } from '../ruleEngine';
import { JarData } from '../types';
import { useLanguage, UI_TEXT, localizeText } from '../i18n';

interface CreateJarModalProps {
  onClose: () => void;
  onCreateJar: (newJar: JarData) => void;
}

export const CreateJarModal: React.FC<CreateJarModalProps> = ({
  onClose,
  onCreateJar
}) => {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang].createJarModal;

  const [name, setName] = useState<string>(t.defaultName);
  const [containerCapacity, setContainerCapacity] = useState<number>(3);
  const [ingredients, setIngredients] = useState<string>(t.defaultIngredients);
  const [startDate, setStartDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    setName((prev) => localizeText(prev, lang));
    setIngredients((prev) => localizeText(prev, lang));
  }, [lang]);

  const recipe = calculateEcoEnzymeRecipe(containerCapacity, lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newJar: JarData = {
      id: `jar-${Date.now()}`,
      name: name.trim(),
      startDate: startDate || new Date().toISOString().split('T')[0],
      targetDays: 90,
      containerCapacityLiters: containerCapacity,
      organicWeightGrams: recipe.organikGram,
      sugarWeightGrams: recipe.gulaGram,
      waterVolumeMl: recipe.airMl,
      ingredientsDescription:
        ingredients.trim() ||
        (lang === 'en'
          ? 'Fresh raw fruit and vegetable scraps'
          : 'Sisa buah dan sayur segar mentah'),
      observations: []
    };

    onCreateJar(newJar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col text-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t.newJarBadge}
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {t.pointsBadge}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 mt-1">
              {t.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {/* 1. Nama Toples */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            />

            {/* Quick Name Chips */}
            <div className="flex gap-1.5 overflow-x-auto mt-1.5 pb-1 scrollbar-none">
              {t.presetNames.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setName(preset)}
                  className="shrink-0 text-[10px] bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kapasitas Wadah */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              {t.capacityLabel}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 5].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setContainerCapacity(size)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    containerCapacity === size
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {size} {t.literUnit}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Live Takaran Formula 1:3:10 Box */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                {t.goldenFormulaTitle}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                {t.safeLimitBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <div className="text-[10px] text-stone-500 font-semibold">{t.part1Sugar}</div>
                <div className="text-xs font-extrabold text-amber-800 mt-0.5">{recipe.gulaGram} g</div>
                <div className="text-[9px] text-stone-400">{t.molassesPalm}</div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <div className="text-[10px] text-stone-500 font-semibold">{t.part3Organic}</div>
                <div className="text-xs font-extrabold text-emerald-800 mt-0.5">{recipe.organikGram} g</div>
                <div className="text-[9px] text-stone-400">{t.fruitVegPeels}</div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <div className="text-[10px] text-stone-500 font-semibold">{t.part10Water}</div>
                <div className="text-xs font-extrabold text-sky-800 mt-0.5">{recipe.airMl} ml</div>
                <div className="text-[9px] text-stone-400">{t.cleanWellWater}</div>
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-emerald-900 bg-emerald-100/60 p-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                {t.safeTotalNotePrefix} <strong>{recipe.maxSafeVolumeLiters} {t.literUnit}</strong> {t.safeTotalNoteSuffix}
              </span>
            </div>
          </div>

          {/* 4. Deskripsi Bahan Awal */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {t.ingredientsLabel}
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={t.ingredientsPlaceholder}
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            />
          </div>

          {/* 5. Tanggal Mulai */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {t.startDateLabel}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full enzymate-btn-primary py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.submitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
