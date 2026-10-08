import React, { useState, useEffect } from 'react';
import {
  Flame,
  Star,
  Camera,
  ClipboardList,
  Home,
  ChevronRight,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { JarIllustration } from './components/JarIllustration';
import { ScannerScreen } from './components/ScannerScreen';
import { ObservationScreen } from './components/ObservationScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { CalculatorModal } from './components/CalculatorModal';
import { BadgesModal } from './components/BadgesModal';
import { AppTourGuide } from './components/AppTourGuide';
import {
  JarData,
  UserProgress,
  ScannedMaterial,
  FermentColor,
  FermentAroma,
  FermentSurface,
  FermentGas
} from './types';
import { evaluateObservation, EvaluationResult } from './ruleEngine';

const INITIAL_JAR: JarData = {
  id: 'jar-1',
  name: 'Toples Jeruk & Pepaya Ceria',
  startDate: '2026-09-24',
  targetDays: 90,
  containerCapacityLiters: 3,
  organicWeightGrams: 450,
  sugarWeightGrams: 150,
  waterVolumeMl: 1500,
  ingredientsDescription: 'Kulit Jeruk Manis, Kulit Pepaya Muda, Batang Sawi',
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
      dayNumber: 13,
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
};

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
  const [activeTab, setActiveTab] = useState<'home' | 'scanner' | 'observation'>('home');
  const [jar, setJar] = useState<JarData>(() => {
    const saved = localStorage.getItem('enzymate_jar');
    return saved ? JSON.parse(saved) : INITIAL_JAR;
  });
  const [user, setUser] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('enzymate_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [hasObservedToday, setHasObservedToday] = useState<boolean>(() => {
    return localStorage.getItem('enzymate_observed_today') === 'true';
  });

  const [currentDay, setCurrentDay] = useState<number>(14);
  const [feedbackResult, setFeedbackResult] = useState<EvaluationResult | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calculatorMaterial, setCalculatorMaterial] = useState<ScannedMaterial | null>(null);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  // Tour Guide State
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [showTourPrompt, setShowTourPrompt] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('enzymate_jar', JSON.stringify(jar));
  }, [jar]);

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

  const handleStartFermentation = (material: ScannedMaterial) => {
    const addedWeight = material.suggestedWeight || 150;
    setUser((prev) => ({
      ...prev,
      organicSavedGrams: prev.organicSavedGrams + addedWeight,
      totalPoints: prev.totalPoints + 30
    }));

    setJar((prev) => ({
      ...prev,
      organicWeightGrams: prev.organicWeightGrams + addedWeight,
      ingredientsDescription: `${prev.ingredientsDescription}, ${material.name}`
    }));

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
      data.gas
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

    setJar((prev) => ({
      ...prev,
      observations: [newRecord, ...prev.observations]
    }));

    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + evalResult.points,
      streakDays: prev.streakDays + 1
    }));

    setHasObservedToday(true);
    setFeedbackResult(evalResult);
  };

  const handleResetToday = () => {
    setHasObservedToday(false);
  };

  const handleStartTour = () => {
    setShowTourPrompt(false);
    localStorage.setItem('enzymate_tour_prompted', 'true');
    setActiveTab('home');
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
                EnzyMate
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                Cilik
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              {user.studentName}
            </p>
          </div>

          {/* Gamifikasi Badges & Ikon Bantuan Tur */}
          <div className="flex items-center gap-1.5">
            {/* Tombol Akses Tutorial Tour Kapan Saja */}
            <button
              onClick={() => {
                setActiveTab('home');
                setIsTourOpen(true);
              }}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
              title="Buka Panduan Tur Aplikasi"
            >
              <HelpCircle className="w-4 h-4" />
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
          {activeTab === 'home' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-24">
              {/* KARTU TOPLES AKTIF (Target Spotlight Step 1) */}
              <div id="tour-jar-card" className="enzymate-card p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Toples Aktif
                    </span>
                    <h2 className="text-base font-extrabold text-stone-900 mt-1">
                      {jar.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleOpenCalculatorWithMaterial()}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                  >
                    Aturan Rasio
                  </button>
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
                  <span className="text-[11px] font-medium">Batas Aman 2/3 Terjaga</span>
                  <span className="font-semibold text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {currentStatus === 'normal' ? 'Kondisi Normal' : 'Butuh Pengawasan'}
                  </span>
                </div>
              </div>

              {/* BANNER PANDUAN & KALKULATOR 1:3:10 (Target Spotlight Step 2) */}
              <div id="tour-calculator-card" className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Formula 1 : 3 : 10
                  </span>
                  <span className="text-[10px] text-stone-400">Aturan Wadah & Air</span>
                </div>

                <h3 className="font-bold text-sm text-white">
                  Panduan Takaran Bahan
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  Kalkulator praktis untuk menentukan berat gula, sisa kulit buah, dan air agar fermentasi tidak gagal.
                </p>

                {/* Indikator Pill Formula */}
                <div className="grid grid-cols-3 gap-2 py-2.5 my-1 text-center text-[11px] font-medium">
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-amber-400 font-bold">1</strong> Gula
                  </div>
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-emerald-400 font-bold">3</strong> Sisa Buah
                  </div>
                  <div className="bg-stone-800 rounded-lg py-1.5 border border-stone-700">
                    <strong className="text-sky-400 font-bold">10</strong> Air
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCalculatorWithMaterial()}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buka Kalkulator Toples</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KARTU MISI HARI INI (Target Spotlight Step 3) */}
              <div id="tour-mission-card" className="enzymate-card p-4 border-l-4 border-l-emerald-700">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h3 className="font-bold text-xs text-stone-900">
                      Misi Observasi Hari ke-{currentDay}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Periksa aroma dan rilis gas perlahan
                    </p>
                  </div>
                  {hasObservedToday ? (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Selesai
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Menunggu
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                  {hasObservedToday
                    ? 'Pengamatan hari ini telah selesai dicatat. Toples tetap tertutup rapat.'
                    : 'Catat aroma, warna, dan kondisi toples untuk memantau aktivitas mikroba.'}
                </p>

                <button
                  onClick={() => setActiveTab('observation')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{hasObservedToday ? 'Buka Ruang Observasi' : 'Mulai Pengamatan Hari Ini'}</span>
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
                    Klasemen Siswa
                  </span>
                  <div className="text-xs font-bold text-amber-950">Peringkat & Lencana</div>
                  <div className="text-[10px] text-amber-800/80 mt-0.5">Misi SDG sekolah</div>
                </button>

                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-3 bg-white rounded-xl border border-stone-200 text-left hover:border-stone-300 transition-colors shadow-xs"
                >
                  <span className="text-[9px] uppercase font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded inline-block mb-1">
                    Edge AI
                  </span>
                  <div className="text-xs font-bold text-stone-800">Scan Bahan Baru</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Pemindai lokal offline</div>
                </button>
              </div>

              {/* RIWAYAT OBSERVASI */}
              <div className="enzymate-card p-3.5">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
                  <h3 className="font-bold text-xs text-stone-800">
                    Catatan Pengamatan Terakhir
                  </h3>
                  <span className="text-[10px] text-stone-500">
                    {jar.observations.length} Catatan
                  </span>
                </div>

                <div className="space-y-1.5">
                  {jar.observations.slice(0, 3).map((obs) => (
                    <div
                      key={obs.id}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-800">Hari ke-{obs.dayNumber}</div>
                        <div className="text-[10px] text-stone-500">
                          {obs.aroma === 'asam_segar' ? 'Aroma Asam Segar' : 'Aroma Normal'} •{' '}
                          {obs.surface === 'putih_tipis' ? 'Jamur Pitera Baik' : 'Permukaan Bersih'}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        +{obs.earnedPoints} Poin
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors w-16 ${
              activeTab === 'home' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
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
              Scan AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('observation')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors w-16 ${
              activeTab === 'observation' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Observasi</span>
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
              setFeedbackResult(null);
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
      </div>
    </div>
  );
};

export default App;
