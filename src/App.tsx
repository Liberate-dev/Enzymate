import React, { useState, useEffect } from 'react';
import {
  Flame,
  Star,
  Camera,
  ClipboardList,
  Home,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Layers,
  Plus,
  Globe,
  Bell
} from 'lucide-react';
import { JarIllustration } from './components/JarIllustration';
import { ScannerScreen } from './components/ScannerScreen';
import { ObservationScreen } from './components/ObservationScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { CalculatorModal } from './components/CalculatorModal';
import { BadgesModal } from './components/BadgesModal';
import { AppTourGuide } from './components/AppTourGuide';
import { JarListModal } from './components/JarListModal';
import { CreateJarModal } from './components/CreateJarModal';
import { JarLandingScreen } from './components/JarLandingScreen';
import { NotificationModal } from './components/NotificationModal';
import {
  JarData,
  UserProgress,
  ScannedMaterial,
  FermentColor,
  FermentAroma,
  FermentSurface,
  FermentGas,
  JarReminder
} from './types';
import { evaluateObservation, EvaluationResult } from './ruleEngine';
import { useLanguage, UI_TEXT, localizeJar, localizeText } from './i18n';
import {
  checkDueReminders,
  triggerBrowserNotification,
  calculateNextTrigger,
  createDefaultReminder,
  getProcedureForJar
} from './reminderEngine';

const INITIAL_JARS: JarData[] = [
  {
    id: 'jar-1',
    name: 'Toples Jeruk & Pepaya Ceria',
    startDate: '2026-09-24',
    targetDays: 90,
    containerCapacityLiters: 3,
    organicWeightGrams: 450,
    sugarWeightGrams: 150,
    waterVolumeMl: 1500,
    ingredientsDescription: 'Kulit Jeruk Manis, Kulit Pepaya Muda, Batang Sawi',
    reminders: [
      {
        id: 'rem-init-1',
        procedureType: 'degas',
        label: 'Pelepasan Gas (Degassing / Buka Tutup Sedikit)',
        value: 2,
        unit: 'days',
        enabled: true,
        createdAt: '2026-09-24T08:00:00.000Z',
        nextTriggerAt: new Date(Date.now() + 1000 * 60 * 25).toISOString(), // 25 menit lagi
        isRecurring: true,
        instructions: [
          'Posisikan toples di atas meja datar, jauhkan wajah dari arah mulut tutup.',
          'Putar tutup toples perlahan 1/4 - 1/2 putaran hingga terdengar desisan gas ("ssshh").',
          'Tahan sebentar hingga desisan gas berhenti sempurna.',
          'JANGAN buka tutup seluruhnya agar oksigen luar tidak masuk dan merusak bakteri anaerob.',
          'Kencangkan kembali tutup toples hingga benar-benar kedap udara.'
        ],
        safetyWarning: 'Waspada desisan gas bertekanan! Jangan mengguncang toples sebelum membuka tutup.'
      }
    ],
    observations: [
      {
        id: 'obs-1',
        dayNumber: 7,
        date: '2026-10-01',
        color: 'bening_kuning',
        aroma: 'manis',
        surface: 'putih_tipis',
        gas: 'banyak',
        status: 'normal',
        aiFeedback: 'Ragi awal bekerja baik!',
        requiresAdult: false,
        earnedPoints: 50
      },
      {
        id: 'obs-2',
        dayNumber: 14,
        date: '2026-10-07',
        color: 'oranye_cokelat',
        aroma: 'asam_segar',
        surface: 'putih_tipis',
        gas: 'sedikit',
        status: 'normal',
        aiFeedback: 'Wangi asam segar terdeteksi.',
        requiresAdult: false,
        earnedPoints: 50
      }
    ]
  },
  {
    id: 'jar-2',
    name: 'Toples Sayur Sawi & Kangkung 5A',
    startDate: '2026-10-06',
    targetDays: 90,
    containerCapacityLiters: 2,
    organicWeightGrams: 300,
    sugarWeightGrams: 100,
    waterVolumeMl: 1000,
    ingredientsDescription: 'Sisa Batang Sawi Hijau, Batang Kangkung, Kulit Mentimun',
    reminders: [
      {
        id: 'rem-init-2',
        procedureType: 'check_mold',
        label: 'Periksa Lapisan Jamur Pitera (Ragi Baik)',
        value: 7,
        unit: 'days',
        enabled: true,
        createdAt: '2026-10-06T08:00:00.000Z',
        nextTriggerAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Besok
        isRecurring: true,
        instructions: [
          'Nyalakan lampu senter HP dan sorot permukaan cairan DARI LUAR toples (JANGAN buka tutup).',
          'Periksa apakah ada lapisan putih tipis lembut (itu adalah jamur Pitera / ragi baik, tanda fermentasi sehat).',
          'Pastikan TIDAK ADA bintik berbulu hitam, hijau, atau lendir berbau busuk bangkai.',
          'Jika permukaan bersih atau putih tipis, toples dalam kondisi prima dan biarkan tenang.'
        ],
        safetyWarning: 'Hindari membuka toples hanya untuk melihat-lihat, agar udara luar tidak mengkontaminasi.'
      }
    ],
    observations: [
      {
        id: 'obs-2-1',
        dayNumber: 3,
        date: '2026-10-09',
        color: 'bening_kuning',
        aroma: 'manis',
        surface: 'bersih',
        gas: 'sedikit',
        status: 'normal',
        aiFeedback: 'Bakteri mulai aktif membentuk gelembung halus.',
        requiresAdult: false,
        earnedPoints: 50
      }
    ]
  },
  {
    id: 'jar-hist-1',
    name: 'Toples Sitrus Angkatan 2025',
    startDate: '2026-05-10',
    targetDays: 90,
    containerCapacityLiters: 3,
    organicWeightGrams: 450,
    sugarWeightGrams: 150,
    waterVolumeMl: 1500,
    ingredientsDescription: 'Kulit Jeruk Nipis, Kulit Lemon, Kulit Jeruk Bali',
    isCompleted: true,
    harvestDate: '2026-08-10',
    harvestYieldMl: 1800,
    observations: [
      {
        id: 'obs-h-1',
        dayNumber: 90,
        date: '2026-08-10',
        color: 'cokelat_tua',
        aroma: 'asam_segar',
        surface: 'putih_tipis',
        gas: 'tidak_ada',
        status: 'normal',
        aiFeedback: 'Panen sukses sempurna! Cairan beraroma sitrus segar khas eco-enzyme matang.',
        requiresAdult: false,
        earnedPoints: 100
      }
    ]
  }
];

const INITIAL_JAR = INITIAL_JARS[0];

const INITIAL_USER: UserProgress = {
  studentName: 'Rian (Siswa SDN 01)',
  streakDays: 4,
  totalPoints: 180,
  organicSavedGrams: 850,
  badges: [
    {
      id: 'badge-1',
      name: 'Detektif Dini',
      description: 'Berhasil memindai 3 bahan organik dengan kamera',
      iconName: 'Search',
      unlocked: true,
      unlockedAt: '2026-09-25'
    },
    {
      id: 'badge-2',
      name: 'Rentetan Disiplin',
      description: 'Mengisi kartu observasi 3 hari berturut-turut tanpa jeda',
      iconName: 'Flame',
      unlocked: true,
      unlockedAt: '2026-10-06'
    },
    {
      id: 'badge-3',
      name: 'Ahli Eco-Enzyme',
      description: 'Menjaga toples sehat hingga usia 30 hari pertama',
      iconName: 'Award',
      unlocked: false
    },
    {
      id: 'badge-4',
      name: 'Pahlawan Pangan',
      description: 'Menyelamatkan lebih dari 1 kg sisa kulit buah',
      iconName: 'Leaf',
      unlocked: false
    }
  ]
};

export const App: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const t = UI_TEXT[lang];

  const [activeTab, setActiveTab] = useState<'home' | 'scanner' | 'observation'>('home');
  const [jars, setJars] = useState<JarData[]>(() => {
    const savedJars = localStorage.getItem('enzymate_jars');
    if (savedJars) {
      try {
        const parsed = JSON.parse(savedJars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((j) => ({
            ...j,
            reminders:
              j.reminders && j.reminders.length > 0
                ? j.reminders
                : [createDefaultReminder('Rilis Gas & Observasi', 2, 'days')]
          }));
        }
      } catch (e) {}
    }
    const savedSingle = localStorage.getItem('enzymate_jar');
    if (savedSingle) {
      try {
        const parsed = JSON.parse(savedSingle);
        if (parsed && parsed.id) return [parsed];
      } catch (e) {}
    }
    return INITIAL_JARS;
  });

  const [activeJarId, setActiveJarId] = useState<string>(() => {
    const savedId = localStorage.getItem('enzymate_active_jar_id');
    return savedId || INITIAL_JAR.id;
  });

  const [showJarList, setShowJarList] = useState<boolean>(false);
  const [showCreateJar, setShowCreateJar] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [lastNotifiedMap, setLastNotifiedMap] = useState<Record<string, number>>({});
  const [homeViewMode, setHomeViewMode] = useState<'list' | 'detail'>('list');

  const rawActiveJar = jars.find((j) => j.id === activeJarId) || jars[0] || INITIAL_JAR;
  const activeJar = localizeJar(rawActiveJar, lang);
  const jar = activeJar;

  const [user, setUser] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('enzymate_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [hasObservedToday, setHasObservedToday] = useState<boolean>(() => {
    return localStorage.getItem('enzymate_observed_today') === 'true';
  });

  const [currentDay, setCurrentDay] = useState<number>(() => {
    if (rawActiveJar && rawActiveJar.observations.length > 0) {
      return rawActiveJar.observations[0].dayNumber;
    }
    return 14;
  });

  const [feedbackInput, setFeedbackInput] = useState<{
    dayNumber: number;
    color: FermentColor;
    aroma: FermentAroma;
    surface: FermentSurface;
    gas: FermentGas;
  } | null>(null);

  const feedbackResult: EvaluationResult | null = feedbackInput
    ? evaluateObservation(
        feedbackInput.dayNumber,
        feedbackInput.color,
        feedbackInput.aroma,
        feedbackInput.surface,
        feedbackInput.gas,
        lang
      )
    : null;
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calculatorMaterial, setCalculatorMaterial] = useState<ScannedMaterial | null>(null);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  // Tour Guide State
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [showTourPrompt, setShowTourPrompt] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('enzymate_jars', JSON.stringify(jars));
    localStorage.setItem('enzymate_jar', JSON.stringify(rawActiveJar));
  }, [jars, rawActiveJar]);

  useEffect(() => {
    localStorage.setItem('enzymate_active_jar_id', activeJarId);
  }, [activeJarId]);

  useEffect(() => {
    localStorage.setItem('enzymate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('enzymate_observed_today', hasObservedToday ? 'true' : 'false');
  }, [hasObservedToday]);

  // Cek apakah baru pertama kali dibuka untuk menampilkan penawaran tur
  useEffect(() => {
    const tourPrompted = localStorage.getItem('enzymate_tour_prompted');
    if (!tourPrompted) {
      setShowTourPrompt(true);
    }
  }, []);

  const dueItems = checkDueReminders(jars);
  const dueCount = dueItems.length;

  // Background reminder & alarm checker berkala setiap 15 detik
  useEffect(() => {
    const timer = setInterval(() => {
      const due = checkDueReminders(jars);
      if (due.length > 0) {
        const now = Date.now();
        due.forEach(({ jar: dueJar, reminder }) => {
          const lastSent = lastNotifiedMap[reminder.id] || 0;
          if (now - lastSent > 3 * 60 * 1000) {
            const procedure = getProcedureForJar(dueJar, lang);
            const firstInstruction =
              reminder.instructions && reminder.instructions.length > 0
                ? reminder.instructions[0]
                : procedure.instructions[0];

            triggerBrowserNotification(
              lang === 'en'
                ? `🔔 ${dueJar.name}: ${procedure.title}`
                : `🔔 ${dueJar.name}: ${procedure.title}`,
              {
                body: firstInstruction
              }
            );
            setLastNotifiedMap((prev) => ({ ...prev, [reminder.id]: now }));
          }
        });
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [jars, lastNotifiedMap, lang]);

  const handleUpdateJarReminders = (jarId: string, updatedReminders: JarReminder[]) => {
    setJars((prev) =>
      prev.map((j) => (j.id === jarId ? { ...j, reminders: updatedReminders } : j))
    );
  };

  const handleSelectJar = (id: string) => {
    setActiveJarId(id);
    const target = jars.find((j) => j.id === id);
    if (target && target.observations.length > 0) {
      setCurrentDay(target.observations[0].dayNumber);
    } else {
      setCurrentDay(1);
    }
  };

  const handleOpenJarDetail = (jarId: string) => {
    setActiveJarId(jarId);
    const target = jars.find((j) => j.id === jarId);
    if (target && target.observations.length > 0) {
      setCurrentDay(target.observations[0].dayNumber);
    } else {
      setCurrentDay(1);
    }
    setHomeViewMode('detail');
  };

  const handleCreateJar = (newJar: JarData) => {
    setJars((prev) => [newJar, ...prev]);
    setActiveJarId(newJar.id);
    setCurrentDay(1);
    setShowCreateJar(false);
    setHomeViewMode('detail');
    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + 50,
      organicSavedGrams: prev.organicSavedGrams + newJar.organicWeightGrams
    }));
  };

  const handleDeleteJar = (id: string) => {
    if (jars.length <= 1) return;
    const remaining = jars.filter((j) => j.id !== id);
    setJars(remaining);
    if (activeJarId === id) {
      setActiveJarId(remaining[0].id);
      if (remaining[0].observations.length > 0) {
        setCurrentDay(remaining[0].observations[0].dayNumber);
      } else {
        setCurrentDay(1);
      }
    }
  };

  const handleStartFermentation = (material: ScannedMaterial) => {
    const addedWeight = material.suggestedWeight || 150;
    setUser((prev) => ({
      ...prev,
      organicSavedGrams: prev.organicSavedGrams + addedWeight,
      totalPoints: prev.totalPoints + 30
    }));

    setJars((prev) =>
      prev.map((j) =>
        j.id === rawActiveJar.id
          ? {
              ...j,
              organicWeightGrams: j.organicWeightGrams + addedWeight,
              ingredientsDescription: `${j.ingredientsDescription}, ${material.name}`
            }
          : j
      )
    );

    setActiveTab('home');
  };

  const handleOpenCalculatorWithMaterial = (material?: ScannedMaterial) => {
    if (material) {
      setCalculatorMaterial(material);
    } else {
      setCalculatorMaterial(null);
    }
    setShowCalculator(true);
  };

  const handleSubmitObservation = (data: {
    color: FermentColor;
    aroma: FermentAroma;
    surface: FermentSurface;
    gas: FermentGas;
  }) => {
    const evalResult = evaluateObservation(
      currentDay,
      data.color,
      data.aroma,
      data.surface,
      data.gas,
      lang
    );

    const newRecord = {
      id: `obs-${Date.now()}`,
      dayNumber: currentDay,
      date: new Date().toISOString().split('T')[0],
      color: data.color,
      aroma: data.aroma,
      surface: data.surface,
      gas: data.gas,
      status: evalResult.status,
      aiFeedback: evalResult.feedback,
      requiresAdult: evalResult.requiresAdult,
      earnedPoints: evalResult.points
    };

    setJars((prev) =>
      prev.map((j) => {
        if (j.id !== rawActiveJar.id) return j;
        const updatedReminders = (j.reminders || []).map((r) => {
          if (!r.enabled || !r.isRecurring) return r;
          const nextDate = calculateNextTrigger(r.value, r.unit);
          return {
            ...r,
            lastTriggeredAt: new Date().toISOString(),
            nextTriggerAt: nextDate.toISOString()
          };
        });
        return {
          ...j,
          observations: [newRecord, ...j.observations],
          reminders: updatedReminders
        };
      })
    );

    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + evalResult.points,
      streakDays: prev.streakDays + 1
    }));

    setHasObservedToday(true);
    setFeedbackInput({
      dayNumber: currentDay,
      color: data.color,
      aroma: data.aroma,
      surface: data.surface,
      gas: data.gas
    });
  };

  const handleResetToday = () => {
    setHasObservedToday(false);
  };

  const handleStartTour = () => {
    setShowTourPrompt(false);
    localStorage.setItem('enzymate_tour_prompted', 'true');
    setActiveTab('home');
    setHomeViewMode('detail');
    setIsTourOpen(true);
  };

  const handleDismissTourPrompt = () => {
    setShowTourPrompt(false);
    localStorage.setItem('enzymate_tour_prompted', 'true');
  };

  const latestObservation = jar.observations[0];
  const currentStatus = latestObservation ? latestObservation.status : 'normal';

  return (
    <div className="min-h-screen bg-stone-200 flex items-center justify-center py-0 sm:py-6 selection:bg-emerald-200">
      <div className="mobile-shell">
        {/* TOP STATUS BAR */}
        <header className="bg-emerald-800 text-white px-4 pt-3.5 pb-3 flex items-center justify-between border-b border-emerald-900/40 sticky top-0 z-30">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                Enzymo
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                {t.header.subtitleBadge}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              {localizeText(user.studentName, lang)}
            </p>
          </div>

          {/* Language Switcher, Gamifikasi Badges & Ikon Bantuan Tur */}
          <div className="flex items-center gap-1.5">
            {/* Segmented Pill Language Switcher (ID / EN) */}
            <div
              className="flex items-center bg-emerald-950/60 p-0.5 rounded-lg border border-emerald-700/60"
              title={t.header.langTooltip}
            >
              <Globe className="w-3 h-3 text-emerald-300 ml-1 mr-0.5 hidden sm:inline" />
              <button
                type="button"
                onClick={() => setLang('id')}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all ${
                  lang === 'id'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all ${
                  lang === 'en'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Tombol Akses Tutorial Tour Kapan Saja */}
            <button
              onClick={() => {
                setActiveTab('home');
                setHomeViewMode('detail');
                setIsTourOpen(true);
              }}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
              title={t.header.tourTooltip}
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Tombol Lonceng Pengingat & Alarm */}
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="relative p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
              title={lang === 'en' ? 'Reminders & Alarms' : 'Pengingat & Alarm Toples'}
            >
              <Bell className="w-4 h-4" />
              {dueCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce shadow-xs px-0.5">
                  {dueCount}
                </span>
              )}
            </button>

            {/* Streak & Poin (Target Spotlight Header) */}
            <div id="tour-header-stats" className="flex items-center gap-1.5">
              <button
                onClick={() => setShowBadges(true)}
                className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-900 text-amber-300 px-2 py-1 rounded-lg text-xs font-semibold border border-emerald-700/60 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.streakDays}</span>
              </button>

              <button
                onClick={() => setShowBadges(true)}
                className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-900 text-amber-300 px-2 py-1 rounded-lg text-xs font-semibold border border-emerald-700/60 transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.totalPoints}</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' &&
            (homeViewMode === 'list' ? (
              <JarLandingScreen
                jars={jars}
                onOpenJar={handleOpenJarDetail}
                onOpenCreateJar={() => setShowCreateJar(true)}
                onDeleteJar={handleDeleteJar}
              />
            ) : (
              <div id="main-scroll-container" className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-24">
                {/* NAVIGASI KEMBALI KE DAFTAR TOPLES */}
                <div className="flex items-center justify-between pb-0.5">
                  <button
                    onClick={() => setHomeViewMode('list')}
                    className="text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{t.homeDetail.backToList}</span>
                  </button>
                  <button
                    onClick={() => setShowJarList(true)}
                    className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                  >
                    <Layers className="w-3 h-3 text-emerald-700" />
                    <span>{t.homeDetail.switchJar}</span>
                  </button>
                </div>

                {/* KARTU TOPLES AKTIF (Target Spotlight Step 1) */}
              <div id="tour-jar-card" className="enzymate-card p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.homeDetail.activeJarBadge}
                      </span>
                      <button
                        onClick={() => setShowJarList(true)}
                        className="text-[10px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                        title={t.homeDetail.collectionTooltip}
                      >
                        <Layers className="w-3 h-3 text-emerald-700" />
                        <span>{t.homeDetail.collectionBtn(jars.length)}</span>
                      </button>
                    </div>
                    <h2 className="text-base font-extrabold text-stone-900 mt-1">
                      {activeJar.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowCreateJar(true)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1 shadow-2xs transition-colors"
                      title={t.homeDetail.newJarTooltip}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.homeDetail.newJarBtn}</span>
                    </button>
                    <button
                      onClick={() => handleOpenCalculatorWithMaterial()}
                      className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg border border-stone-200 transition-colors"
                      title={t.homeDetail.ratioTooltip}
                    >
                      {t.homeDetail.ratioBtn}
                    </button>
                  </div>
                </div>

                {/* Ilustrasi Toples Interaktif */}
                <JarIllustration
                  dayNumber={currentDay}
                  totalDays={jar.targetDays}
                  status={currentStatus}
                  organicWeight={jar.organicWeightGrams}
                  className="my-1"
                />

                {/* Status Bar Toples */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span className="text-[11px] font-medium">{t.homeDetail.safeLimitKept}</span>
                  <span className="font-semibold text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {currentStatus === 'normal' ? t.homeDetail.statusNormal : t.homeDetail.statusNeedsAttention}
                  </span>
                </div>
              </div>

              {/* BANNER PANDUAN & KALKULATOR 1:3:10 (Target Spotlight Step 2) */}
              <div id="tour-calculator-card" className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {t.homeDetail.formulaTitle}
                  </span>
                  <span className="text-[10px] text-stone-400">{t.homeDetail.containerWaterRule}</span>
                </div>

                <h3 className="font-bold text-sm text-white">
                  {t.homeDetail.dosageGuideTitle}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  {t.homeDetail.dosageGuideDesc}
                </p>

                {/* Indikator Pill Formula */}
                <div className="grid grid-cols-3 gap-2 py-2.5 my-1 text-center text-[11px] font-medium">
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-amber-400 font-bold">1</strong> {t.homeDetail.sugar}
                  </div>
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-emerald-400 font-bold">3</strong> {t.homeDetail.fruitScraps}
                  </div>
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-sky-400 font-bold">10</strong> {t.homeDetail.water}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCalculatorWithMaterial()}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{t.homeDetail.openCalculatorBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KARTU MISI HARI INI (Target Spotlight Step 3) */}
              <div id="tour-mission-card" className="enzymate-card p-4 border-l-4 border-l-emerald-700">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h3 className="font-bold text-xs text-stone-900">
                      {t.homeDetail.missionTitle(currentDay)}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {t.homeDetail.missionSubtitle}
                    </p>
                  </div>
                  {hasObservedToday ? (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {t.homeDetail.completedBadge}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {t.homeDetail.pendingBadge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                  {hasObservedToday
                    ? t.homeDetail.missionDescDone
                    : t.homeDetail.missionDescPending}
                </p>

                <button
                  onClick={() => setActiveTab('observation')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{hasObservedToday ? t.homeDetail.openObservationRoom : t.homeDetail.startObservationToday}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MENU AKSES CEPAT */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowBadges(true)}
                  className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-xl border border-amber-200/90 text-left hover:border-amber-300 transition-all shadow-xs"
                >
                  <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded inline-block mb-1">
                    {t.homeDetail.studentLeaderboardTag}
                  </span>
                  <div className="text-xs font-bold text-amber-950">{t.homeDetail.rankAndBadges}</div>
                  <div className="text-[10px] text-amber-800/80 mt-0.5">{t.homeDetail.schoolSdgMission}</div>
                </button>

                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-3 bg-white rounded-xl border border-stone-200 text-left hover:border-stone-300 transition-colors shadow-xs"
                >
                  <span className="text-[9px] uppercase font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded inline-block mb-1">
                    {t.homeDetail.edgeAiTag}
                  </span>
                  <div className="text-xs font-bold text-stone-800">{t.homeDetail.scanNewMaterial}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{t.homeDetail.offlineLocalScanner}</div>
                </button>
              </div>

              {/* RIWAYAT OBSERVASI */}
              <div className="enzymate-card p-3.5">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
                  <h3 className="font-bold text-xs text-stone-800">
                    {t.homeDetail.recentObservationsTitle}
                  </h3>
                  <span className="text-[10px] text-stone-500">
                    {t.homeDetail.recordsCount(jar.observations.length)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {jar.observations.slice(0, 3).map((obs) => (
                    <div
                      key={obs.id}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-800">{t.homeDetail.dayLabel(obs.dayNumber)}</div>
                        <div className="text-[10px] text-stone-500">
                          {obs.aroma === 'asam_segar' ? t.homeDetail.aromaFreshSour : t.homeDetail.aromaNormal} •{' '}
                          {obs.surface === 'putih_tipis' ? t.homeDetail.surfacePitera : t.homeDetail.surfaceClean}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {t.homeDetail.pointsEarned(obs.earnedPoints)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ))}

          {activeTab === 'scanner' && (
            <ScannerScreen
              onStartFermentation={handleStartFermentation}
              onOpenCalculator={handleOpenCalculatorWithMaterial}
            />
          )}

          {activeTab === 'observation' && (
            <ObservationScreen
              jarName={jar.name}
              dayNumber={currentDay}
              hasObservedToday={hasObservedToday}
              onSubmitObservation={handleSubmitObservation}
              onResetTodayStatus={handleResetToday}
            />
          )}
        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-white border-t border-stone-200 px-6 py-2 flex items-center justify-between sticky bottom-0 z-30 shadow-md">
          <button
            onClick={() => {
              if (activeTab === 'home' && homeViewMode === 'detail') {
                setHomeViewMode('list');
              } else {
                setActiveTab('home');
              }
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors w-16 ${
              activeTab === 'home' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{activeTab === 'home' && homeViewMode === 'detail' ? t.nav.list : t.nav.home}</span>
          </button>

          {/* Tombol Menonjol untuk Scan AI (Target Spotlight Step 4) */}
          <button
            id="tour-scanner-button"
            onClick={() => setActiveTab('scanner')}
            className="flex flex-col items-center -mt-5 transition-transform active:scale-95"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white transition-all ${
                activeTab === 'scanner'
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-600/40'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 ring-2 ring-emerald-800/20'
              }`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold mt-1 ${
                activeTab === 'scanner' ? 'text-emerald-800' : 'text-stone-500'
              }`}
            >
              {t.nav.scanAi}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('observation')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors w-16 ${
              activeTab === 'observation' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>{t.nav.observation}</span>
          </button>
        </nav>

        {/* MODAL TOUR GUIDE & SPOTLIGHT BOKEH */}
        <AppTourGuide
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onStartTour={handleStartTour}
          showInitialPrompt={showTourPrompt}
          onDismissPrompt={handleDismissTourPrompt}
        />

        {/* MODAL FEEDBACK RULE ENGINE */}
        {feedbackResult && (
          <FeedbackModal
            result={feedbackResult}
            onClose={() => {
              setFeedbackInput(null);
              setActiveTab('home');
            }}
          />
        )}

        {/* MODAL KALKULATOR 1:3:10 */}
        {showCalculator && (
          <CalculatorModal
            initialMaterial={calculatorMaterial}
            onClose={() => {
              setShowCalculator(false);
              setCalculatorMaterial(null);
            }}
          />
        )}

        {/* MODAL BADGES & PRESTASI SEKOLAH */}
        {showBadges && (
          <BadgesModal
            badges={user.badges}
            streakDays={user.streakDays}
            totalPoints={user.totalPoints}
            organicSavedGrams={user.organicSavedGrams}
            onClose={() => setShowBadges(false)}
          />
        )}

        {/* MODAL DAFTAR KOLEKSI TOPLES */}
        {showJarList && (
          <JarListModal
            jars={jars}
            activeJarId={activeJarId}
            onSelectJar={handleSelectJar}
            onOpenCreateJar={() => setShowCreateJar(true)}
            onDeleteJar={handleDeleteJar}
            onClose={() => setShowJarList(false)}
          />
        )}

        {/* MODAL BUAT TOPLES BARU */}
        {showCreateJar && (
          <CreateJarModal
            onClose={() => setShowCreateJar(false)}
            onCreateJar={handleCreateJar}
          />
        )}

        {/* MODAL PUSAT PENGINGAT & ALARM TOPLES */}
        {showNotifications && (
          <NotificationModal
            jars={jars}
            onClose={() => setShowNotifications(false)}
            onSelectJarForObservation={(targetJarId) => {
              handleOpenJarDetail(targetJarId);
              setActiveTab('observation');
            }}
            onUpdateJarReminders={handleUpdateJarReminders}
          />
        )}
      </div>
    </div>
  );
};

export default App;
