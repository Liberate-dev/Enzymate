export type MaterialCategory = 'fresh_fruit' | 'fresh_veg' | 'spoiled' | 'other';

export interface ScannedMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  condition: string;
  confidence: number;
  aiAdvice: string;
  isValid: boolean;
  notes: string;
  suggestedWeight?: number; // gram
}

export type FermentColor = 'bening_kuning' | 'oranye_cokelat' | 'cokelat_tua';
export type FermentAroma = 'asam_segar' | 'manis' | 'alkohol' | 'busuk';
export type FermentSurface = 'bersih' | 'putih_tipis' | 'jamur_berbulu';
export type FermentGas = 'banyak' | 'sedikit' | 'tidak_ada';

export type FermentStatus = 'normal' | 'observe' | 'attention' | 'failed';

export interface ObservationRecord {
  id: string;
  dayNumber: number;
  date: string;
  color: FermentColor;
  aroma: FermentAroma;
  surface: FermentSurface;
  gas: FermentGas;
  status: FermentStatus;
  aiFeedback: string;
  requiresAdult: boolean;
  earnedPoints: number;
}

export interface JarData {
  id: string;
  name: string;
  startDate: string;
  targetDays: number; // typically 90 days for tropical climate
  containerCapacityLiters: number;
  organicWeightGrams: number;
  sugarWeightGrams: number;
  waterVolumeMl: number;
  ingredientsDescription: string;
  observations: ObservationRecord[];
}

export interface UserProgress {
  studentName: string;
  streakDays: number;
  totalPoints: number;
  organicSavedGrams: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}
