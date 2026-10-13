import React, { useState, createContext, useContext } from 'react';
import { Tutor, Student, Session, Tab, Booking, BookingRequest, PremiumEntitlement, ViolationReport, TuitionNeed, SignupData } from '../types';
import { TUTORS, STUDENTS, SAMPLE_SESSIONS, SAMPLE_TUITION_NEEDS } from '../data/mockData';
import { calculatePricing } from '../services/pricing';
import { generateSchedule, detectConflicts } from '../services/scheduling';

interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  currentUser: {
    id: string; name: string; avatar: string; role: 'parent' | 'student' | 'tutor';
    city: string; area: string; phone: string; cnicVerified: boolean; cnicNumber: string; otpVerified: boolean;
    gradeLevel: string; subjects: string[];
  };
  tutors: Tutor[];
  students: Student[];
  sessions: Session[];
  addMessage: (chatId: string, text: string, type?: string) => void;
  sendMessage: (text: string) => boolean;
  currentOffer: { amount: number; by: string; status: string } | null;
  sendOffer: (amount: number) => void;
  acceptAndPay: (amount: number) => void;
  contactUnmasked: boolean;
  sessionsCreated: number;
  createSession: (tutorId: string, amount: number) => void;
  bookings: Booking[];
  submitBooking: (req: BookingRequest) => { ok: boolean; conflicts: string[] };
  confirmBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  tutorConfirmBooking: (bookingId: string) => void;
  tutorRespondToNeed: (needId: string) => { ok: boolean; error?: string };
  tutorConfirmNeedBooking: (needId: string) => void;
  tuitionNeeds: TuitionNeed[];
  postTuitionNeed: (need: Omit<TuitionNeed, 'id' | 'createdAt' | 'status' | 'responses'>) => void;
  toggleTuitionNeedStatus: (needId: string) => void;
  premium: PremiumEntitlement;
  addPremiumSubject: () => boolean;
  violations: ViolationReport[];
  submitViolation: (v: Omit<ViolationReport, 'id' | 'timestamp' | 'status'>) => void;
  signupOpen: boolean;
  setSignupOpen: (open: boolean) => void;
  completeSignup: (data: SignupData) => void;
  otpVerified: boolean;
  verifyOtp: () => void;
  userSignedUp: boolean;
  addUserTutor: (name: string, subjects: string[], city: string, area: string, hourlyRatePKR: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sessions, setSessions] = useState<Session[]>(SAMPLE_SESSIONS);
  const [contactUnmasked] = useState(false);
  const [sessionsCreated] = useState(SAMPLE_SESSIONS.length);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [violations, setViolations] = useState<ViolationReport[]>([]);
  const [tuitionNeeds, setTuitionNeeds] = useState<TuitionNeed[]>(SAMPLE_TUITION_NEEDS);
  const [signupOpen, setSignupOpen] = useState(false);
  const [userSignedUp, setUserSignedUp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cnicVerified, setCnicVerified] = useState(false);
  const [cnicNumber, setCnicNumber] = useState('');
  const [userRole, setUserRole] = useState<'parent' | 'student' | 'tutor'>('parent');
  const [userGrade, setUserGrade] = useState('A-Levels');
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [userTutors, setUserTutors] = useState<Tutor[]>([]);
  const [userName, setUserName] = useState('Tariq Mahmood');
  const [userPhone, setUserPhone] = useState('03001234567');
  const [userEmail, setUserEmail] = useState('');
  const [userCity, setUserCity] = useState('Lahore');
  const [userArea, setUserArea] = useState('DHA');

  const currentUser = {
    id: 'user', name: userName, avatar: userName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(), role: userRole,
    city: userCity, area: userArea, phone: userPhone,
    cnicVerified, cnicNumber, otpVerified,
    gradeLevel: userGrade, subjects: userSubjects,
  };

  // Stub methods for compatibility (no longer used)
  const addMessage = () => {};
  const sendMessage = () => false;
  const currentOffer = null;
  const sendOffer = () => {};
  const acceptAndPay = () => {};

  const createSession = (tutorId: string, amount: number) => {
    const tutor = TUTORS.find(t => t.id === tutorId);
    if (!tutor) return;
    const pricing = calculatePricing(amount);
    const session: Session = {
      id: `sess_${Date.now()}`,
      tutorId, tutorName: tutor.name, studentName: 'Hamza Tariq',
      subject: tutor.subjects[0], amountPKR: amount,
      startDate: new Date().toISOString().split('T')[0], endDate: '',
      sessionsCompleted: 0, totalSessions: 24,
      status: 'active', escrowBalance: amount,
      tutorPayout: pricing.tutorNet, platformFee: pricing.platformFee,
      qrCode: `TF-QR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    setSessions(prev => [...prev, session]);
  };

  const submitBooking = (req: BookingRequest) => {
    const schedule = generateSchedule(req);
    if (!schedule.ok) return { ok: false, conflicts: [schedule.conflict!] };
    const conflicts = detectConflicts(schedule.sessions, bookings, req.tutorId);
    if (conflicts.length > 0) return { ok: false, conflicts };
    const pricing = calculatePricing(req.baseTuitionPKR);
    const tutor = TUTORS.find(t => t.id === req.tutorId);
    const booking: Booking = {
      id: `bk_${Date.now()}`,
      tutorId: req.tutorId, tutorName: tutor?.name || 'Unknown',
      studentName: currentUser.name,
      subject: req.subject, start: req.start, timezone: req.timezone,
      weekdays: req.weekdays, dailyStart: req.dailyStart,
      durationMinutes: req.durationMinutes, sessionsPerCycle: req.sessionsPerCycle,
      cycleEnd: schedule.cycleEnd, schedule: schedule.sessions,
      state: 'awaiting_tutor_confirmation', pricing,
      createdAt: new Date().toISOString(),
      tutorConfirmed: false, studentConfirmed: true, canRebook: true,
    };
    setBookings(prev => [...prev, booking]);
    return { ok: true, conflicts: [] };
  };

  const confirmBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, state: 'confirmed' as const, confirmedAt: new Date().toISOString() } : b));
  };
  const rejectBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, state: 'cancelled' as const, canRebook: true } : b));
  };
  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId && (b.state === 'awaiting_tutor_confirmation' || b.state === 'confirmed') ? { ...b, state: 'cancelled' as const, canRebook: true } : b));
  };
  const tutorConfirmBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, state: 'confirmed' as const, tutorConfirmed: true, confirmedAt: new Date().toISOString() } : b));
  };

  const postTuitionNeed = (need: Omit<TuitionNeed, 'id' | 'createdAt' | 'status' | 'responses'>) => {
    const newNeed: TuitionNeed = { ...need, id: `need_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], status: 'open', responses: 0 };
    setTuitionNeeds(prev => [newNeed, ...prev]);
  };
  const toggleTuitionNeedStatus = (needId: string) => {
    setTuitionNeeds(prev => prev.map(n => {
      if (n.id !== needId) return n;
      if (n.status === 'open') return { ...n, status: 'in_progress' as const, responses: n.responses + 1 };
      if (n.status === 'in_progress') return { ...n, status: 'filled' as const };
      return n;
    }));
  };

  const tutorRespondToNeed = (needId: string) => {
    const need = tuitionNeeds.find(n => n.id === needId);
    if (!need || need.studentId === currentUser.id) {
      return { ok: false, error: 'You cannot respond to your own tuition need.' };
    }
    if (currentUser.role !== 'tutor') {
      return { ok: false, error: 'Only tutors can respond to tuition needs.' };
    }
    if (need.responses >= 1 && need.respondedByTutorId) {
      return { ok: false, error: 'This need already has an accepted tutor response.' };
    }

    const subject = need.subjects.find(s => currentUser.subjects.includes(s)) || need.subjects[0] || 'General';
    const schedule = generateSchedule({
      tutorId: currentUser.id,
      subject,
      start: new Date().toISOString().split('T')[0],
      timezone: 'Asia/Karachi',
      weekdays: need.preferredWeekdays,
      dailyStart: '18:00',
      durationMinutes: need.durationMinutes,
      sessionsPerCycle: need.sessionsPerCycle,
      baseTuitionPKR: need.budgetPKR,
    });
    if (!schedule.ok) {
      return { ok: false, error: schedule.conflict || 'Could not create booking schedule.' };
    }

    const conflicts = detectConflicts(schedule.sessions, bookings, currentUser.id);
    if (conflicts.length > 0) {
      return { ok: false, error: conflicts[0] };
    }

    const pricing = calculatePricing(need.budgetPKR);
    const bookingId = `bk_${Date.now()}`;
    const booking: Booking = {
      id: bookingId,
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      studentName: need.studentName,
      subject,
      start: new Date().toISOString().split('T')[0],
      timezone: 'Asia/Karachi',
      weekdays: need.preferredWeekdays,
      dailyStart: '18:00',
      durationMinutes: need.durationMinutes,
      sessionsPerCycle: need.sessionsPerCycle,
      cycleEnd: schedule.cycleEnd,
      schedule: schedule.sessions,
      state: 'awaiting_tutor_confirmation',
      pricing,
      createdAt: new Date().toISOString(),
      tutorConfirmed: false,
      studentConfirmed: true,
      canRebook: true,
    };

    setBookings(prev => [...prev, booking]);
    setTuitionNeeds(prev => prev.map(n => {
      if (n.id !== needId) return n;
      return {
        ...n,
        status: 'in_progress' as const,
        responses: Math.min(n.responses + 1, 1),
        respondedByTutorId: currentUser.id,
        respondedBookingId: bookingId,
      };
    }));

    return { ok: true };
  };

  const tutorConfirmNeedBooking = (needId: string) => {
    const need = tuitionNeeds.find(n => n.id === needId);
    if (!need || need.studentId === currentUser.id) return;
    if (currentUser.role !== 'tutor') return;
    if (!need.respondedBookingId) return;

    const bookingId = need.respondedBookingId;
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      state: 'confirmed' as const,
      tutorConfirmed: true,
      confirmedAt: new Date().toISOString(),
    } : b));
    setTuitionNeeds(prev => prev.map(n => n.id === needId ? {
      ...n,
      status: 'filled' as const,
    } : n));
  };

  // Premium: PKR 2000 / 2 months / 6 additional subjects (3+6=9 total)
  const [premiumActive, setPremiumActive] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);
  const premium: PremiumEntitlement = {
    active: premiumActive,
    subjectsAdded: premiumActive ? 6 : 0,
    additionalSubjectCount: premiumActive ? 6 : 0,
    startDate: premiumActive ? new Date().toISOString().split('T')[0] : null,
    expiryDate: premiumExpiry,
  };
  const addPremiumSubject = () => {
    if (premiumActive) return false;
    setPremiumActive(true);
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 2);
    setPremiumExpiry(expiry.toISOString().split('T')[0]);
    return true;
  };

  const submitViolation = (v: Omit<ViolationReport, 'id' | 'timestamp' | 'status'>) => {
    const report: ViolationReport = { ...v, id: `viol_${Date.now()}`, timestamp: new Date().toISOString(), status: 'submitted' };
    setViolations(prev => [report, ...prev]);
  };

  const addUserTutor = (name: string, subjects: string[], city: string, area: string, monthlyRatePKR: number) => {
    const newTutor: Tutor = {
      id: `tutor_${Date.now()}`,
      name, avatar: name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(),
      subjects, city, area,
      experienceYears: 1, rating: 0, totalStudents: 0,
      hourlyRatePKR: Math.round(monthlyRatePKR / 8), monthlyRatePKR,
      availability: ['Mon 4-6 PM', 'Wed 4-6 PM', 'Sat 10 AM-1 PM'],
      verified: true, cnicVerified: true, cnicNumber: '',
      description: 'New tutor on TuitionFinder. Quality teaching guaranteed.',
      qualifications: 'Qualified professional'
    };
    setUserTutors(prev => [...prev, newTutor]);
  };

  const completeSignup = (data: SignupData) => {
    setUserRole(data.role);
    setUserName(data.name);
    setUserPhone(data.phone);
    setUserEmail(data.email);
    setUserCity(data.city);
    setUserArea(data.area);
    setCnicVerified(data.cnicVerified);
    setCnicNumber(data.cnicNumber);
    if (data.gradeLevel) setUserGrade(data.gradeLevel);
    if (data.subjects && data.subjects.length > 0) setUserSubjects(data.subjects);
    setUserSignedUp(true);
    setSignupOpen(false);
  };
  const verifyOtp = () => { setOtpVerified(true); };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab, currentUser,
      tutors: [...TUTORS, ...userTutors], students: STUDENTS,
      sessions, addMessage, sendMessage,
      currentOffer, sendOffer, acceptAndPay,
      contactUnmasked, sessionsCreated, createSession,
      bookings, submitBooking, confirmBooking, rejectBooking, cancelBooking, tutorConfirmBooking,
      tutorRespondToNeed, tutorConfirmNeedBooking,
      tuitionNeeds, postTuitionNeed, toggleTuitionNeedStatus,
      premium, addPremiumSubject,
      violations, submitViolation,
      signupOpen, setSignupOpen, completeSignup,
      otpVerified, verifyOtp,
      userSignedUp, addUserTutor,
    }}>
      {children}
    </AppContext.Provider>
  );
};
