import {
  Booking,
  BookingRequest,
  ScheduledSession,
  Weekday,
} from '../types';

export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Parse "HH:MM" into total minutes from midnight.
 */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Format a Date as YYYY-MM-DD in local time (no UTC shift).
 */
function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a Date at local midnight.
 */
function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Generate recurring sessions for a monthly cycle.
 *
 * Rules enforced (master prompt §3.3):
 * - Distributes sessions across the SELECTED weekdays only.
 * - Does NOT silently duplicate a day to compensate for too few days.
 * - If the selected weekdays + monthly cycle cannot produce the requested
 *   count without a day gap, returns a conflict (caller must ask for valid input).
 * - Sessions are spaced roughly one per week per weekday, ordered by date.
 */
export interface ScheduleResult {
  ok: boolean;
  sessions: ScheduledSession[];
  cycleEnd: string;
  conflict: string | null;
}

export function generateSchedule(req: BookingRequest): ScheduleResult {
  if (req.weekdays.length === 0) {
    return { ok: false, sessions: [], cycleEnd: '', conflict: 'Select at least one weekday.' };
  }

  const start = parseDate(req.start);
  const startMin = timeToMinutes(req.dailyStart);
  const endMin = startMin + req.durationMinutes;

  // Distribute sessions by walking candidate weekday-slots in date order and
  // placing one session per candidate day. This naturally spreads sessions
  // across the selected weekdays without overloading any single day.
  const sessions: ScheduledSession[] = [];
  const horizonDays = 45; // extend beyond 30 to allow for 26 sessions with fewer weekdays

  let dayCursor = 0;
  let placed = 0;
  while (placed < req.sessionsPerCycle && dayCursor <= horizonDays) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayCursor);
    const dow = d.getDay();
    const wd: Weekday = dow === 0 ? 'Sun' : (WEEKDAYS[dow - 1]);
    if (req.weekdays.includes(wd)) {
      sessions.push({
        id: `sess-${req.start}-${fmtDate(d)}`,
        date: fmtDate(d),
        weekday: wd,
        start: req.dailyStart,
        end: minutesToTime(endMin),
        index: placed + 1,
      });
      placed++;
    }
    dayCursor++;
  }

  if (sessions.length < req.sessionsPerCycle) {
    return {
      ok: false,
      sessions: [],
      cycleEnd: '',
      conflict:
        `Selected weekdays yield only ${sessions.length} slot(s) within ${horizonDays} days, ` +
        `but ${req.sessionsPerCycle} sessions are requested per cycle. ` +
        'Select more weekdays or fewer sessions per cycle.',
    };
  }

  // Sort by date then weekday order
  const wdOrder = (w: Weekday) => WEEKDAYS.indexOf(w);
  sessions.sort((a, b) => a.date.localeCompare(b.date) || wdOrder(a.weekday) - wdOrder(b.weekday));
  sessions.forEach((s, i) => (s.index = i + 1));

  // Cycle end = date of the last session
  const cycleEnd = sessions.length ? sessions[sessions.length - 1].date : '';

  return { ok: true, sessions, cycleEnd, conflict: null };
}

/**
 * Detect conflicts against already-confirmed sessions for the same tutor.
 * A conflict is a session with an overlapping time window on the same date.
 */
export function detectConflicts(
  newSchedule: ScheduledSession[],
  existing: Booking[],
  tutorId: string
): string[] {
  const conflicts: string[] = [];
  for (const s of newSchedule) {
    const sStart = timeToMinutes(s.start);
    const sEnd = timeToMinutes(s.end);
    for (const b of existing) {
      if (b.tutorId !== tutorId) continue;
      if (b.state !== 'confirmed') continue;
      for (const e of b.schedule) {
        if (e.date !== s.date) continue;
        const eStart = timeToMinutes(e.start);
        const eEnd = timeToMinutes(e.end);
        if (sStart < eEnd && eStart < sEnd) {
          conflicts.push(`${s.date} (${s.start}–${s.end}) overlaps a confirmed booking`);
        }
      }
    }
  }
  return conflicts;
}

/**
 * Validate a booking request before scheduling.
 */
export function validateBooking(req: BookingRequest): string | null {
  if (!req.tutorId) return 'Select a tutor.';
  if (!req.subject) return 'Select a subject.';
  if (!req.start) return 'Select a start date.';
  if (req.weekdays.length === 0) return 'Select at least one preferred weekday.';
  if (!req.dailyStart) return 'Select a daily time.';
  if (req.baseTuitionPKR <= 0) return 'Enter a monthly tuition amount greater than zero.';
  if (req.baseTuitionPKR > 1000000) return 'Tuition amount is unrealistically high.';
  return null;
}
