import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Badge,
  FermentAroma,
  FermentColor,
  FermentGas,
  FermentSurface,
  JarData,
  ScannedMaterial
} from './types';

export type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  toggleLang: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('enzymate_lang');
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('enzymate_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'en' ? 'Enzymo - Eco-Enzyme Companion' : 'Enzymo - Sahabat Eco-Enzyme';
  }, [lang]);

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, toggleLang } },
    children
  );
};

export const useLanguage = () => useContext(LanguageContext);

/**
 * Helper to translate default / preset Jar names, ingredients, and observation feedback
 * so even data persisted in localStorage switches cleanly between ID and EN.
 */
const DEFAULT_JAR_TRANSLATIONS: Record<
  string,
  {
    id: { name: string; ingredientsDescription: string };
    en: { name: string; ingredientsDescription: string };
  }
> = {
  'jar-1': {
    id: {
      name: 'Toples Jeruk & Pepaya Ceria',
      ingredientsDescription: 'Kulit Jeruk Manis, Kulit Pepaya Muda, Batang Sawi'
    },
    en: {
      name: 'Cheerful Orange & Papaya Jar',
      ingredientsDescription: 'Sweet Orange Peels, Green Papaya Peels, Mustard Stems'
    }
  },
  'jar-2': {
    id: {
      name: 'Toples Sayur Sawi & Kangkung 5A',
      ingredientsDescription: 'Sisa Batang Sawi Hijau, Batang Kangkung, Kulit Mentimun'
    },
    en: {
      name: 'Class 5A Mustard & Water Spinach Jar',
      ingredientsDescription: 'Mustard Green Stems, Water Spinach Stems, Cucumber Peels'
    }
  },
  'jar-hist-1': {
    id: {
      name: 'Toples Sitrus Angkatan 2025',
      ingredientsDescription: 'Kulit Jeruk Nipis, Kulit Lemon, Kulit Jeruk Bali'
    },
    en: {
      name: 'Class of 2025 Citrus Batch Jar',
      ingredientsDescription: 'Lime Peels, Lemon Peels, Pomelo Peels'
    }
  }
};

const KNOWN_TEXT_MAP_ID_TO_EN: Record<string, string> = {
  'Toples Jeruk & Pepaya Ceria': 'Cheerful Orange & Papaya Jar',
  'Kulit Jeruk Manis, Kulit Pepaya Muda, Batang Sawi':
    'Sweet Orange Peels, Green Papaya Peels, Mustard Stems',
  'Toples Sayur Sawi & Kangkung 5A': 'Class 5A Mustard & Water Spinach Jar',
  'Sisa Batang Sawi Hijau, Batang Kangkung, Kulit Mentimun':
    'Mustard Green Stems, Water Spinach Stems, Cucumber Peels',
  'Toples Sitrus Angkatan 2025': 'Class of 2025 Citrus Batch Jar',
  'Kulit Jeruk Nipis, Kulit Lemon, Kulit Jeruk Bali':
    'Lime Peels, Lemon Peels, Pomelo Peels',
  'Toples Baru Ceria': 'Cheerful New Jar',
  'Toples Sitrus Segar': 'Fresh Citrus Jar',
  'Toples Nanas & Apel Ceria': 'Cheerful Pineapple & Apple Jar',
  'Toples Tropis Sekolah': 'School Tropical Jar',
  'Toples Sayur Organik Hebat': 'Super Organic Veggie Jar',
  'Kulit Jeruk, Kulit Pepaya, Kulit Pisang': 'Orange Peels, Papaya Peels, Banana Peels',
  'Sisa buah dan sayur segar mentah': 'Fresh raw fruit and vegetable scraps',
  'Kulit Jeruk & Lemon': 'Orange & Lemon Peels',
  'Kulit Pisang Cavendis': 'Cavendish Banana Peels',
  'Sisa Batang Kangkung & Sawi': 'Water Spinach & Mustard Stems',
  'Potongan Pepaya Layu Berjamur Hitam': 'Wilted Papaya with Black Mold',
  'Bungkus Plastik & Sendok': 'Plastic Wrapper & Spoon',
  'Ragi awal bekerja baik!': 'Early yeast is working well!',
  'Wangi asam segar terdeteksi.': 'Fresh sour aroma detected.',
  'Bakteri mulai aktif membentuk gelembung halus.':
    'Good bacteria are actively forming fine bubbles.',
  'Panen sukses sempurna! Cairan beraroma sitrus segar khas eco-enzyme matang.':
    'Harvest succeeded! The liquid has a fresh citrus aroma typical of mature Eco-Enzyme.',
  'Rian (Siswa SDN 01)': 'Rian (Grade 5 Student)'
};

const KNOWN_TEXT_MAP_EN_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(KNOWN_TEXT_MAP_ID_TO_EN).map(([k, v]) => [v, k])
);

export function localizeText(text: string, lang: Language): string {
  if (!text) return text;
  const map = lang === 'en' ? KNOWN_TEXT_MAP_ID_TO_EN : KNOWN_TEXT_MAP_EN_TO_ID;
  if (map[text]) return map[text];

  // Also handle comma-separated ingredient lists where scanned materials were appended
  const parts = text.split(', ').map((part) => map[part] || part);
  return parts.join(', ');
}

export function localizeJar(jar: JarData, lang: Language): JarData {
  const preset = DEFAULT_JAR_TRANSLATIONS[jar.id];
  const localizedName = localizeText(jar.name, lang) || (preset ? preset[lang].name : jar.name);
  const localizedIngredients = localizeText(jar.ingredientsDescription, lang);

  return {
    ...jar,
    name: localizedName,
    ingredientsDescription: localizedIngredients,
    observations: jar.observations.map((obs) => ({
      ...obs,
      aiFeedback: localizeText(obs.aiFeedback, lang)
    }))
  };
}

export const BADGE_TRANSLATIONS: Record<
  string,
  { id: { name: string; description: string }; en: { name: string; description: string } }
> = {
  'badge-1': {
    id: {
      name: 'Detektif Dini',
      description: 'Berhasil memindai 3 bahan organik dengan kamera'
    },
    en: {
      name: 'Junior Detective',
      description: 'Successfully scanned 3 organic materials with the camera'
    }
  },
  'badge-2': {
    id: {
      name: 'Rentetan Disiplin',
      description: 'Mengisi kartu observasi 3 hari berturut-turut tanpa jeda'
    },
    en: {
      name: 'Discipline Streak',
      description: 'Completed the observation log for 3 consecutive days'
    }
  },
  'badge-3': {
    id: {
      name: 'Ahli Eco-Enzyme',
      description: 'Menjaga toples sehat hingga usia 30 hari pertama'
    },
    en: {
      name: 'Eco-Enzyme Expert',
      description: 'Kept a fermentation jar healthy through its first 30 days'
    }
  },
  'badge-4': {
    id: {
      name: 'Pahlawan Pangan',
      description: 'Menyelamatkan lebih dari 1 kg sisa kulit buah'
    },
    en: {
      name: 'Food Waste Hero',
      description: 'Saved more than 1 kg of leftover fruit peels'
    }
  }
};

export function localizeBadges(badges: Badge[], lang: Language): Badge[] {
  return badges.map((b) => {
    const tr = BADGE_TRANSLATIONS[b.id];
    if (!tr) return b;
    return {
      ...b,
      name: tr[lang].name,
      description: tr[lang].description
    };
  });
}

export function getScanPresets(lang: Language): ScannedMaterial[] {
  if (lang === 'en') {
    return [
      {
        id: 'mat-1',
        name: 'Orange & Lemon Peels',
        category: 'fresh_fruit',
        condition: 'Fresh & Rich in Essential Oils',
        confidence: 0.96,
        aiAdvice: 'Highly Suitable for Eco-Enzyme (Fresh citrus scent!)',
        isValid: true,
        notes: 'Rich in natural citrus aroma, ideal for eco-friendly household cleaners.',
        suggestedWeight: 150
      },
      {
        id: 'mat-2',
        name: 'Cavendish Banana Peels',
        category: 'fresh_fruit',
        condition: 'Fresh & Oil-Free',
        confidence: 0.94,
        aiAdvice: 'Highly Suitable for Eco-Enzyme',
        isValid: true,
        notes: 'Contains high potassium and natural nutrients for plant fertilizer.',
        suggestedWeight: 200
      },
      {
        id: 'mat-3',
        name: 'Water Spinach & Mustard Stems',
        category: 'fresh_veg',
        condition: 'Fresh & Raw (Uncooked)',
        confidence: 0.91,
        aiAdvice: 'Suitable for Eco-Enzyme',
        isValid: true,
        notes: 'Ensure vegetables are raw and free from cooking oil or broth.',
        suggestedWeight: 100
      },
      {
        id: 'mat-4',
        name: 'Wilted Papaya with Black Mold',
        category: 'spoiled',
        condition: 'Rotten & Mold-Contaminated',
        confidence: 0.98,
        aiAdvice: 'Not Suitable! Compost Instead — Ask an Adult',
        isValid: false,
        notes: 'Pathogenic mold from spoiled fruit can ruin the entire fermentation batch.',
        suggestedWeight: 0
      },
      {
        id: 'mat-5',
        name: 'Plastic Wrapper & Spoon',
        category: 'other',
        condition: 'Non-Organic Material',
        confidence: 0.99,
        aiAdvice: 'Invalid Object — Use Fruit or Vegetable Scraps Only',
        isValid: false,
        notes: 'Only use raw organic scraps without plastic, metal, or oil.',
        suggestedWeight: 0
      }
    ];
  }

  return [
    {
      id: 'mat-1',
      name: 'Kulit Jeruk & Lemon',
      category: 'fresh_fruit',
      condition: 'Segar & Kaya Minyak Atsiri',
      confidence: 0.96,
      aiAdvice: 'Sangat Layak untuk Eco-Enzyme (Hasil wangi sitrus segar!)',
      isValid: true,
      notes: 'Kaya aroma segar sitrus alami, sangat disukai untuk pembersih ramah lingkungan.',
      suggestedWeight: 150
    },
    {
      id: 'mat-2',
      name: 'Kulit Pisang Cavendis',
      category: 'fresh_fruit',
      condition: 'Segar & Bersih dari Minyak',
      confidence: 0.94,
      aiAdvice: 'Sangat Layak untuk Eco-Enzyme',
      isValid: true,
      notes: 'Mengandung kalium dan nutrisi alami yang tinggi untuk cairan enzim tanaman.',
      suggestedWeight: 200
    },
    {
      id: 'mat-3',
      name: 'Sisa Batang Kangkung & Sawi',
      category: 'fresh_veg',
      condition: 'Segar & Mentah (Belum Dimasak)',
      confidence: 0.91,
      aiAdvice: 'Layak untuk Eco-Enzyme',
      isValid: true,
      notes: 'Pastikan sayuran masih mentah dan belum terkena minyak goreng atau bumbu kuah.',
      suggestedWeight: 100
    },
    {
      id: 'mat-4',
      name: 'Potongan Pepaya Layu Berjamur Hitam',
      category: 'spoiled',
      condition: 'Busuk & Terkontaminasi Jamur',
      confidence: 0.98,
      aiAdvice: 'Tidak Layak! Arahkan ke Kompos - Tanyakan Pendamping',
      isValid: false,
      notes: 'Jamur patogen dari buah busuk bisa merusak seluruh isi toples fermentasi.',
      suggestedWeight: 0
    },
    {
      id: 'mat-5',
      name: 'Bungkus Plastik & Sendok',
      category: 'other',
      condition: 'Bukan Bahan Organik',
      confidence: 0.99,
      aiAdvice: 'Objek Tidak Valid - Masukkan Sisa Kulit Buah/Sayur',
      isValid: false,
      notes: 'Hanya gunakan bahan organik mentah tanpa plastik atau minyak.',
      suggestedWeight: 0
    }
  ];
}

export const UI_TEXT = {
  id: {
    header: {
      subtitleBadge: 'Cilik',
      tourTooltip: 'Buka Panduan Tur Aplikasi',
      langTooltip: 'Ganti Bahasa (ID / EN)'
    },
    nav: {
      list: 'Daftar',
      home: 'Beranda',
      scanAi: 'Scan AI',
      observation: 'Observasi'
    },
    homeDetail: {
      backToList: 'Kembali ke Daftar Toples',
      switchJar: 'Ganti Toples',
      activeJarBadge: 'Toples Aktif',
      collectionBtn: (count: number) => `Koleksi (${count})`,
      collectionTooltip: 'Daftar koleksi toples',
      newJarBtn: 'Toples Baru',
      newJarTooltip: 'Tambah toples baru',
      ratioBtn: 'Rasio',
      ratioTooltip: 'Lihat formula rasio',
      safeLimitKept: 'Batas Aman 2/3 Terjaga',
      statusNormal: 'Kondisi Normal',
      statusNeedsAttention: 'Butuh Pengawasan',
      formulaTitle: 'Formula 1 : 3 : 10',
      containerWaterRule: 'Aturan Wadah & Air',
      dosageGuideTitle: 'Panduan Takaran Bahan',
      dosageGuideDesc:
        'Kalkulator praktis untuk menentukan berat gula, sisa kulit buah, dan air agar fermentasi tidak gagal.',
      sugar: 'Gula',
      fruitScraps: 'Sisa Buah',
      water: 'Air',
      openCalculatorBtn: 'Buka Kalkulator Toples',
      missionTitle: (day: number) => `Misi Observasi Hari ke-${day}`,
      missionSubtitle: 'Periksa aroma dan rilis gas perlahan',
      completedBadge: 'Selesai',
      pendingBadge: 'Menunggu',
      missionDescDone:
        'Pengamatan hari ini telah selesai dicatat. Toples tetap tertutup rapat.',
      missionDescPending:
        'Catat aroma, warna, dan kondisi toples untuk memantau aktivitas mikroba.',
      openObservationRoom: 'Buka Ruang Observasi',
      startObservationToday: 'Mulai Pengamatan Hari Ini',
      studentLeaderboardTag: 'Klasemen Siswa',
      rankAndBadges: 'Peringkat & Lencana',
      schoolSdgMission: 'Misi SDG sekolah',
      edgeAiTag: 'Edge AI',
      scanNewMaterial: 'Scan Bahan Baru',
      offlineLocalScanner: 'Pemindai lokal offline',
      recentObservationsTitle: 'Catatan Pengamatan Terakhir',
      recordsCount: (count: number) => `${count} Catatan`,
      dayLabel: (day: number) => `Hari ke-${day}`,
      aromaFreshSour: 'Aroma Asam Segar',
      aromaNormal: 'Aroma Normal',
      surfacePitera: 'Jamur Pitera Baik',
      surfaceClean: 'Permukaan Bersih',
      pointsEarned: (pts: number) => `+${pts} Poin`
    },
    landing: {
      miniLabBadge: 'Laboratorium Mini',
      newJarBonusBadge: '+50 Poin Wadah Baru',
      heroTitle: 'Koleksi Toples Fermentasi',
      heroDesc:
        'Punya sisa kulit buah segar hari ini? Mulai toples baru dengan takaran formula emas 1:3:10.',
      startNewJarBtn: 'Mulai Buat Toples Baru',
      tabAll: (count: number) => `Semua (${count})`,
      tabActive: (count: number) => `Sedang Aktif (${count})`,
      tabCompleted: (count: number) => `Riwayat Panen (${count})`,
      activeSectionTitle: 'Toples Dalam Proses Fermentasi',
      target90Days: 'Target 90 Hari',
      activeBadge: 'Aktif',
      statusNormal: 'Kondisi Normal',
      statusCheck: 'Perlu Diperiksa',
      confirmDeleteActive: (name: string) => `Yakin ingin menghapus toples "${name}"?`,
      deleteTooltip: 'Hapus toples',
      dayOfTarget: (day: number, target: number) => `Hari ke-${day} dari ${target}`,
      logsCount: (count: number) => `${count}x log`,
      openJarBtn: 'Buka Toples',
      completedSectionTitle: 'Riwayat Toples Selesai & Panen',
      naturalHarvestBadge: '100% Panen Alami',
      harvestDoneBadge: 'Panen Selesai (90 Hari)',
      confirmDeleteHistory: (name: string) => `Yakin ingin menghapus riwayat toples "${name}"?`,
      deleteHistoryTooltip: 'Hapus riwayat toples',
      harvestYieldLabel: (ml: number) => `Hasil: ${ml} ml Cairan Enzim`,
      harvestDateLabel: (date: string) => `Panen: ${date}`,
      completedFallback: 'Selesai',
      containerSummary: (liters: number, grams: number) =>
        `Wadah ${liters}L • ${grams}g Organik`,
      viewHarvestDetails: 'Lihat Rincian Panen',
      emptyTabTitle: 'Tidak ada toples di tab ini',
      emptyTabDesc: 'Klik tombol "Mulai Buat Toples Baru" untuk menambahkan wadah fermentasi.'
    },
    jarIllustration: {
      safeLimitSvg: 'BATAS AMAN (2/3)',
      gasSpaceSvg: 'Ruang Gas Fermentasi',
      dayBadge: (day: number) => `Hari ke-${day}`,
      harvestJourney: 'Perjalanan Panen',
      day1Start: 'Hari 1 (Mulai)',
      day90Harvest: '90 Hari (Panen Alami)'
    },
    scanner: {
      title: 'AI Camera Scanner',
      subtitle: 'Pemrosesan lokal offline',
      dosageGuideBtn: 'Panduan Takaran',
      cameraReadyDesc:
        'Kamera siap mendeteksi. Pilih sampel bahan di bawah untuk menguji klasifikasi lokal.',
      cameraErrorFallback: 'Kamera tidak aktif / mode simulasi offline aktif',
      detectionArea: 'Area Deteksi Bahan',
      precisionLabel: (pct: number) => `${pct}% Presisi`,
      conditionLabel: 'Kondisi:',
      catFreshFruit: 'Kulit Buah Segar',
      catFreshVeg: 'Sayur Segar',
      catSpoiled: 'Tidak Segar',
      catOther: 'Bukan Organik',
      recommendationLabel: 'Rekomendasi: ',
      startWithMaterialBtn: 'Mulai Fermentasi dengan Bahan Ini',
      invalidMaterialMsg: 'Bahan tidak memenuhi syarat untuk difermentasi.',
      sampleTestLabel: 'Sampel Uji Bahan:',
      verifiedBadge: 'Bahan Terverifikasi',
      pointsBadge: '+30 Poin',
      estimatedWeightMsg: (grams: number) =>
        `Estimasi berat: ~${grams} gram. Bahan memenuhi syarat untuk diolah ke dalam toples.`,
      calcWaterSugarBtn: 'Hitung Takaran Air & Gula (Panduan 1:3:10)',
      saveAndHomeBtn: 'Simpan & Kembali ke Beranda'
    },
    observation: {
      dailyScheduleBadge: 'Jadwal Observasi Harian',
      centerTitle: 'Pusat Pengamatan & Observasi',
      centerDescPrefix: 'Pantau kondisi',
      centerDescSuffix: 'hari ini bersama AI Enzy.',
      threeStepsTitle: '3 Langkah Pengamatan Bersama Pendamping:',
      step1Title: 'Dengarkan Desisan Gas',
      step1Desc:
        'Buka tutup toples perlahan. Dengarkan apakah ada bunyi letupan desisan gas mikroba aktif.',
      step2Title: 'Cium Aromanya',
      step2Desc:
        'Dekatkan hidung tanpa menyentuh cairan. Rasakan apakah beraroma asam segar, manis, atau busuk.',
      step3Title: 'Amati Warna & Jamur',
      step3Desc:
        'Cek perubahan warna cairan dan pastikan tidak ada jamur berbulu hitam atau hijau.',
      doneTitle: (day: number) => `Observasi Hari ke-${day} Sudah Selesai`,
      doneDesc:
        'Toples telah dicatat hari ini dan tertutup rapat agar bakteri bekerja optimal.',
      viewFormBtn: 'Lihat Catatan Form',
      resetDemoBtn: 'Reset Demo',
      resetDemoTooltip: 'Reset mode demo',
      startFormBtn: 'Mulai Isi Kartu Observasi Sekarang',
      oncePerDayNote: 'Dibatasi 1x per hari demi menjaga kestabilan fermentasi wadah',
      backToGuide: 'Kembali ke Panduan',
      dayTag: (day: number) => `Hari ke-${day}`,
      formTitle: 'Formulir Pengamatan Visual',
      formSubtitle: 'Pilih kondisi yang sesuai dengan hasil pemeriksaan toples hari ini.',
      var1Label: '1. Warna Cairan Fermentasi',
      var2Label: '2. Aroma yang Tercium',
      var3Label: '3. Kondisi Permukaan Cairan',
      var4Label: '4. Tekanan Gas Saat Tutup Dibuka',
      needsCheckBadge: 'Perlu Dicek',
      submitBtn: 'Kirim Pengamatan ke AI Enzy',
      colors: {
        bening_kuning: { label: 'Bening Kuning', desc: 'Fase awal fermentasi' },
        oranye_cokelat: { label: 'Oranye Cokelat', desc: 'Warna ideal normal' },
        cokelat_tua: { label: 'Cokelat Gelap', desc: 'Fase matang molase' }
      } as Record<FermentColor, { label: string; desc: string }>,
      aromas: {
        asam_segar: { label: 'Asam Segar', desc: 'Wangi khas eco-enzyme' },
        manis: { label: 'Manis Gula', desc: 'Gula belum terurai penuh' },
        alkohol: { label: 'Alkohol', desc: 'Aroma tajam fermentasi' },
        busuk: { label: 'Bau Busuk', desc: 'Perhatian! Perlu bantuan' }
      } as Record<FermentAroma, { label: string; desc: string }>,
      surfaces: {
        bersih: { label: 'Permukaan Bersih', desc: 'Cairan bening alami' },
        putih_tipis: { label: 'Lapisan Putih Tipis', desc: 'Ragi pitera (Bagus!)' },
        jamur_berbulu: { label: 'Jamur Berbulu Warna', desc: 'Jamur hijau/hitam/merah' }
      } as Record<FermentSurface, { label: string; desc: string }>,
      gases: {
        banyak: { label: 'Banyak Gas', desc: 'Desisan kuat saat dibuka' },
        sedikit: { label: 'Gas Sedikit', desc: 'Sedikit bunyi letupan' },
        tidak_ada: { label: 'Tidak Ada Gas', desc: 'Tenang tanpa desisan' }
      } as Record<FermentGas, { label: string; desc: string }>
    },
    feedbackModal: {
      statusBadges: {
        normal: 'Kondisi Normal & Sehat',
        observe: 'Perlu Pengamatan Lanjutan',
        attention: 'Perlu Perhatian Khusus',
        failed: 'Kontaminasi Terdeteksi'
      },
      adultSafetyTitle: 'Instruksi Keselamatan Pendamping:',
      advicePrefix: 'Saran: ',
      pointsAdded: (pts: number) => `+${pts} Poin Kedisiplinan Ditambahkan`,
      backToDashboard: 'Kembali ke Dashboard'
    },
    calculatorModal: {
      title: 'Kalkulator Formula 1 : 3 : 10',
      subtitle: 'Panduan Takaran & Batas Aman Toples',
      scannedMaterialNote: 'Bahan dari Scan AI:',
      capacityLabel: 'Kapasitas Wadah Toples:',
      literUnit: 'Liter',
      customLabel: 'Kustom:',
      safeLimitTitle: 'Aturan Batas Maksimal 2/3 Wadah',
      safeLimitDesc: (maxLiters: number) =>
        `Total campuran air & bahan maksimal ${maxLiters} Liter. Sisakan 1/3 bagian kosong di atas untuk ruang sirkulasi gas agar tidak meledak.`,
      sugarTitle: 'Gula Merah / Molase',
      sugarDesc: '1 Bagian (makanan mikroba)',
      organicTitle: 'Sisa Kulit Buah / Sayur',
      organicDesc: '3 Bagian (mentah & bersih)',
      waterTitle: 'Air Bersih Bebas Kaporit',
      waterDesc: '10 Bagian (air sumur/galon)',
      closeBtn: 'Tutup Panduan'
    },
    badgesModal: {
      title: 'Prestasi & Klasemen Sekolah',
      subtitle: 'Misi SDG Lingkungan & Disiplin',
      wasteProcessed: 'Sampah Diolah',
      daysUnit: (d: number) => `${d} Hari`,
      disciplineStreak: 'Streak Disiplin',
      totalPoints: 'Total Poin',
      disciplineBadges: 'Lencana Disiplin',
      unlocked: 'Terbuka',
      locked: 'Terkunci',
      schoolLeaderboardTitle: 'Klasemen Toples Sekolah',
      organicUnit: 'kg organik',
      closeBtn: 'Tutup',
      leaderboardClasses: [
        'Kelas 5B - Tim Jeruk Manis',
        'Kelas 5A - Tim Enzy Hebat (Kamu)',
        'Kelas 4C - Pejuang Kompos',
        'Kelas 6A - Detektif Buah'
      ]
    },
    jarListModal: {
      collectionBadge: 'Koleksi Wadah',
      totalJars: (count: number) => `Total: ${count} Toples`,
      title: 'Daftar Toples Fermentasi',
      addNewJarBtn: 'Tambah Toples Baru',
      activeBadge: 'Aktif',
      fallbackIngredients: 'Bahan organik campuran',
      confirmDelete: (name: string) => `Yakin ingin menghapus "${name}"?`,
      deleteTooltip: 'Hapus toples ini',
      dayOfTarget: (day: number, target: number) => `Hari ke-${day} dari ${target}`,
      capacityLabel: 'Kapasitas',
      organicLabel: 'Organik',
      logLabel: 'Log',
      setActiveBtn: 'Jadikan Toples Aktif',
      closeBtn: 'Tutup'
    },
    createJarModal: {
      newJarBadge: 'Toples Baru',
      pointsBadge: '+50 Poin',
      title: 'Mulai Toples Fermentasi Baru',
      nameLabel: 'Nama Toples Fermentasi:',
      namePlaceholder: 'Contoh: Toples Nanas & Jeruk 5A',
      defaultName: 'Toples Baru Ceria',
      defaultIngredients: 'Kulit Jeruk, Kulit Pepaya, Kulit Pisang',
      presetNames: [
        'Toples Sitrus Segar',
        'Toples Nanas & Apel Ceria',
        'Toples Tropis Sekolah',
        'Toples Sayur Organik Hebat'
      ],
      capacityLabel: 'Kapasitas Wadah Toples (Liter):',
      literUnit: 'Liter',
      goldenFormulaTitle: 'Takaran Formula Emas 1:3:10',
      safeLimitBadge: 'Aman 2/3 Wadah',
      part1Sugar: '1 Bagian Gula',
      molassesPalm: 'Molase / Aren',
      part3Organic: '3 Bagian Organik',
      fruitVegPeels: 'Kulit Buah/Sayur',
      part10Water: '10 Bagian Air',
      cleanWellWater: 'Air Bersih/Sumur',
      safeTotalNotePrefix: 'Total cairan aman:',
      safeTotalNoteSuffix: '(sisakan 1/3 ruang kosong di atas untuk sirkulasi gas).',
      ingredientsLabel: 'Daftar Bahan Kulit Buah / Sayur Awal:',
      ingredientsPlaceholder: 'Contoh: Kulit jeruk, nanas, pisang...',
      startDateLabel: 'Tanggal Mulai Fermentasi:',
      submitBtn: 'Simpan & Aktifkan Toples Ini',
      reminderSectionTitle: 'Pengingat & Alarm Toples',
      reminderSectionBadge: 'Konsep Alarm',
      reminderSectionDesc: 'Ingatkan jadwal rilis gas dan observasi rutin sesuai keinginanmu.',
      defaultAlarmLabel: 'Rilis Gas & Cek Aroma',
      addAlarmBtn: '+ Tambah Alarm Baru',
      alarmLabelPlaceholder: 'Label alarm (misal: Cek Gas)',
      unitMinutes: 'Menit',
      unitHours: 'Jam',
      unitDays: 'Hari',
      preset5Min: '⚡ 5 Menit (Demo)',
      preset30Min: '⚡ 30 Menit',
      preset2Days: '📅 2 Hari (Disarankan)',
      preset7Days: '📅 7 Hari',
      deleteAlarmTooltip: 'Hapus alarm',
      toggleAlarmTooltip: 'Aktifkan/Nonaktifkan'
    },
    notificationsModal: {
      title: 'Pusat Pengingat & Alarm',
      subtitle: 'Pantau jadwal observasi dan pelepasan gas toplesmu',
      activeBadge: 'Aktif',
      permissionBannerTitle: 'Notifikasi Layar & Suara',
      permissionBannerDesc: 'Izinkan browser agar alarm tetap muncul sebagai pop-up saat waktunya tiba.',
      allowPermissionBtn: 'Aktifkan Notifikasi Browser',
      testNotificationBtn: '🔔 Uji Coba Suara & Notifikasi',
      activeAlarmsTitle: 'Daftar Alarm & Pengingat Toples',
      noAlarmsText: 'Semua aman! Tidak ada alarm yang jatuh tempo saat ini.',
      dueNowBadge: 'WAKTUNYA CEK!',
      observeBtn: 'Observasi Sekarang',
      snoozeBtn: 'Tunda 10 Mnt',
      clearAllBtn: 'Tandai Semua Selesai',
      closeBtn: 'Tutup',
      permissionGranted: 'Notifikasi browser telah diizinkan ✅'
    },
    tour: {
      welcomeTitle: 'Selamat Datang di Enzymo!',
      welcomeDesc:
        'Ingin mengikuti panduan tur singkat untuk mengenal fitur-fitur penting pembuatan eco-enzyme?',
      startTourBtn: 'Mulai Tur Panduan',
      laterBtn: 'Nanti Saja',
      stepCounter: (curr: number, total: number) => `Langkah ${curr} dari ${total}`,
      skipBtn: 'Lewati',
      prevBtn: 'Sebelumnya',
      nextBtn: 'Lanjut',
      finishBtn: 'Selesai Tur',
      steps: [
        {
          targetId: 'tour-jar-card',
          title: 'Toples Fermentasi Aktif',
          description:
            'Lihat perkembangan toplesmu, umur hari fermentasi, dan pastikan cairan tidak melebihi batas aman 2/3 kapasitas wadah.'
        },
        {
          targetId: 'tour-calculator-card',
          title: 'Kalkulator Takaran 1 : 3 : 10',
          description:
            'Gunakan kalkulator ini untuk menghitung takaran presisi gula merah, sisa kulit buah, dan air sesuai volume toplesmu.'
        },
        {
          targetId: 'tour-mission-card',
          title: 'Misi & Observasi Harian',
          description:
            'Setiap hari, buka toples perlahan untuk merilis gas, lalu catat warna, aroma, dan jamur di kartu observasi harian.'
        },
        {
          targetId: 'tour-scanner-button',
          title: 'AI Camera Scanner',
          description:
            'Pindai sisa kulit buah atau sayur segar menggunakan kamera Edge AI offline untuk memastikan bahan layak sebelum difermentasi.'
        },
        {
          targetId: 'tour-header-stats',
          title: 'Streak & Poin Kedisiplinan',
          description:
            'Pertahankan streak harian dan raih poin untuk membuka lencana serta membawa kelasmu memimpin klasemen sekolah!'
        }
      ]
    }
  },
  en: {
    header: {
      subtitleBadge: 'Kids',
      tourTooltip: 'Open App Tour Guide',
      langTooltip: 'Switch Language (ID / EN)'
    },
    nav: {
      list: 'Jars',
      home: 'Home',
      scanAi: 'AI Scan',
      observation: 'Observe'
    },
    homeDetail: {
      backToList: 'Back to Jar List',
      switchJar: 'Switch Jar',
      activeJarBadge: 'Active Jar',
      collectionBtn: (count: number) => `Collection (${count})`,
      collectionTooltip: 'View jar collection',
      newJarBtn: 'New Jar',
      newJarTooltip: 'Create a new jar',
      ratioBtn: 'Ratio',
      ratioTooltip: 'View formula ratio',
      safeLimitKept: '2/3 Safe Limit Maintained',
      statusNormal: 'Normal Condition',
      statusNeedsAttention: 'Needs Attention',
      formulaTitle: '1 : 3 : 10 Formula',
      containerWaterRule: 'Container & Water Rule',
      dosageGuideTitle: 'Ingredient Measurement Guide',
      dosageGuideDesc:
        'Handy calculator to determine the exact weight of sugar, fruit peels, and water for a successful fermentation.',
      sugar: 'Sugar',
      fruitScraps: 'Fruit Peels',
      water: 'Water',
      openCalculatorBtn: 'Open Jar Calculator',
      missionTitle: (day: number) => `Day ${day} Observation Mission`,
      missionSubtitle: 'Check the aroma and release gas slowly',
      completedBadge: 'Completed',
      pendingBadge: 'Pending',
      missionDescDone:
        "Today's observation has been logged. Keep the jar tightly sealed.",
      missionDescPending:
        'Record the aroma, color, and surface condition to monitor microbial activity.',
      openObservationRoom: 'Open Observation Hub',
      startObservationToday: "Start Today's Observation",
      studentLeaderboardTag: 'Student Leaderboard',
      rankAndBadges: 'Rankings & Badges',
      schoolSdgMission: 'School SDG mission',
      edgeAiTag: 'Edge AI',
      scanNewMaterial: 'Scan New Material',
      offlineLocalScanner: 'Offline local scanner',
      recentObservationsTitle: 'Recent Observation Logs',
      recordsCount: (count: number) => `${count} ${count === 1 ? 'Log' : 'Logs'}`,
      dayLabel: (day: number) => `Day ${day}`,
      aromaFreshSour: 'Fresh Sour Aroma',
      aromaNormal: 'Normal Aroma',
      surfacePitera: 'Good Pitera Yeast',
      surfaceClean: 'Clean Surface',
      pointsEarned: (pts: number) => `+${pts} Pts`
    },
    landing: {
      miniLabBadge: 'Mini Lab',
      newJarBonusBadge: '+50 Pts New Container',
      heroTitle: 'Fermentation Jar Collection',
      heroDesc:
        'Have fresh fruit peels today? Start a new jar using the golden 1:3:10 Eco-Enzyme formula.',
      startNewJarBtn: 'Create a New Jar',
      tabAll: (count: number) => `All (${count})`,
      tabActive: (count: number) => `Active (${count})`,
      tabCompleted: (count: number) => `Harvested (${count})`,
      activeSectionTitle: 'Jars Currently Fermenting',
      target90Days: '90-Day Target',
      activeBadge: 'Active',
      statusNormal: 'Normal Condition',
      statusCheck: 'Needs Check',
      confirmDeleteActive: (name: string) => `Are you sure you want to delete "${name}"?`,
      deleteTooltip: 'Delete jar',
      dayOfTarget: (day: number, target: number) => `Day ${day} of ${target}`,
      logsCount: (count: number) => `${count}x logs`,
      openJarBtn: 'Open Jar',
      completedSectionTitle: 'Completed & Harvested Jars',
      naturalHarvestBadge: '100% Natural Harvest',
      harvestDoneBadge: 'Harvest Complete (90 Days)',
      confirmDeleteHistory: (name: string) =>
        `Are you sure you want to delete the history for "${name}"?`,
      deleteHistoryTooltip: 'Delete jar history',
      harvestYieldLabel: (ml: number) => `Yield: ${ml} ml Eco-Enzyme Liquid`,
      harvestDateLabel: (date: string) => `Harvested: ${date}`,
      completedFallback: 'Completed',
      containerSummary: (liters: number, grams: number) =>
        `${liters}L Container • ${grams}g Organic`,
      viewHarvestDetails: 'View Harvest Details',
      emptyTabTitle: 'No jars in this tab',
      emptyTabDesc: 'Click "Create a New Jar" above to add a fermentation container.'
    },
    jarIllustration: {
      safeLimitSvg: 'SAFE LIMIT (2/3)',
      gasSpaceSvg: 'Fermentation Gas Space',
      dayBadge: (day: number) => `Day ${day}`,
      harvestJourney: 'Harvest Progress',
      day1Start: 'Day 1 (Start)',
      day90Harvest: '90 Days (Natural Harvest)'
    },
    scanner: {
      title: 'AI Camera Scanner',
      subtitle: 'Offline local processing',
      dosageGuideBtn: 'Measurement Guide',
      cameraReadyDesc:
        'Camera ready to detect. Select a sample material below to test local Edge AI classification.',
      cameraErrorFallback: 'Camera inactive / offline simulation mode active',
      detectionArea: 'Material Detection Area',
      precisionLabel: (pct: number) => `${pct}% Confidence`,
      conditionLabel: 'Condition:',
      catFreshFruit: 'Fresh Fruit Peel',
      catFreshVeg: 'Fresh Vegetable',
      catSpoiled: 'Spoiled / Moldy',
      catOther: 'Non-Organic',
      recommendationLabel: 'Recommendation: ',
      startWithMaterialBtn: 'Start Fermentation with This Material',
      invalidMaterialMsg: 'This material is not suitable for fermentation.',
      sampleTestLabel: 'Test Material Samples:',
      verifiedBadge: 'Verified Material',
      pointsBadge: '+30 Pts',
      estimatedWeightMsg: (grams: number) =>
        `Estimated weight: ~${grams} grams. This material is safe to add to your fermentation jar.`,
      calcWaterSugarBtn: 'Calculate Water & Sugar (1:3:10 Guide)',
      saveAndHomeBtn: 'Save & Return Home'
    },
    observation: {
      dailyScheduleBadge: 'Daily Observation Schedule',
      centerTitle: 'Observation & Monitoring Hub',
      centerDescPrefix: 'Monitor the condition of',
      centerDescSuffix: 'today with AI Enzy.',
      threeStepsTitle: '3 Safe Observation Steps with an Adult:',
      step1Title: 'Listen for Gas Hissing',
      step1Desc:
        'Unscrew the lid slowly. Listen for a gentle hiss or pop from active microbial gas.',
      step2Title: 'Smell the Aroma',
      step2Desc:
        'Waft the scent gently without touching the liquid. Check if it smells fresh sour, sweet, or foul.',
      step3Title: 'Inspect Color & Surface',
      step3Desc:
        'Check the liquid color change and make sure there is no black or green fuzzy mold.',
      doneTitle: (day: number) => `Day ${day} Observation Completed`,
      doneDesc:
        'Your jar has been logged today and stays tightly sealed for optimal microbial activity.',
      viewFormBtn: 'View Observation Form',
      resetDemoBtn: 'Reset Demo',
      resetDemoTooltip: 'Reset demo status',
      startFormBtn: 'Fill Out Observation Card Now',
      oncePerDayNote: 'Limited to once per day to keep container fermentation stable',
      backToGuide: 'Back to Guide',
      dayTag: (day: number) => `Day ${day}`,
      formTitle: 'Visual Observation Form',
      formSubtitle: "Select the conditions that match today's jar inspection.",
      var1Label: '1. Fermentation Liquid Color',
      var2Label: '2. Detected Aroma',
      var3Label: '3. Liquid Surface Condition',
      var4Label: '4. Gas Pressure When Opening Lid',
      needsCheckBadge: 'Needs Check',
      submitBtn: 'Submit Observation to AI Enzy',
      colors: {
        bening_kuning: { label: 'Clear Yellow', desc: 'Early fermentation stage' },
        oranye_cokelat: { label: 'Amber Orange', desc: 'Ideal healthy color' },
        cokelat_tua: { label: 'Dark Brown', desc: 'Mature molasses stage' }
      } as Record<FermentColor, { label: string; desc: string }>,
      aromas: {
        asam_segar: { label: 'Fresh Sour', desc: 'Signature Eco-Enzyme scent' },
        manis: { label: 'Sweet Sugar', desc: 'Sugar not fully broken down' },
        alkohol: { label: 'Alcoholic', desc: 'Strong fermentation scent' },
        busuk: { label: 'Foul / Rotten', desc: 'Warning! Adult help needed' }
      } as Record<FermentAroma, { label: string; desc: string }>,
      surfaces: {
        bersih: { label: 'Clean Surface', desc: 'Clear natural liquid' },
        putih_tipis: { label: 'Thin White Layer', desc: 'Pitera yeast (Healthy!)' },
        jamur_berbulu: { label: 'Colored Fuzzy Mold', desc: 'Green/black/red mold' }
      } as Record<FermentSurface, { label: string; desc: string }>,
      gases: {
        banyak: { label: 'Strong Gas', desc: 'Loud hiss when opened' },
        sedikit: { label: 'Mild Gas', desc: 'Gentle pop sound' },
        tidak_ada: { label: 'No Gas', desc: 'Calm without hissing' }
      } as Record<FermentGas, { label: string; desc: string }>
    },
    feedbackModal: {
      statusBadges: {
        normal: 'Normal & Healthy Condition',
        observe: 'Needs Further Observation',
        attention: 'Requires Special Attention',
        failed: 'Contamination Detected'
      },
      adultSafetyTitle: 'Adult Supervision Safety Instructions:',
      advicePrefix: 'Advice: ',
      pointsAdded: (pts: number) => `+${pts} Discipline Points Added`,
      backToDashboard: 'Back to Dashboard'
    },
    calculatorModal: {
      title: '1 : 3 : 10 Formula Calculator',
      subtitle: 'Measurement Guide & Safe Jar Limit',
      scannedMaterialNote: 'From AI Scan:',
      capacityLabel: 'Jar Container Capacity:',
      literUnit: 'Liters',
      customLabel: 'Custom:',
      safeLimitTitle: 'Maximum 2/3 Container Limit Rule',
      safeLimitDesc: (maxLiters: number) =>
        `Maximum total mixture of water & ingredients is ${maxLiters} Liters. Leave 1/3 empty space at the top for gas circulation so it won't overflow or burst.`,
      sugarTitle: 'Brown Sugar / Molasses',
      sugarDesc: '1 Part (food for microbes)',
      organicTitle: 'Fruit Peels / Veggie Scraps',
      organicDesc: '3 Parts (raw & clean)',
      waterTitle: 'Non-Chlorinated Clean Water',
      waterDesc: '10 Parts (well/filtered water)',
      closeBtn: 'Close Guide'
    },
    badgesModal: {
      title: 'Achievements & School Leaderboard',
      subtitle: 'Environmental SDG & Discipline Mission',
      wasteProcessed: 'Waste Upcycled',
      daysUnit: (d: number) => `${d} Days`,
      disciplineStreak: 'Discipline Streak',
      totalPoints: 'Total Points',
      disciplineBadges: 'Discipline Badges',
      unlocked: 'Unlocked',
      locked: 'Locked',
      schoolLeaderboardTitle: 'School Jar Leaderboard',
      organicUnit: 'kg organic',
      closeBtn: 'Close',
      leaderboardClasses: [
        'Class 5B - Sweet Orange Team',
        'Class 5A - Super Enzy Team (You)',
        'Class 4C - Compost Warriors',
        'Class 6A - Fruit Detectives'
      ]
    },
    jarListModal: {
      collectionBadge: 'Container Collection',
      totalJars: (count: number) => `Total: ${count} Jars`,
      title: 'Fermentation Jar List',
      addNewJarBtn: 'Add New Jar',
      activeBadge: 'Active',
      fallbackIngredients: 'Mixed organic materials',
      confirmDelete: (name: string) => `Are you sure you want to delete "${name}"?`,
      deleteTooltip: 'Delete this jar',
      dayOfTarget: (day: number, target: number) => `Day ${day} of ${target}`,
      capacityLabel: 'Capacity',
      organicLabel: 'Organic',
      logLabel: 'Logs',
      setActiveBtn: 'Set as Active Jar',
      closeBtn: 'Close'
    },
    createJarModal: {
      newJarBadge: 'New Jar',
      pointsBadge: '+50 Pts',
      title: 'Start a New Fermentation Jar',
      nameLabel: 'Fermentation Jar Name:',
      namePlaceholder: 'e.g., Class 5A Pineapple & Orange Jar',
      defaultName: 'Cheerful New Jar',
      defaultIngredients: 'Orange Peels, Papaya Peels, Banana Peels',
      presetNames: [
        'Fresh Citrus Jar',
        'Cheerful Pineapple & Apple Jar',
        'School Tropical Jar',
        'Super Organic Veggie Jar'
      ],
      capacityLabel: 'Jar Container Capacity (Liters):',
      literUnit: 'Liters',
      goldenFormulaTitle: '1:3:10 Golden Formula Ratio',
      safeLimitBadge: '2/3 Safe Limit',
      part1Sugar: '1 Part Sugar',
      molassesPalm: 'Molasses / Palm Sugar',
      part3Organic: '3 Parts Organic',
      fruitVegPeels: 'Fruit/Veggie Peels',
      part10Water: '10 Parts Water',
      cleanWellWater: 'Clean/Filtered Water',
      safeTotalNotePrefix: 'Safe liquid volume:',
      safeTotalNoteSuffix: '(leave 1/3 empty space at the top for gas circulation).',
      ingredientsLabel: 'Initial Fruit Peels / Vegetable Scraps:',
      ingredientsPlaceholder: 'e.g., Orange peels, pineapple, banana...',
      startDateLabel: 'Fermentation Start Date:',
      submitBtn: 'Save & Activate This Jar',
      reminderSectionTitle: 'Jar Alarms & Reminders',
      reminderSectionBadge: 'Alarm Concept',
      reminderSectionDesc: 'Get reminded for degassing and routine checks whenever you want.',
      defaultAlarmLabel: 'Gas Release & Aroma Check',
      addAlarmBtn: '+ Add New Alarm',
      alarmLabelPlaceholder: 'Alarm label (e.g. Gas Check)',
      unitMinutes: 'Mins',
      unitHours: 'Hours',
      unitDays: 'Days',
      preset5Min: '⚡ 5 Mins (Demo)',
      preset30Min: '⚡ 30 Mins',
      preset2Days: '📅 2 Days (Default)',
      preset7Days: '📅 7 Days',
      deleteAlarmTooltip: 'Delete alarm',
      toggleAlarmTooltip: 'Enable/Disable'
    },
    notificationsModal: {
      title: 'Reminder & Alarm Center',
      subtitle: 'Track scheduled observations and jar degassing times',
      activeBadge: 'Active',
      permissionBannerTitle: 'Screen & Sound Alerts',
      permissionBannerDesc: 'Allow browser notifications so alarms alert you on your device.',
      allowPermissionBtn: 'Enable Browser Notifications',
      testNotificationBtn: '🔔 Test Sound & Notification',
      activeAlarmsTitle: 'Jar Reminders & Alarms',
      noAlarmsText: 'All good! No alarms due right now.',
      dueNowBadge: 'DUE NOW!',
      observeBtn: 'Observe Now',
      snoozeBtn: 'Snooze 10m',
      clearAllBtn: 'Mark All Done',
      closeBtn: 'Close',
      permissionGranted: 'Browser notifications are enabled ✅'
    },
    tour: {
      welcomeTitle: 'Welcome to Enzymo!',
      welcomeDesc:
        'Would you like to take a quick guided tour to explore the key features for making Eco-Enzyme?',
      startTourBtn: 'Start Guided Tour',
      laterBtn: 'Maybe Later',
      stepCounter: (curr: number, total: number) => `Step ${curr} of ${total}`,
      skipBtn: 'Skip',
      prevBtn: 'Previous',
      nextBtn: 'Next',
      finishBtn: 'Finish Tour',
      steps: [
        {
          targetId: 'tour-jar-card',
          title: 'Active Fermentation Jar',
          description:
            'Track your jar progress, fermentation day age, and make sure the liquid stays within the safe 2/3 container limit.'
        },
        {
          targetId: 'tour-calculator-card',
          title: '1 : 3 : 10 Ratio Calculator',
          description:
            'Use this calculator to find the exact measurements of brown sugar, fruit peels, and water for your jar size.'
        },
        {
          targetId: 'tour-mission-card',
          title: 'Daily Mission & Observation',
          description:
            'Each day, slowly burp the jar lid to release gas, then log the color, aroma, and surface condition on your observation card.'
        },
        {
          targetId: 'tour-scanner-button',
          title: 'AI Camera Scanner',
          description:
            'Scan leftover fruit peels or fresh vegetables using the offline Edge AI camera to verify they are safe to ferment.'
        },
        {
          targetId: 'tour-header-stats',
          title: 'Daily Streak & Discipline Points',
          description:
            'Keep up your daily streak and earn points to unlock badges and lead your class to the top of the school leaderboard!'
        }
      ]
    }
  }
} as const;
