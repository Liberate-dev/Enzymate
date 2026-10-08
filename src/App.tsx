import React, { useState, useEffect } from 'react';
import {
  Flame,
  Star,
  Camera,
  ClipboardList,
  Home,
  Scale,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  Info
} from 'lucide-react';
import { JarIllustration } from './components/JarIllustration';
import { ScannerScreen } from './components/ScannerScreen';
import { ObservationScreen } from './components/ObservationScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { CalculatorModal } from './components/CalculatorModal';
import { BadgesModal } from './components/BadgesModal';
import { MascotBot } from './components/MascotBot';
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
      description: 'Berhasil memindai 3 bahan organik dengan AI Camera',
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
  const [showBadges, setShowBadges] = useState<boolean>(false);

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

  const handleStartFermentation = (material: ScannedMaterial) => {
    // Tambah berat organik yang diselamatkan
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

    alert(`Bahan "${material.name}" (${addedWeight}g) berhasil ditambahkan ke rencana toples Anda! +30 Bintang diperoleh.`);
    setActiveTab('home');
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

    // Update observations
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

    // Update user stats
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

  const latestObservation = jar.observations[0];
  const currentStatus = latestObservation ? latestObservation.status : 'normal';

  return (
    <div className="min-h-screen bg-stone-200 flex items-center justify-center py-0 sm:py-6 selection:bg-emerald-200">
      <div className="mobile-shell">
        {/* TOP STATUS BAR (Design System: Header hijau dengan Poin & Streak) */}
        <header className="bg-emerald-700 text-white px-4 pt-4 pb-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-500/50 flex items-center justify-center font-bold text-xs text-white">
              🌱
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-tight tracking-wide flex items-center gap-1">
                <span>EnzyMate</span>
                <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-md">
                  Cilik
                </span>
              </h1>
              <p className="text-[11px] text-emerald-200 font-medium truncate max-w-[130px]">
                {user.studentName}
              </p>
            </div>
          </div>

          {/* Gamifikasi Badges: Streak & Bintang */}
          <div className="flex items-center gap-1.5">
            {/* Streak Counter */}
            <button
              onClick={() => setShowBadges(true)}
              className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-400/30 transition-all"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
              <span>{user.streakDays}</span>
            </button>

            {/* Point Counter */}
            <button
              onClick={() => setShowBadges(true)}
              className="flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-400/30 transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-300" />
              <span>{user.totalPoints}</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
              {/* KARTU TOPLES AKTIF */}
              <div className="enzymate-card p-4 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Toples Fermentasi Aktif
                    </span>
                    <h2 className="text-base font-extrabold text-stone-900 mt-1">
                      {jar.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Cek Rasio Wadah"
                  >
                    <Scale className="w-4 h-4" />
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

                {/* Label Status Cepat Toples */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Batas Aman 2/3 Terjaga</span>
                  </div>
                  <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {currentStatus === 'normal' ? 'Kondisi Normal' : 'Butuh Pengawasan'}
                  </span>
                </div>
              </div>

              {/* KARTU MISI HARI INI */}
              <div className="enzymate-card p-4 border-l-4 border-l-emerald-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-stone-900">Misi Observasi Hari ke-{currentDay}</h3>
                      <p className="text-[10px] text-stone-500">Buka tutup perlahan untuk rilis gas</p>
                    </div>
                  </div>
                  {hasObservedToday ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Selesai
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                      Menunggu
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                  {hasObservedToday
                    ? 'Pengamatan harian sudah dicatat. Tutup toples tetap rapat agar mikroorganisme bekerja maksimal.'
                    : 'Waktunya mencatat aroma, warna, dan jamur hari ini. Raih bintang kedisiplinan!'}
                </p>

                <button
                  onClick={() => setActiveTab('observation')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{hasObservedToday ? 'Lihat Kartu Observasi' : 'Isi Kartu Observasi Sekarang'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SHORTCUT MENU (Kalkulator & Lencana Sekolah) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="p-3 bg-white rounded-2xl border border-stone-200 text-left hover:border-emerald-300 transition-all shadow-xs flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">Panduan 1:3:10</div>
                    <div className="text-[10px] text-stone-500">Kalkulator Takaran</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowBadges(true)}
                  className="p-3 bg-white rounded-2xl border border-stone-200 text-left hover:border-amber-300 transition-all shadow-xs flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">Peringkat & Badge</div>
                    <div className="text-[10px] text-stone-500">Misi SDG Sekolah</div>
                  </div>
                </button>
              </div>

              {/* RIWAYAT OBSERVASI TERAKHIR */}
              <div className="enzymate-card p-3.5">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
                  <h3 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-stone-500" />
                    <span>Catatan Pengamatan Terakhir</span>
                  </h3>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {jar.observations.length} Catatan
                  </span>
                </div>

                <div className="space-y-2">
                  {jar.observations.slice(0, 3).map((obs) => (
                    <div
                      key={obs.id}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-800">Hari ke-{obs.dayNumber}</div>
                        <div className="text-[10px] text-stone-500">
                          {obs.aroma === 'asam_segar' ? 'Aroma Asam Segar' : 'Aroma Normal'} •{' '}
                          {obs.surface === 'putih_tipis' ? 'Jamur Pitera Baik' : 'Permukaan Bersih'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        +50 Poin
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
              onOpenCalculator={() => setShowCalculator(true)}
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
        <nav className="bg-white border-t border-stone-200 px-6 py-2 flex items-center justify-between sticky bottom-0 z-30 shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
              activeTab === 'home' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>

          {/* Central Highlighted AI Scanner Button */}
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center -mt-5 transition-all`}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <span
              className={`text-[10px] font-bold mt-1 ${
                activeTab === 'scanner' ? 'text-emerald-700' : 'text-stone-400'
              }`}
            >
              Scan AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('observation')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
              activeTab === 'observation' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Observasi</span>
          </button>
        </nav>

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
        {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}

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
