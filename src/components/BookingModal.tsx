import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Shield, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSchedule, detectConflicts, validateBooking, WEEKDAYS } from '../services/scheduling';
import { calculatePricing } from '../services/pricing';
import { Tutor, Weekday, SessionDurationMinutes, SessionsPerCycle, BookingRequest } from '../types';

interface Props {
  isOpen: boolean;
  tutor: Tutor | null;
  onClose: () => void;
}

export const BookingModal: React.FC<Props> = ({ isOpen, tutor, onClose }) => {
  const { bookings, submitBooking } = useApp();
  const [subject, setSubject] = useState('');
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
  const [weekdays, setWeekdays] = useState<Weekday[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [dailyStart, setDailyStart] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState<SessionDurationMinutes>(90);
  const [sessionsPerCycle, setSessionsPerCycle] = useState<SessionsPerCycle>(24);
  const [baseTuition, setBaseTuition] = useState(20000);
  const [step, setStep] = useState<'details' | 'schedule' | 'confirm'>('details');

  const buildRequest = (): BookingRequest => ({
    tutorId: tutor?.id || '',
    subject: subject || tutor?.subjects[0] || '',
    start,
    timezone: 'Asia/Karachi',
    weekdays,
    dailyStart,
    durationMinutes,
    sessionsPerCycle,
    baseTuitionPKR: baseTuition,
  });

  const validation = validateBooking(buildRequest());

  const schedule = useMemo(() => {
    if (validation) return { ok: false, sessions: [] as any[], cycleEnd: '', conflict: '' };
    return generateSchedule(buildRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, start, weekdays, dailyStart, durationMinutes, sessionsPerCycle, baseTuition, step]);

  const pricing = calculatePricing(baseTuition);
  const conflicts = schedule.ok && tutor ? detectConflicts(schedule.sessions, bookings, tutor.id) : [];

  if (!isOpen || !tutor) return null;

  const toggleWeekday = (wd: Weekday) => {
    setWeekdays(prev => prev.includes(wd) ? prev.filter(x => x !== wd) : [...prev, wd]);
  };

  const handleNext = () => {
    if (step === 'details') { if (validation) return; setStep('schedule'); return; }
    if (step === 'schedule') { if (!schedule.ok || conflicts.length > 0) return; setStep('confirm'); return; }
    const result = submitBooking(buildRequest());
    if (result.ok) { onClose(); }
  };

  const btnBase = 'flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ';
  const selCls = 'bg-emerald-600 text-white';
  const unselCls = 'bg-slate-100 text-slate-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="font-bold text-sm block">New Booking Request</span>
            <p className="text-xs text-slate-400 mt-0.5">{tutor.name} - {tutor.area}, {tutor.city}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex items-center justify-center gap-2 py-3 border-b border-slate-200 shrink-0">
          {(['Details', 'Schedule', 'Confirm'] as const).map((label, i) => {
            const stepNames = ['details', 'schedule', 'confirm'];
            const active = stepNames.indexOf(step) >= i;
            const current = stepNames[i] === step;
            return (
              <div key={label} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-6 h-0.5 bg-slate-200" />}
                <div className={'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ' + (current ? 'bg-emerald-600 text-white' : active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')}>{i + 1}</div>
                <span className={'text-xs font-medium ' + (current ? 'text-slate-900' : 'text-slate-400')}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 'details' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select subject...</option>
                  {tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Monthly Tuition (PKR)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-mono">PKR</span>
                  <input type="number" value={baseTuition} onChange={e => setBaseTuition(parseInt(e.target.value) || 0)} className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="flex gap-2 mt-2">
                  {[10000, 15000, 20000, 25000].map(v => (
                    <button key={v} onClick={() => setBaseTuition(v)} className={btnBase + (baseTuition === v ? selCls : unselCls)}>{v / 1000}K</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1"><Calendar size={13} className="text-slate-400" /> Start Date</label>
                <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-[10px] text-slate-400 mt-1">Timezone: Asia/Karachi (PKT)</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Preferred Weekdays</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map(wd => (
                    <button key={wd} onClick={() => toggleWeekday(wd)} className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ' + (weekdays.includes(wd) ? selCls : unselCls)}>{wd}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1"><Clock size={13} className="text-slate-400" /> Daily Start Time</label>
                <input type="time" value={dailyStart} onChange={e => setDailyStart(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Session Duration</label>
                <div className="flex gap-2">
                  {([90, 120] as SessionDurationMinutes[]).map(d => (
                    <button key={d} onClick={() => setDurationMinutes(d)} className={btnBase + (durationMinutes === d ? selCls : unselCls)}>{d === 90 ? '1.5 hours' : '2 hours'}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Sessions per Cycle</label>
                <div className="flex gap-2">
                  {([24, 26] as SessionsPerCycle[]).map(s => (
                    <button key={s} onClick={() => setSessionsPerCycle(s)} className={btnBase + (sessionsPerCycle === s ? selCls : unselCls)}>{s} sessions</button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">One session per selected weekday; cycle ends when count is reached.</p>
              </div>
            </>
          )}

          {step === 'schedule' && (
            <>
              <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-400 shrink-0" /><span className="font-bold text-sm text-slate-800">Schedule Preview</span></div>

              {!schedule.ok ? (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div><span className="text-xs font-bold text-amber-800 block">Cannot generate schedule</span><p className="text-[11px] text-amber-700 mt-0.5">{schedule.conflict}</p></div>
                </div>
              ) : conflicts.length > 0 ? (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <div><span className="text-xs font-bold text-red-800 block">Schedule Conflicts</span>
                    {conflicts.map((c, i) => <p key={i} className="text-[11px] text-red-700 mt-0.5">{c}</p>)}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {schedule.sessions.map(s => (
                    <div key={s.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">{s.index}</div>
                      <div className="flex-1"><p className="text-xs font-bold text-slate-800">{s.date}</p><p className="text-[10px] text-slate-500">{s.weekday}</p></div>
                      <span className="text-[11px] font-mono font-bold text-emerald-700">{s.start}</span>
                    </div>
                  ))}
                </div>
              )}

              {schedule.ok && conflicts.length === 0 && (
                <div className="flex items-center gap-1.5 bg-emerald-50 rounded-xl px-3 py-2">
                  <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-emerald-800">Cycle ends {schedule.cycleEnd}. {sessionsPerCycle} sessions across {weekdays.length} weekday(s).</span>
                </div>
              )}
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Booking Summary</span>
                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Tutor</span><span className="font-bold">{tutor.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="font-bold">{subject || tutor.subjects[0]}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Start</span><span className="font-bold">{start}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Days</span><span className="font-bold">{weekdays.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold">{dailyStart} ({durationMinutes === 90 ? '1.5h' : '2h'})</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Sessions</span><span className="font-bold">{sessionsPerCycle}</span></div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <span className="font-bold text-xs text-emerald-800 block flex items-center gap-1"><Shield size={13} /> Pricing Breakdown</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-600">Base tuition</span><span className="font-bold font-mono">PKR {pricing.baseTuition.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Platform fee (15%)</span><span className="font-mono">PKR {pricing.platformFee.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Operating fee (8%)</span><span className="font-mono">PKR {pricing.operatingFee.toLocaleString()}</span></div>
                  <div className="border-t border-emerald-200 pt-1.5 flex justify-between text-sm"><span className="font-bold text-slate-800">Parent pays total</span><span className="font-black text-emerald-700 font-mono">PKR {pricing.totalParentPays.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="font-bold text-slate-800">Tutor net receives</span><span className="font-black text-emerald-700 font-mono">PKR {pricing.tutorNet.toLocaleString()}</span></div>
                </div>
                <p className="text-[10px] text-emerald-600 mt-2">8% operating fee paid by parent. Platform fee is 15% commission.</p>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800">Creates a <b>pending booking request</b>. Tutor must confirm. No payment charged yet. Payment goes into escrow after confirmation.</p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 shrink-0">
          {step !== 'details' && (
            <button onClick={() => setStep(step === 'schedule' ? 'details' : 'schedule')} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors">Back</button>
          )}
          <button onClick={handleNext} disabled={step === 'details' && !!validation} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
            {step === 'confirm' ? 'Submit Booking Request' : 'Continue'}{step !== 'confirm' && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
