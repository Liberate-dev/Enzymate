import React from 'react';
import { X, Plus, Check, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { JarData } from '../types';

interface JarListModalProps {
  jars: JarData[];
  activeJarId: string;
  onSelectJar: (jarId: string) => void;
  onOpenCreateJar: () => void;
  onDeleteJar: (jarId: string) => void;
  onClose: () => void;
}

export const JarListModal: React.FC<JarListModalProps> = ({
  jars,
  activeJarId,
  onSelectJar,
  onOpenCreateJar,
  onDeleteJar,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col text-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Koleksi Wadah
              </span>
              <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                Total: {jars.length} Toples
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 mt-1">
              Daftar Toples Fermentasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tombol Tambah Toples Baru yang Menonjol */}
        <button
          onClick={() => {
            onClose();
            onOpenCreateJar();
          }}
          className="w-full mb-3.5 enzymate-btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Toples Baru</span>
        </button>

        {/* Daftar Kartu Toples */}
        <div className="space-y-2.5 text-left mb-4">
          {jars.map((j) => {
            const isActive = j.id === activeJarId;
            const observationCount = j.observations.length;
            const latestObs = j.observations[0];
            const currentDay = latestObs ? latestObs.dayNumber : 1;
            const progressPercent = Math.min(100, Math.round((currentDay / (j.targetDays || 90)) * 100));

            return (
              <div
                key={j.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-stone-900">
                        {j.name}
                      </h4>
                      {isActive && (
                        <span className="text-[9px] font-extrabold bg-emerald-700 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>Aktif</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                      {j.ingredientsDescription || 'Bahan organik campuran'}
                    </p>
                  </div>

                  {/* Tombol Hapus jika toples > 1 */}
                  {jars.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Yakin ingin menghapus "${j.name}"?`)) {
                          onDeleteJar(j.id);
                        }
                      }}
                      className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus toples ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress Hari & Persentase Panen */}
                <div className="my-2">
                  <div className="flex justify-between items-center text-[10px] text-stone-600 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Hari ke-{currentDay} dari {j.targetDays || 90}
                    </span>
                    <span className="text-emerald-800 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Info Takaran & Riwayat */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-stone-200/60 text-[10px] text-stone-500 text-center">
                  <div className="bg-white/80 py-1 px-1 rounded border border-stone-100">
                    <span className="font-bold text-stone-700">{j.containerCapacityLiters}L</span> Kapasitas
                  </div>
                  <div className="bg-white/80 py-1 px-1 rounded border border-stone-100">
                    <span className="font-bold text-stone-700">{j.organicWeightGrams}g</span> Organik
                  </div>
                  <div className="bg-white/80 py-1 px-1 rounded border border-stone-100">
                    <span className="font-bold text-stone-700">{observationCount}x</span> Log
                  </div>
                </div>

                {/* Tombol Pilih jika bukan yang sedang aktif */}
                {!isActive && (
                  <button
                    onClick={() => {
                      onSelectJar(j.id);
                      onClose();
                    }}
                    className="w-full mt-2.5 py-1.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Jadikan Toples Aktif</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs text-center transition-colors mt-auto"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
