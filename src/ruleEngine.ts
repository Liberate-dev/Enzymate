import {
  FermentColor,
  FermentAroma,
  FermentSurface,
  FermentGas,
  FermentStatus,
  MaterialCategory,
  ScannedMaterial
} from './types';

export interface EvaluationResult {
  status: FermentStatus;
  headline: string;
  feedback: string;
  mascotMood: 'happy' | 'thoughtful' | 'warning' | 'danger';
  requiresAdult: boolean;
  actionAdvice: string;
  points: number;
}

/**
 * 100% Offline Edge AI Rule-Based Engine
 * Evaluasi kondisi fermentasi eco-enzyme berdasarkan input observasi anak
 */
export function evaluateObservation(
  dayNumber: number,
  color: FermentColor,
  aroma: FermentAroma,
  surface: FermentSurface,
  gas: FermentGas
): EvaluationResult {
  // 1. Check CRITICAL FAILURE conditions first (Aroma busuk ATAU Jamur berbulu hitam/hijau/warna)
  if (surface === 'jamur_berbulu' || aroma === 'busuk') {
    return {
      status: 'failed',
      headline: 'Stop! Perlu Bantuan Pendamping',
      feedback:
        'Halo Sahabat Enzy! Terdeteksi aroma busuk atau jamur berbulu. Jangan bersedih, ini bagian dari belajar sains alam. Panggil guru atau orang tua sekarang ya!',
      mascotMood: 'danger',
      requiresAdult: true,
      actionAdvice:
        'PERINGATAN KESELAMATAN: Anak dilarang menyentuh jamur langsung atau membuang air toples. Mohon Pendamping Dewasa memeriksa wadah dan membersihkannya.',
      points: 10 // Tetap beri apresiasi karena jujur mengamati
    };
  }

  // 2. Check WARNING conditions (Aroma alkohol menyengat ATAU gas berlebih di toples)
  if (aroma === 'alkohol') {
    return {
      status: 'attention',
      headline: 'Aroma Alkohol Sedang Kuat!',
      feedback:
        'Fermentasi sedang aktif membentuk alkohol alami! Jangan khawatir, buka tutup toples perlahan sebentar untuk membuang gas, lalu tutup kembali rapat-rapat.',
      mascotMood: 'warning',
      requiresAdult: false,
      actionAdvice:
        'Pastikan toples berada di tempat teduh bersuhu ruang (tidak terkena sinar matahari langsung). Minta bantuan orang tua jika tutup toples terasa terlalu keras.',
      points: 25
    };
  }

  // 3. Check NEED OBSERVATION (Warna belum banyak berubah padahal sudah fase lanjutan, atau gas tidak ada di bulan pertama)
  if (dayNumber <= 30 && gas === 'tidak_ada' && aroma === 'manis') {
    return {
      status: 'observe',
      headline: 'Bakteri Baik Masih Bangun Tidur',
      feedback:
        'Belum ada desisan gas dan aromanya masih manis gula. Ini normal di awal! Aduk atau goyangkan toples perlahan dengan tutup tertutup rapat ya.',
      mascotMood: 'thoughtful',
      requiresAdult: false,
      actionAdvice:
        'Cek apakah toples tertutup kedap udara dan tersimpan di ruangan yang tidak terlalu dingin.',
      points: 25
    };
  }

  // 4. NORMAL HEALTHY FERMENTATION
  let normalFeedback = 'Hebat! Fermentasi toplesmu berkembang sangat baik.';
  if (surface === 'putih_tipis') {
    normalFeedback =
      'Keren sekali! Muncul lapisan putih tipis (jamur pitera/ragi baik). Ini tanda mikroorganisme eco-enzyme sedang bekerja gembira!';
  } else if (aroma === 'asam_segar') {
    normalFeedback =
      'Wah, aroma asam segar mulai tercium wangi! Ragi dan bakteri baik sukses mengubah sisa buah menjadi enzim bermanfaat.';
  }

  return {
    status: 'normal',
    headline: 'Fermentasi Berjalan Sempurna!',
    feedback: normalFeedback,
    mascotMood: 'happy',
    requiresAdult: false,
    actionAdvice:
      'Lanjutkan jadwal observasi berikutnya dan pastikan wadah tetap tersimpan di sudut bersih dan teduh.',
    points: 50
  };
}

/**
 * Simulasi klasifikasi citra bahan Edge AI (Offline)
 */
export const SAMPLE_SCAN_PRESETS: ScannedMaterial[] = [
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

/**
 * Kalkulator Rasio Formula Emas Eco-Enzyme:
 * 1 Bagian Gula Merah/Molase : 3 Bagian Bahan Organik : 10 Bagian Air
 * Aturan Safety: Maksimal 2/3 kapasitas wadah agar ruang gas fermentasi aman.
 */
export function calculateEcoEnzymeRecipe(containerVolumeLiters: number) {
  // Maksimal 2/3 kapasitas wadah
  const maxSafeVolumeLiters = containerVolumeLiters * (2 / 3);
  
  // Total 14 unit formula: (1 + 3 + 10) = 14
  // 10 liter air = 10 unit = 10 kg
  // 3 kg organik = 3 unit
  // 1 kg gula = 1 unit
  // Volume campuran kira-kira sebanding dengan rasio air
  const airVolumeLiter = Number((maxSafeVolumeLiters * (10 / 14)).toFixed(2));
  const airMl = Math.round(airVolumeLiter * 1000);
  const organikGram = Math.round(airMl * 0.3); // 3 bagian terhadap 10 bagian air
  const gulaGram = Math.round(airMl * 0.1); // 1 bagian terhadap 10 bagian air

  return {
    containerVolumeLiters,
    maxSafeVolumeLiters: Number(maxSafeVolumeLiters.toFixed(2)),
    gulaGram,
    organikGram,
    airMl,
    rasioText: '1 Bagian Gula : 3 Bagian Organik : 10 Bagian Air',
    safetyWarning: 'Sisakan 1/3 ruang toples kosong di bagian atas untuk sirkulasi gas pemekaran!'
  };
}
