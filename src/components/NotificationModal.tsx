import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Clock,
  CheckCircle2,
  Volume2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Trash2,
  BookOpen,
  ShieldAlert,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JarData, JarReminder, ProcedureType } from '../types';
import { useLanguage, UI_TEXT } from '../i18n';
import {
  formatTimeRemaining,
  requestWebNotificationPermission,
  triggerBrowserNotification,
  playNotificationChime,
  calculateNextTrigger,
  getProcedureGuide,
  getProcedureForJar
} from '../reminderEngine';

interface NotificationModalProps {
  jars: JarData[];
  onClose: () => void;
  onSelectJarForObservation: (jarId: string) => void;
  onUpdateJarReminders: (jarId: string, updatedReminders: JarReminder[]) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  jars,
  onClose,
  onSelectJarForObservation,
  onUpdateJarReminders
}) => {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang].notificationsModal;

  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [testSent, setTestSent] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Record<number, boolean>>>({});
  const [expandedSopMap, setExpandedSopMap] = useState<Record<string, boolean>>({});
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestWebNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      triggerBrowserNotification(
        lang === 'en' ? 'Enzymo Notifications Active!' : 'Notifikasi Enzymo Aktif!',
        {
          body:
            lang === 'en'
              ? 'Great! You will now receive reminders for jar procedures.'
              : 'Hebat! Kamu akan menerima pengingat prosedur toples tepat waktu.'
        }
      );
    }
  };

  const handleTriggerSpecificDemo = (phaseType: ProcedureType) => {
    const guide = getProcedureGuide(phaseType, lang);
    playNotificationChime();
    setTestSent(true);
    triggerBrowserNotification(
      `🔔 ${guide.title}`,
      {
        body: guide.instructions[0] || guide.description
      }
    );
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleToggleStep = (remId: string, stepIdx: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [remId]: {
        ...(prev[remId] || {}),
        [stepIdx]: !prev[remId]?.[stepIdx]
      }
    }));
  };

  const handleToggleExpandSop = (remId: string) => {
    setExpandedSopMap((prev) => ({
      ...prev,
      [remId]: !prev[remId]
    }));
  };

  const handleCompleteProcedure = (jarId: string, reminderId: string) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || !jar.reminders) return;

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    const updated = jar.reminders.map((r) => {
      if (r.id !== reminderId) return r;
      const nextDate = calculateNextTrigger(r.value, r.unit);
      return {
        ...r,
        lastTriggeredAt: new Date().toISOString(),
        nextTriggerAt: nextDate.toISOString()
      };
    });

    onUpdateJarReminders(jarId, updated);

    // Reset checklist untuk reminder ini
    setCheckedSteps((prev) => {
      const copy = { ...prev };
      delete copy[reminderId];
      return copy;
    });

    setCompletionNotice(
      lang === 'en'
        ? 'Procedure successfully executed! Rescheduled for next cycle.'
        : 'Prosedur berhasil dijalankan! Jadwal siklus berikutnya telah diatur.'
    );
    setTimeout(() => setCompletionNotice(null), 3500);
  };

  const handleSnooze = (jarId: string, reminderId: string, minutes: number = 10) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || !jar.reminders) return;

    const updated = jar.reminders.map((r) => {
      if (r.id !== reminderId) return r;
      const nextDate = calculateNextTrigger(minutes, 'minutes');
      return {
        ...r,
        nextTriggerAt: nextDate.toISOString()
      };
    });

    onUpdateJarReminders(jarId, updated);
  };

  const handleToggleReminder = (jarId: string, reminderId: string) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || !jar.reminders) return;

    const updated = jar.reminders.map((r) => {
      if (r.id !== reminderId) return r;
      return {
        ...r,
        enabled: !r.enabled
      };
    });

    onUpdateJarReminders(jarId, updated);
  };

  const handleDeleteReminder = (jarId: string, reminderId: string) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || !jar.reminders) return;

    const updated = jar.reminders.filter((r) => r.id !== reminderId);
    onUpdateJarReminders(jarId, updated);
  };

  // Kumpulkan semua alarm dari toples aktif
  const activeJars = jars.filter((j) => !j.isCompleted);
  const totalRemindersCount = activeJars.reduce(
    (acc, j) => acc + (j.reminders ? j.reminders.length : 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-stone-100 flex flex-col text-stone-800 max-h-[90vh] overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-stone-900">{t.title}</h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {totalRemindersCount} {t.activeBadge}
                </span>
              </div>
              <p className="text-[10px] text-stone-500">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Success Notice */}
        {completionNotice && (
          <div className="m-2 p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{completionNotice}</span>
          </div>
        )}

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-left">
          {/* Permission & Test Notification Banner */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.permissionBannerTitle}</span>
              </div>
              {notificationPermission === 'granted' ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{t.permissionGranted}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                >
                  {t.allowPermissionBtn}
                </button>
              )}
            </div>

            <p className="text-[10px] text-stone-500 leading-relaxed">
              {t.permissionBannerDesc}
            </p>

            {/* Simulator Demo Notifikasi Nyata 4 Fase */}
            <div className="space-y-1.5 pt-1 border-t border-stone-200/60">
              <span className="text-[10px] font-extrabold text-stone-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>
                  {lang === 'en'
                    ? 'Simulate Real Notifications by Stage:'
                    : 'Uji Coba Bunyi & Notifikasi Nyata per Fase:'}
                </span>
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTriggerSpecificDemo('degas')}
                  className="p-1.5 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-[10px] font-bold text-stone-700 hover:text-amber-950 text-left transition-all shadow-2xs"
                >
                  <div className="font-extrabold text-amber-800">💨 Bulan 1</div>
                  <div className="text-[9px] text-stone-500 truncate">Rilis Gas (Degas)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSpecificDemo('submerge_stir')}
                  className="p-1.5 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-[10px] font-bold text-stone-700 hover:text-amber-950 text-left transition-all shadow-2xs"
                >
                  <div className="font-extrabold text-emerald-800">🥄 Minggu 1-2</div>
                  <div className="text-[9px] text-stone-500 truncate">Aduk & Rendam Kulit</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSpecificDemo('check_mold')}
                  className="p-1.5 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-[10px] font-bold text-stone-700 hover:text-amber-950 text-left transition-all shadow-2xs"
                >
                  <div className="font-extrabold text-sky-800">🔍 Bulan 2</div>
                  <div className="text-[9px] text-stone-500 truncate">Cek Jamur Pitera</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSpecificDemo('harvest_prep')}
                  className="p-1.5 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-[10px] font-bold text-stone-700 hover:text-amber-950 text-left transition-all shadow-2xs"
                >
                  <div className="font-extrabold text-rose-800">🎉 Hari ke-90</div>
                  <div className="text-[9px] text-stone-500 truncate">Panen & Penyaringan</div>
                </button>
              </div>
            </div>
          </div>

          {/* List of Jars with Procedural Alarms */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.activeAlarmsTitle}</span>
            </h4>

            {activeJars.length === 0 || totalRemindersCount === 0 ? (
              <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-medium text-stone-600">{t.noAlarmsText}</p>
              </div>
            ) : (
              activeJars.map((jar) => {
                const jarReminders = jar.reminders || [];
                if (jarReminders.length === 0) return null;

                return (
                  <div
                    key={jar.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2.5"
                  >
                    {/* Header Jar */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                      <div>
                        <div className="text-xs font-black text-stone-900">{jar.name}</div>
                        <div className="text-[10px] text-stone-400">
                          {jar.containerCapacityLiters}L • {jar.ingredientsDescription.slice(0, 35)}...
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectJarForObservation(jar.id);
                        }}
                        className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{t.observeBtn}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Alarms inside this Jar */}
                    <div className="space-y-2.5">
                      {jarReminders.map((rem) => {
                        const remaining = formatTimeRemaining(rem.nextTriggerAt, lang);
                        const currentGuide = rem.procedureType && rem.procedureType !== 'custom'
                          ? getProcedureGuide(rem.procedureType, lang)
                          : getProcedureForJar(jar, lang);
                        const instructions = rem.instructions && rem.instructions.length > 0
                          ? rem.instructions
                          : currentGuide.instructions;
                        const safetyWarning = rem.safetyWarning || currentGuide.safetyWarning;
                        const isExpanded = expandedSopMap[rem.id] ?? remaining.isDue; // Auto-expand jika due

                        const unitLabel =
                          rem.unit === 'minutes'
                            ? (lang === 'en' ? 'Mins' : 'Menit')
                            : rem.unit === 'hours'
                            ? (lang === 'en' ? 'Hours' : 'Jam')
                            : (lang === 'en' ? 'Days' : 'Hari');

                        return (
                          <div
                            key={rem.id}
                            className={`p-3 rounded-xl border transition-all ${
                              remaining.isDue
                                ? 'bg-amber-50/95 border-amber-300 shadow-sm'
                                : rem.enabled
                                ? 'bg-stone-50 border-stone-200'
                                : 'bg-stone-100/60 border-stone-200 opacity-60'
                            }`}
                          >
                            {/* Baris Judul & Toggle */}
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                                  {currentGuide.badge}
                                </span>
                                <span className="text-xs font-black text-stone-900 truncate">
                                  {rem.label}
                                </span>
                              </div>

                              {/* Toggle & Delete */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleReminder(jar.id, rem.id)}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                                    rem.enabled
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-stone-200 text-stone-500 border-stone-300'
                                  }`}
                                >
                                  {rem.enabled ? 'ON' : 'OFF'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReminder(jar.id, rem.id)}
                                  className="w-5 h-5 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Bar Status Waktu & Interval */}
                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100/80">
                              <div className="text-[10px] text-stone-500">
                                <span>Interval: </span>
                                <strong className="text-stone-700">
                                  {rem.value} {unitLabel}
                                </strong>
                              </div>

                              {/* Status Tag */}
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                    remaining.isDue
                                      ? 'bg-amber-600 text-white animate-pulse'
                                      : 'bg-stone-200 text-stone-700'
                                  }`}
                                >
                                  {remaining.text}
                                </span>

                                {remaining.isDue && (
                                  <button
                                    type="button"
                                    onClick={() => handleSnooze(jar.id, rem.id, 10)}
                                    className="text-[9px] font-bold text-stone-600 bg-white hover:bg-stone-100 border border-stone-300 px-1.5 py-0.5 rounded transition-colors"
                                  >
                                    {t.snoozeBtn}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* PANDUAN LANGKAH KERJA / SOP PROSEDUR INTERAKTIF */}
                            <div className="mt-2.5 pt-2 border-t border-amber-200/60">
                              <button
                                type="button"
                                onClick={() => handleToggleExpandSop(rem.id)}
                                className="w-full flex items-center justify-between text-[10px] font-extrabold text-amber-900 bg-amber-100/50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors"
                              >
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                                  <span>
                                    {lang === 'en'
                                      ? `Action SOP: How to execute this procedure (${instructions.length} steps)`
                                      : `SOP Tindakan: Cara melakukan prosedur ini (${instructions.length} langkah)`}
                                  </span>
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-amber-700" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="mt-2 space-y-2 bg-white/90 p-2.5 rounded-lg border border-amber-200/80 text-[10px]">
                                  <div className="text-stone-600 italic">
                                    {currentGuide.description}
                                  </div>

                                  {/* Checklist Langkah Kerja */}
                                  <div className="space-y-1.5">
                                    <span className="font-extrabold text-stone-700 block text-[9px] uppercase tracking-wide">
                                      {lang === 'en'
                                        ? 'Checklist to execute:'
                                        : 'Centang jika sudah dilakukan:'}
                                    </span>
                                    {instructions.map((step, idx) => {
                                      const isDone = checkedSteps[rem.id]?.[idx] || false;
                                      return (
                                        <div
                                          key={idx}
                                          onClick={() => handleToggleStep(rem.id, idx)}
                                          className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors border ${
                                            isDone
                                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                                              : 'bg-stone-50 border-stone-100 text-stone-700 hover:bg-amber-50'
                                          }`}
                                        >
                                          {isDone ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                          ) : (
                                            <Square className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                          )}
                                          <span className="leading-snug">
                                            <strong>{idx + 1}.</strong> {step}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Safety Alert */}
                                  {safetyWarning && (
                                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[10px] flex items-start gap-1.5">
                                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                      <div className="leading-snug font-medium">
                                        <strong className="text-rose-950">
                                          {lang === 'en' ? 'Safety Precaution: ' : 'Peringatan Keselamatan: '}
                                        </strong>
                                        {safetyWarning}
                                      </div>
                                    </div>
                                  )}

                                  {/* Tombol Eksekusi Selesai */}
                                  <div className="pt-1.5 flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCompleteProcedure(jar.id, rem.id)}
                                      className="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-extrabold text-[10px] flex items-center justify-center gap-1 shadow-2xs transition-colors"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>
                                        {lang === 'en'
                                          ? 'Mark Procedure Done (Reschedule)'
                                          : 'Selesaikan Prosedur (Reset Jadwal)'}
                                      </span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        onClose();
                                        onSelectJarForObservation(jar.id);
                                      }}
                                      className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-[10px] transition-colors"
                                    >
                                      {lang === 'en' ? 'Log in Observation' : 'Catat di Observasi'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
