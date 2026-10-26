import {
  JarData,
  JarReminder,
  ReminderUnit,
  ProcedureType,
  ProcedureGuide
} from './types';

export const UNIT_MULTIPLIERS: Record<ReminderUnit, number> = {
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000
};

export const ECO_ENZYME_PROCEDURES_ID: Record<ProcedureType, ProcedureGuide> = {
  degas: {
    type: 'degas',
    title: 'Pelepasan Gas (Degassing / Buka Tutup Sedikit)',
    badge: 'Fase Gas Aktif (Bulan 1)',
    description: 'Buka tutup wadah sedikit saja untuk membuang desisan gas agar toples tidak meledak.',
    instructions: [
      'Posisikan toples di atas meja datar, jauhkan wajah dari arah mulut tutup.',
      'Putar tutup toples perlahan 1/4 - 1/2 putaran hingga terdengar desisan gas ("ssshh").',
      'Tahan sebentar hingga desisan gas berhenti sempurna.',
      'JANGAN buka tutup seluruhnya agar oksigen luar tidak masuk dan merusak bakteri anaerob.',
      'Kencangkan kembali tutup toples hingga benar-benar kedap udara.'
    ],
    safetyWarning: 'Waspada desisan gas bertekanan! Jangan mengguncang toples sebelum membuka tutup.',
    recommendedInterval: { value: 2, unit: 'days' }
  },
  submerge_stir: {
    type: 'submerge_stir',
    title: 'Tenggelamkan & Aduk Lembut Kulit Buah',
    badge: 'Minggu 1-2 (Perendaman)',
    description: 'Dorong kulit buah yang mengapung ke dasar cairan agar seluruhnya basah dan tidak tumbuh jamur hitam.',
    instructions: [
      'Siapkan sendok pengaduk bersih berbahan kayu atau plastik (hindari peralatan logam/besi).',
      'Buka tutup toples, tekan perlahan potongan kulit buah yang mengambang ke bawah air larutan gula.',
      'Aduk perlahan 1 arah selama 5-10 detik agar nutrisi gula merata ke seluruh bahan.',
      'Pastikan tidak ada bahan yang menempel kering di dinding atas toples.',
      'Segera tutup rapat kembali toples dengan rapat.'
    ],
    safetyWarning: 'Pastikan tangan dan alat pengaduk higienis bebas sabun, minyak, dan bumbu masakan.',
    recommendedInterval: { value: 5, unit: 'days' }
  },
  check_mold: {
    type: 'check_mold',
    title: 'Periksa Lapisan Jamur Pitera (Ragi Baik)',
    badge: 'Kesehatan Fermentasi',
    description: 'Amati dari luar toples menggunakan senter untuk memeriksa apakah koloni ragi putih aktif.',
    instructions: [
      'Nyalakan lampu senter HP dan sorot permukaan cairan DARI LUAR toples (JANGAN buka tutup).',
      'Periksa apakah ada lapisan putih tipis lembut (itu adalah jamur Pitera / ragi baik, tanda fermentasi sehat).',
      'Pastikan TIDAK ADA bintik berbulu hitam, hijau, atau lendir berbau busuk bangkai.',
      'Jika permukaan bersih atau putih tipis, toples dalam kondisi prima dan biarkan tenang.'
    ],
    safetyWarning: 'Hindari membuka toples hanya untuk melihat-lihat, agar udara luar tidak mengkontaminasi.',
    recommendedInterval: { value: 7, unit: 'days' }
  },
  inspect_seal: {
    type: 'inspect_seal',
    title: 'Cek Kerapatan Segel & Suhu Ruang Teduh',
    badge: 'Penyimpanan Stabil (Bulan 2-3)',
    description: 'Pastikan toples terhindar dari semut/lalat dan tersimpan di lokasi teduh tidak terpapar panas.',
    instructions: [
      'Periksa sekeliling ulir tutup toples, pastikan tidak ada semut, lalat, atau celah udara.',
      'Pastikan wadah diletakkan di tempat teduh, bersuhu ruang (25-35°C), dan berventilasi baik.',
      'Jauhkan dari paparan sinar matahari langsung, kompor dapur, atau zat kimia berbau tajam.',
      'Lap bagian luar toples dengan kain bersih jika berdebu.'
    ],
    safetyWarning: 'Sinar matahari langsung dapat membunuh mikroba eco-enzyme dan merusak cairan.',
    recommendedInterval: { value: 14, unit: 'days' }
  },
  harvest_prep: {
    type: 'harvest_prep',
    title: 'Uji Kematangan Enzim & Panen (H-90)',
    badge: 'Fase Panen Siap',
    description: 'Pengujian kualitas cairan eco-enzyme matang setelah genap 90 hari fermentasi.',
    instructions: [
      'Buka toples dan cium aromanya (harus wangi asam segar cuka buah, bukan bau busuk got).',
      'Warna cairan yang ideal adalah cokelat tua jernih atau oranye kemerahan matang.',
      'Siapkan kain saringan bersih, corong plastik, dan botol-botol penyimpanan.',
      'Saring cairan enzim, masukkan ke botol tertutup, dan gunakan sisa ampas untuk pupuk tanaman.'
    ],
    safetyWarning: 'Gunakan botol berbahan plastik untuk penyimpanan hasil panen (jangan gunakan botol kaca rapuh).',
    recommendedInterval: { value: 30, unit: 'days' }
  },
  custom: {
    type: 'custom',
    title: 'Prosedur Kustom Mandiri',
    badge: 'Kustom Pengguna',
    description: 'Langkah pengingat dan pengecekan spesifik yang kamu tentukan sendiri.',
    instructions: [
      'Lakukan langkah pemeriksaan dan tindakan sesuai kebutuhan toplesmu.'
    ],
    recommendedInterval: { value: 2, unit: 'days' }
  }
};

export const ECO_ENZYME_PROCEDURES_EN: Record<ProcedureType, ProcedureGuide> = {
  degas: {
    type: 'degas',
    title: 'Gas Release Procedure (Degassing / Crack Lid Open)',
    badge: 'Active Gas Phase (Month 1)',
    description: 'Crack open the lid slightly to release accumulated fermentation gas so the jar does not burst.',
    instructions: [
      'Place the jar on a flat surface, facing away from your face.',
      'Slowly twist the lid 1/4 to 1/2 turn until you hear the gas hissing ("ssshh").',
      'Hold in place until the hissing completely stops.',
      'DO NOT open the lid all the way, preventing external oxygen from disrupting anaerobic bacteria.',
      'Firmly tighten the lid back down to keep it 100% airtight.'
    ],
    safetyWarning: 'Beware of built-up pressure! Never shake the jar prior to cracking the lid.',
    recommendedInterval: { value: 2, unit: 'days' }
  },
  submerge_stir: {
    type: 'submerge_stir',
    title: 'Submerge & Gently Stir Peels',
    badge: 'Weeks 1-2 (Submerging)',
    description: 'Push floating fruit scraps under the sugar solution so they stay moist and do not develop black mold.',
    instructions: [
      'Use a clean wooden or plastic utensil (avoid metal/iron spoons).',
      'Open the lid briefly and gently push floating peels down below the liquid surface.',
      'Stir clockwise slowly for 5-10 seconds to distribute dissolved sugar evenly.',
      'Ensure no dry peels remain stuck above the waterline on the container wall.',
      'Immediately seal the lid back tightly.'
    ],
    safetyWarning: 'Ensure hands and stirring tools are sterile and free from soap, grease, or food seasoning.',
    recommendedInterval: { value: 5, unit: 'days' }
  },
  check_mold: {
    type: 'check_mold',
    title: 'Inspect Pitera Yeast Film (Good Yeast)',
    badge: 'Fermentation Health',
    description: 'Observe from outside the jar using a flashlight to verify healthy white yeast colony growth.',
    instructions: [
      'Shine a flashlight beam THROUGH the container wall (DO NOT open the lid).',
      'Look for a thin white powdery film on top (this is Pitera yeast, a sign of excellent fermentation).',
      'Verify there are NO black/green hairy molds or foul decomposing smells.',
      'If the surface is clean or shows a white film, your jar is healthy; keep it undisturbed.'
    ],
    safetyWarning: 'Avoid opening the jar just to peek inside, maintaining the anaerobic headspace.',
    recommendedInterval: { value: 7, unit: 'days' }
  },
  inspect_seal: {
    type: 'inspect_seal',
    title: 'Inspect Airtight Seal & Dark Storage Spot',
    badge: 'Maturation Phase (Month 2-3)',
    description: 'Ensure the jar is protected against insect intrusion and kept in a cool, ventilated, dark location.',
    instructions: [
      'Inspect the lid rim and rubber gasket; ensure no ants or fruit flies can enter.',
      'Make sure the jar stays in a shaded area at room temperature (25-35°C / 77-95°F).',
      'Keep away from direct sunlight, hot stoves, or strong chemical odors.',
      'Wipe down the outside of the container with a clean cloth if dusty.'
    ],
    safetyWarning: 'Direct sunlight can kill beneficial eco-enzyme microbes and spoil the batch.',
    recommendedInterval: { value: 14, unit: 'days' }
  },
  harvest_prep: {
    type: 'harvest_prep',
    title: 'Enzyme Ripeness Test & Harvest (Day 90)',
    badge: 'Harvest Ready',
    description: 'Evaluate ripeness and filter eco-enzyme liquid after the 90-day tropical fermentation cycle.',
    instructions: [
      'Open the jar and smell the aroma (should be delightfully fruity-vinegary, pH < 4.0).',
      'The liquid color should be clear amber-brown or rich reddish-orange.',
      'Prepare a clean filter cloth, a plastic funnel, and clean plastic storage bottles.',
      'Strain the enzyme liquid into bottles, and reuse the solid pulp residues as garden compost.'
    ],
    safetyWarning: 'Use plastic bottles for long-term storage (avoid fragile glass that may crack).',
    recommendedInterval: { value: 30, unit: 'days' }
  },
  custom: {
    type: 'custom',
    title: 'Custom Self-Defined Procedure',
    badge: 'Custom',
    description: 'Custom steps and checks defined by yourself.',
    instructions: [
      'Carry out your custom check steps as noted.'
    ],
    recommendedInterval: { value: 2, unit: 'days' }
  }
};

export function getProcedureGuide(type: ProcedureType, lang: 'id' | 'en' = 'id'): ProcedureGuide {
  const table = lang === 'en' ? ECO_ENZYME_PROCEDURES_EN : ECO_ENZYME_PROCEDURES_ID;
  return table[type] || table.degas;
}

export function getAllProcedures(lang: 'id' | 'en' = 'id'): ProcedureGuide[] {
  const table = lang === 'en' ? ECO_ENZYME_PROCEDURES_EN : ECO_ENZYME_PROCEDURES_ID;
  return Object.values(table);
}

/**
 * Menentukan prosedur baku Eco-Enzyme secara dinamis dan adaptif berdasarkan usia toples
 */
export function getProcedureForJar(jar: JarData, lang: 'id' | 'en' = 'id'): ProcedureGuide {
  const latestObs = jar.observations && jar.observations[0];
  let currentDay = latestObs ? latestObs.dayNumber : 1;

  if (!latestObs && jar.startDate) {
    const startMs = new Date(jar.startDate).getTime();
    const nowMs = Date.now();
    const diffDays = Math.max(1, Math.floor((nowMs - startMs) / (24 * 60 * 60 * 1000)) + 1);
    currentDay = diffDays;
  }

  const targetDays = jar.targetDays || 90;

  if (currentDay >= targetDays) {
    return getProcedureGuide('harvest_prep', lang);
  } else if (currentDay > 60) {
    return getProcedureGuide('inspect_seal', lang);
  } else if (currentDay > 30) {
    return getProcedureGuide('check_mold', lang);
  } else {
    // Hari 1 - 30: Fase Gas Aktif (Degassing)
    return getProcedureGuide('degas', lang);
  }
}

/**
 * Menghitung waktu trigger berikutnya dari nilai dan unit
 */
export function calculateNextTrigger(
  value: number,
  unit: ReminderUnit,
  fromDate: Date = new Date()
): Date {
  const safeValue = Math.max(1, value);
  const ms = safeValue * UNIT_MULTIPLIERS[unit];
  return new Date(fromDate.getTime() + ms);
}

/**
 * Membuat reminder default untuk toples baru dengan prosedur spesifik
 */
export function createDefaultReminder(
  label?: string,
  value?: number,
  unit?: ReminderUnit,
  procedureType: ProcedureType = 'degas',
  lang: 'id' | 'en' = 'id'
): JarReminder {
  const guide = getProcedureGuide(procedureType, lang);
  const resolvedValue = value ?? guide.recommendedInterval.value;
  const resolvedUnit = unit ?? guide.recommendedInterval.unit;
  const resolvedLabel = label || guide.title;
  const nextDate = calculateNextTrigger(resolvedValue, resolvedUnit);

  return {
    id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: resolvedLabel,
    value: resolvedValue,
    unit: resolvedUnit,
    enabled: true,
    createdAt: new Date().toISOString(),
    nextTriggerAt: nextDate.toISOString(),
    isRecurring: true,
    procedureType,
    instructions: guide.instructions,
    safetyWarning: guide.safetyWarning
  };
}

/**
 * Format sisa waktu menuju alarm untuk UI yang ramah pengguna
 */
export function formatTimeRemaining(nextTriggerIso: string, lang: 'id' | 'en' = 'id'): {
  text: string;
  isDue: boolean;
  isOverdue: boolean;
} {
  const now = Date.now();
  const target = new Date(nextTriggerIso).getTime();
  const diffMs = target - now;

  if (diffMs <= 0) {
    const overdueMinutes = Math.floor(Math.abs(diffMs) / (60 * 1000));
    if (overdueMinutes < 60) {
      return {
        text: lang === 'en' ? `Due now (${overdueMinutes}m ago)` : `Waktunya jalankan prosedur! (${overdueMinutes} mnt lalu)`,
        isDue: true,
        isOverdue: overdueMinutes > 0
      };
    }
    const overdueHours = Math.floor(overdueMinutes / 60);
    if (overdueHours < 24) {
      return {
        text: lang === 'en' ? `Overdue by ${overdueHours}h` : `Terlewat ${overdueHours} jam`,
        isDue: true,
        isOverdue: true
      };
    }
    const overdueDays = Math.floor(overdueHours / 24);
    return {
      text: lang === 'en' ? `Overdue by ${overdueDays}d` : `Terlewat ${overdueDays} hari`,
      isDue: true,
      isOverdue: true
    };
  }

  // Masih ada waktu
  const remainingMinutes = Math.ceil(diffMs / (60 * 1000));
  if (remainingMinutes < 60) {
    return {
      text: lang === 'en' ? `${remainingMinutes} min left` : `${remainingMinutes} menit lagi`,
      isDue: false,
      isOverdue: false
    };
  }

  const remainingHours = Math.floor(remainingMinutes / 60);
  if (remainingHours < 24) {
    const mins = remainingMinutes % 60;
    return {
      text: lang === 'en' 
        ? `${remainingHours}h ${mins > 0 ? `${mins}m` : ''} left` 
        : `${remainingHours} jam ${mins > 0 ? `${mins} mnt` : ''} lagi`,
      isDue: false,
      isOverdue: false
    };
  }

  const remainingDays = Math.floor(remainingHours / 24);
  return {
    text: lang === 'en' ? `${remainingDays} days left` : `${remainingDays} hari lagi`,
    isDue: false,
    isOverdue: false
  };
}

/**
 * Memeriksa seluruh toples untuk menemukan alarm yang sudah jatuh tempo
 */
export function checkDueReminders(jars: JarData[]): {
  jar: JarData;
  reminder: JarReminder;
}[] {
  const now = Date.now();
  const dueItems: { jar: JarData; reminder: JarReminder }[] = [];

  for (const jar of jars) {
    if (jar.isCompleted) continue;
    if (!jar.reminders || jar.reminders.length === 0) continue;

    for (const reminder of jar.reminders) {
      if (!reminder.enabled) continue;
      const targetTime = new Date(reminder.nextTriggerAt).getTime();
      if (targetTime <= now) {
        dueItems.push({ jar, reminder });
      }
    }
  }

  return dueItems;
}

/**
 * Meminta izin browser Notification API
 */
export async function requestWebNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Memainkan suara nada lonceng manis menggunakan Web Audio API tanpa file audio eksternal
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (chord C Major)
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.6);
    });
  } catch (e) {
    // Abaikan jika audio di-block oleh browser autoplay policy
  }
}

/**
 * Menembakkan Browser Web Notification & Service Worker dengan konten spesifik prosedur
 * Kompatibel penuh dengan Android Chrome, iOS Safari PWA, dan Desktop.
 */
export function triggerBrowserNotification(
  title: string,
  options?: NotificationOptions
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // 1. Mainkan nada lonceng manis
  playNotificationChime();

  // 2. Getar haptic HP Android
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch (e) {}
  }

  // 3. Dispatch internal custom event untuk Heads-Up Banner Mengambang di Layar HP
  try {
    window.dispatchEvent(
      new CustomEvent('enzymo-heads-up-notification', {
        detail: {
          title,
          body: (options?.body as string) || '',
          icon: '/favicon.ico'
        }
      })
    );
  } catch (e) {}

  // 4. Kirim ke Notification Bar Sistem (Android Notification Tray / Windows Action Center)
  if ('Notification' in window && Notification.permission === 'granted') {
    // Prioritas 1: Service Worker Registration (WAJIB untuk Android Chrome Mobile)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options,
            ...({ vibrate: [200, 100, 200] } as Record<string, unknown>)
          } as NotificationOptions);
        })
        .catch(() => {
          // Fallback jalur constructor jika Service Worker belum ready
          try {
            new Notification(title, {
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              ...options
            });
          } catch (err) {
            console.warn('Fallback constructor failed on mobile:', err);
          }
        });
      return true;
    }

    // Prioritas 2: Constructor langsung untuk Desktop Browser
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      return true;
    } catch (e) {
      console.warn('Browser blocks direct Notification constructor on mobile:', e);
      return false;
    }
  }

  return false;
}
