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

export type ReminderUnit = 'minutes' | 'hours' | 'days';

export type ProcedureType =
  | 'degas'
  | 'submerge_stir'
  | 'check_mold'
  | 'inspect_seal'
  | 'harvest_prep'
  | 'custom';

export interface ProcedureGuide {
  type: ProcedureType;
  title: string;
  badge: string;
  description: string;
  instructions: string[];
  safetyWarning?: string;
  recommendedInterval: { value: number; unit: ReminderUnit };
}

export interface JarReminder {
  id: string;
  label: string;
  value: number;
  unit: ReminderUnit;
  enabled: boolean;
  createdAt: string;
  nextTriggerAt: string;
  lastTriggeredAt?: string;
  isRecurring: boolean;
  procedureType?: ProcedureType;
  instructions?: string[];
  safetyWarning?: string;
}

export interface AppNotification {
  id: string;
  jarId: string;
  jarName: string;
  reminderId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alarm' | 'reminder' | 'overdue' | 'safety';
  isRead: boolean;
  procedureType?: ProcedureType;
  instructions?: string[];
  safetyWarning?: string;
}

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
  isCompleted?: boolean;
  harvestDate?: string;
  harvestYieldMl?: number;
  reminders?: JarReminder[];
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
