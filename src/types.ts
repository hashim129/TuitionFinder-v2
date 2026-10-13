export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  city: string;
  area: string;
  experienceYears: number;
  rating: number;
  totalStudents: number;
  hourlyRatePKR: number;
  availability: string[];
  verified: boolean;
  cnicVerified: boolean;
  cnicNumber: string;
  description: string;
  qualifications: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  gradeLevel: string;
  subjects: string[];
  city: string;
  area: string;
  budgetPKR: number;
  cnicVerified: boolean;
  cnicNumber: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system' | 'offer';
  offerData?: {
    amount: number;
    by: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

export interface Session {
  id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  amountPKR: number;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  totalSessions: number;
  status: 'active' | 'completed' | 'disputed';
  escrowBalance: number;
  tutorPayout: number;
  platformFee: number;
  qrCode: string;
}

export type Tab = 'home' | 'find' | 'bookings' | 'needs' | 'profile' | 'rules';

// ---- Booking + recurring scheduling ----

export type SessionDurationMinutes = 90 | 120;
export type SessionsPerCycle = 24 | 26;
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type BookingState =
  | 'draft'
  | 'awaiting_tutor_confirmation'
  | 'awaiting_student_confirmation'
  | 'confirmed'
  | 'rescheduling_requested'
  | 'cancelled'
  | 'completed'
  | 'disputed';

export interface ScheduledSession {
  id: string;
  date: string;
  weekday: Weekday;
  start: string;
  end: string;
  index: number;
}

export interface BookingRequest {
  tutorId: string;
  subject: string;
  start: string;
  timezone: string;
  weekdays: Weekday[];
  dailyStart: string;
  durationMinutes: SessionDurationMinutes;
  sessionsPerCycle: SessionsPerCycle;
  baseTuitionPKR: number;
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  start: string;
  timezone: string;
  weekdays: Weekday[];
  dailyStart: string;
  durationMinutes: SessionDurationMinutes;
  sessionsPerCycle: SessionsPerCycle;
  cycleEnd: string;
  schedule: ScheduledSession[];
  state: BookingState;
  pricing: PricingBreakdown;
  createdAt: string;
  confirmedAt?: string;
  tutorConfirmed: boolean;
  studentConfirmed: boolean;
  canRebook: boolean;
}

// ---- Pricing (15% platform fee + 16% GST as operating fee & taxes) ----

export interface PricingConfig {
  platformCommissionRate: number;  // 0.15
  gstRate: number;                 // 0.16 - platform revenue, shown as "Operating Fee & Taxes"
  currency: string;
}

export interface PricingBreakdown {
  baseTuition: number;
  platformFee: number;          // 15% commission
  operatingFeeAndTaxes: number; // 16% GST, shown to customer
  totalParentPays: number;      // base + operatingFeeAndTaxes
  tutorNet: number;             // base - platformFee
  config: PricingConfig;
}

// ---- Premium entitlements ----

export interface PremiumEntitlement {
  active: boolean;
  subjectsAdded: number;
  additionalSubjectCount: number;
  startDate: string | null;
  expiryDate: string | null;
}

// ---- Violation reports ----

export interface ViolationReport {
  id: string;
  reporter: string;
  targetType: 'tutor' | 'message' | 'booking' | 'transaction';
  targetId: string;
  category: string;
  description: string;
  timestamp: string;
  status: 'submitted' | 'under_review' | 'no_violation' | 'warning' | 'restriction' | 'suspended' | 'terminated';
}

// ---- Tuition Need (student broadcast) ----

export interface TuitionNeed {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  subjects: string[];
  gradeLevel: string;
  city: string;
  area: string;
  budgetPKR: number;
  durationMinutes: SessionDurationMinutes;
  sessionsPerCycle: SessionsPerCycle;
  preferredWeekdays: Weekday[];
  description: string;
  status: 'open' | 'in_progress' | 'filled' | 'cancelled';
  createdAt: string;
  responses: number;
}

// ---- Signup ----

export interface SignupData {
  role: 'parent' | 'student' | 'tutor';
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  cnicNumber: string;
  subjects: string[];
  gradeLevel: string;
  hourlyRatePKR: number;
  cnicVerified: boolean;
}
