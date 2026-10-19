import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Archive,
  Droplets,
  Scale,
  Trash2,
  Layers
} from 'lucide-react';
import { JarData } from '../types';
import { useLanguage, UI_TEXT, localizeJar } from '../i18n';

interface JarLandingScreenProps {
  jars: JarData[];
  onOpenJar: (jarId: string) => void;
  onOpenCreateJar: () => void;
  onDeleteJar: (jarId: string) => void;
}

export const JarLandingScreen: React.FC<JarLandingScreenProps> = ({
  jars,
  onOpenJar,
  onOpenCreateJar,
  onDeleteJar
}) => {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang].landing;
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');

  const localizedJars = jars.map((j) => localizeJar(j, lang));
  const activeJars = localizedJars.filter((j) => !j.isCompleted);
  const completedJars = localizedJars.filter((j) => j.isCompleted);

  const displayedJars =
    filterTab === 'active'
      ? activeJars
      : filterTab === 'completed'
      ? completedJars
      : localizedJars;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 text-stone-800">
      {/* 1. HERO BANNER: TAMBAH TOPLES BARU */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.25)_0,_transparent_70%)] pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600/60">
            {t.miniLabBadge}
          </span>
          <span className="text-xs font-bold text-amber-300 bg-emerald-950/70 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-400/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.newJarBonusBadge}</span>
          </span>
        </div>

        <h2 className="text-base font-extrabold tracking-tight text-white mb-1">
          {t.heroTitle}
        </h2>
        <p className="text-xs text-emerald-100/90 leading-relaxed mb-3.5 max-w-[280px]">
          {t.heroDesc}
        </p>

        <button
          onClick={onOpenCreateJar}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-emerald-800" />
          <span>{t.startNewJarBtn}</span>
        </button>
      </div>

      {/* 2. STATS RINGKAS & FILTER TAB */}
      <div className="flex items-center justify-between gap-1 border-b border-stone-200 pb-2">
        <div className="flex gap-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              filterTab === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.tabAll(jars.length)}
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              filterTab === 'active'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.tabActive(activeJars.length)}
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              filterTab === 'completed'
                ? 'bg-amber-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.tabCompleted(completedJars.length)}
          </button>
        </div>
      </div>

      {/* 3. DAFTAR TOPLES AKTIF */}
      {(filterTab === 'all' || filterTab === 'active') && activeJars.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.activeSectionTitle}</span>
            </h3>
            <span className="text-[10px] text-stone-400 font-medium">
              {t.target90Days}
            </span>
          </div>

          <div className="space-y-2.5">
            {activeJars.map((jar) => {
              const latestObs = jar.observations[0];
              const currentDay = latestObs ? latestObs.dayNumber : 1;
              const progressPercent = Math.min(
                100,
                Math.round((currentDay / (jar.targetDays || 90)) * 100)
              );
              const status = latestObs ? latestObs.status : 'normal';

              return (
                <div
                  key={jar.id}
                  onClick={() => onOpenJar(jar.id)}
                  className="enzymate-card p-4 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all active:scale-[0.99] relative group"
                >
                  {/* Top Bar Card */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {t.activeBadge}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            status === 'normal'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {status === 'normal' ? t.statusNormal : t.statusCheck}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900">
                        {jar.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {jar.ingredientsDescription}
                      </p>
                    </div>

                    {/* Tombol Hapus jika lebih dari 1 */}
                    {jars.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(t.confirmDeleteActive(jar.name))) {
                            onDeleteJar(jar.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 opacity-80 transition-all"
                        title={t.deleteTooltip}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar Hari Fermentasi */}
                  <div className="my-2.5">
                    <div className="flex justify-between items-center text-[10px] text-stone-600 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {t.dayOfTarget(currentDay, jar.targetDays || 90)}
                      </span>
                      <span className="text-emerald-800 font-bold">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/50">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrik Wadah & Tombol Buka */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-100">
                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-600" />
                        <strong>{jar.containerCapacityLiters}L</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-emerald-600" />
                        <strong>{jar.organicWeightGrams}g</strong>
                      </span>
                      <span className="text-stone-400">
                        {t.logsCount(jar.observations.length)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenJar(jar.id)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{t.openJarBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. DAFTAR RIWAYAT TOPLES PANEN / SELESAI */}
      {(filterTab === 'all' || filterTab === 'completed') && completedJars.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.completedSectionTitle}</span>
            </h3>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {t.naturalHarvestBadge}
            </span>
          </div>

          <div className="space-y-2.5">
            {completedJars.map((jar) => (
              <div
                key={jar.id}
                onClick={() => onOpenJar(jar.id)}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all active:scale-[0.99] relative group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-700" />
                        {t.harvestDoneBadge}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-stone-900">
                      {jar.name}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
                      {jar.ingredientsDescription}
                    </p>
                  </div>

                  {jars.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t.confirmDeleteHistory(jar.name))) {
                          onDeleteJar(jar.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={t.deleteHistoryTooltip}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Info Hasil Panen */}
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 mb-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                    <Droplets className="w-4 h-4 text-amber-600" />
                    <span>{t.harvestYieldLabel(jar.harvestYieldMl || 1800)}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {t.harvestDateLabel(jar.harvestDate || t.completedFallback)}
                  </span>
                </div>

                {/* Footer Card */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>{t.containerSummary(jar.containerCapacityLiters, jar.organicWeightGrams)}</span>
                  <button
                    type="button"
                    onClick={() => onOpenJar(jar.id)}
                    className="flex items-center gap-1 font-bold text-amber-900 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{t.viewHarvestDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jika Belum Ada Toples di Kategori Tertentu */}
      {displayedJars.length === 0 && (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <Archive className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-stone-700">{t.emptyTabTitle}</h4>
          <p className="text-[11px] text-stone-500 mt-1">
            {t.emptyTabDesc}
          </p>
        </div>
      )}
    </div>
  );
};
