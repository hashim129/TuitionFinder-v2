import React, { useState } from 'react';
import { Calendar, Shield, CheckCircle, AlertTriangle, Lock, CreditCard, Clock, MapPin, ArrowRight, Ban, RefreshCw, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingModal } from './BookingModal';
import { calculatePricing } from '../services/pricing';
import { WEEKDAYS } from '../services/scheduling';
import { Weekday, SessionDurationMinutes, SessionsPerCycle } from '../types';

export const BookingsView: React.FC = () => {
  const {
    tutors, bookings, submitBooking, confirmBooking, rejectBooking,
    cancelBooking, tutorConfirmBooking, setActiveTab, currentUser
  } = useApp();

  const [bookingTutorId, setBookingTutorId] = useState('');
  const [showTutorList, setShowTutorList] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookSubject, setBookSubject] = useState('');
  const [bookBaseTuition, setBookBaseTuition] = useState(20000);
  const [bookStart, setBookStart] = useState(new Date().toISOString().split('T')[0]);
  const [bookWeekdays, setBookWeekdays] = useState<Weekday[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [bookDailyStart, setBookDailyStart] = useState('18:00');
  const [bookDuration, setBookDuration] = useState<SessionDurationMinutes>(90);
  const [bookSessions, setBookSessions] = useState<SessionsPerCycle>(24);
  const [bookStep, setBookStep] = useState<'details' | 'confirm'>('details');
  const [bookingResult, setBookingResult] = useState('');

  const bookingTutor = tutors.find(t => t.id === bookingTutorId);
  const pricing = calculatePricing(bookBaseTuition);

  const toggleWeekday = (wd: Weekday) => {
    setBookWeekdays(prev => prev.includes(wd) ? prev.filter(x => x !== wd) : [...prev, wd]);
  };

  const handleBookingSubmit = () => {
    if (!bookingTutorId) return;
    const bookingReq = {
      tutorId: bookingTutorId,
      subject: bookSubject || bookingTutor?.subjects[0] || '',
      start: bookStart,
      timezone: 'Asia/Karachi',
      weekdays: bookWeekdays,
      dailyStart: bookDailyStart,
      durationMinutes: bookDuration,
      sessionsPerCycle: bookSessions,
      baseTuitionPKR: bookBaseTuition,
    };
    const result = submitBooking(bookingReq);
    if (result.ok) {
      setBookingResult('Booking request submitted successfully! Tutor will confirm shortly.');
      setBookOpen(false);
      setBookStep('details');
      setTimeout(() => setBookingResult(''), 8000);
    } else {
      setBookingResult('Booking failed: ' + result.conflicts.join(', '));
      setTimeout(() => setBookingResult(''), 5000);
    }
  };

  const activeBookings = bookings.filter(b => b.state !== 'cancelled');
  const pendingBookings = bookings.filter(b => b.state === 'awaiting_tutor_confirmation');
  const confirmedBookings = bookings.filter(b => b.state === 'confirmed');
  const completedBookings = bookings.filter(b => b.state === 'completed');
  const cancelledBookings = bookings.filter(b => b.state === 'cancelled');

  const stateBadge = (state: string) => {
    const map: Record<string, string> = {
      'awaiting_tutor_confirmation': 'bg-amber-100 text-amber-700',
      'confirmed': 'bg-emerald-100 text-emerald-700',
      'completed': 'bg-blue-100 text-blue-700',
      'cancelled': 'bg-slate-100 text-slate-500',
      'disputed': 'bg-red-100 text-red-700',
      'rescheduling_requested': 'bg-amber-100 text-amber-700',
    };
    return map[state] || 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="p-4 space-y-4 animate-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bookings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your tutoring bookings. All payments via escrow.</p>
      </div>

      {/* New Booking CTA */}
      <button onClick={() => setShowTutorList(true)}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
        <Calendar size={14} />
        <span>New Booking</span>
      </button>

      {bookingResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2">
          <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800">{bookingResult}</p>
        </div>
      )}

      {/* Booking Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-lg font-black text-emerald-600">{confirmedBookings.length}</p>
          <p className="text-[10px] text-slate-500">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-lg font-black text-amber-600">{pendingBookings.length}</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
      </div>

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <div>
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1">
            <Clock size={14} className="text-amber-500" /> Awaiting Tutor Confirmation
          </h2>
          <div className="space-y-2">
            {pendingBookings.map(b => (
              <div key={b.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{b.tutorName}</p>
                    <p className="text-[10px] text-slate-500">{b.subject}</p>
                  </div>
                  <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + stateBadge(b.state)}>
                    {b.state.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <div className="flex items-center gap-1"><Calendar size={10} /> {b.weekdays.join(', ')} · {b.dailyStart}</div>
                  <div className="flex items-center gap-1"><Clock size={10} /> {b.durationMinutes}min · {b.sessionsPerCycle} sessions</div>
                  <div className="flex items-center gap-1"><CreditCard size={10} /> PKR {b.pricing.totalParentPays.toLocaleString()} (escrow)</div>
                </div>
                <button onClick={() => cancelBooking(b.id)}
                  className="mt-2 w-full py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-100">
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Bookings */}
      {confirmedBookings.length > 0 && (
        <div>
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-500" /> Confirmed Bookings
          </h2>
          <div className="space-y-2">
            {confirmedBookings.map(b => {
              const p = b.pricing;
              return (
                <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{b.tutorName}</p>
                      <p className="text-[10px] text-slate-500">{b.subject}</p>
                    </div>
                    <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + stateBadge(b.state)}>
                      Confirmed
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 space-y-0.5 mb-2">
                    <div className="flex items-center gap-1"><Calendar size={10} /> {b.weekdays.join(', ')} · {b.dailyStart} · {b.durationMinutes}min</div>
                    <div className="flex items-center gap-1"><Clock size={10} /> {b.sessionsPerCycle} sessions · Ends {b.cycleEnd}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-500">Base tuition</span><span className="font-mono">PKR {p.baseTuition.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Operating fee (8%)</span><span className="font-mono">PKR {p.operatingFee.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-slate-800"><span>Parent pays</span><span className="font-mono text-emerald-700">PKR {p.totalParentPays.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tutor net</span><span className="font-mono text-emerald-700">PKR {p.tutorNet.toLocaleString()}</span></div>
                  </div>
                  <button onClick={() => cancelBooking(b.id)}
                    className="mt-2 w-full py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200">
                    Request Cancellation
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div>
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1">
            <Ban size={14} className="text-slate-400" /> Cancelled Bookings
          </h2>
          <div className="space-y-2">
            {cancelledBookings.map(b => (
              <div key={b.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-xs text-slate-700">{b.tutorName}</p>
                  <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + stateBadge(b.state)}>
                    Cancelled
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{b.subject} · {b.weekdays.join(', ')}</p>
                {b.canRebook && (
                  <button onClick={() => setBookingTutorId(b.tutorId)}
                    className="mt-2 w-full py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center justify-center gap-1">
                    <RefreshCw size={10} /> Re-book {b.tutorName}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Calendar size={48} className="text-slate-200 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-700">No bookings yet</p>
          <p className="text-xs text-slate-500 mt-1">Tap "New Booking" to find a tutor and schedule sessions.</p>
        </div>
      )}

      {/* Policy Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Booking & Payment Policy</h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              1. Submit booking request. 2. Tutor confirms. 3. Pay via escrow (JazzCash/EasyPaisa/Raast). 4. Contact details unmasked. 5. Sessions run. 6. Funds released after completion.
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle size={12} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-300">No off-platform deals. All bookings through escrow.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tutor Selection Modal */}
      {showTutorList && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <span className="font-bold text-sm">Select a Tutor</span>
              <button onClick={() => setShowTutorList(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {tutors.map(t => (
                <button key={t.id} onClick={() => {
                  setBookingTutorId(t.id);
                  setBookSubject('');
                  setBookOpen(true);
                  setShowTutorList(false);
                }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-xs text-slate-900 truncate">{t.name}</p>
                      {t.cnicVerified && <Shield size={12} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500">{t.subjects.join(', ')}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-[10px] text-slate-500">{t.area}, {t.city}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Booking Modal (inline, not using BookingModal component) */}
      {bookOpen && bookingTutor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="font-bold text-sm block">Full Session Booking</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{bookingTutor.name} — {bookingTutor.subjects.join(', ')}</p>
              </div>
              <button onClick={() => setBookOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-3 border-b border-slate-200 shrink-0">
              <div className={'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ' + (bookStep === 'details' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700')}>1</div>
              <span className={'text-xs font-medium ' + (bookStep === 'details' ? 'text-slate-900' : 'text-emerald-700')}>Details</span>
              <div className="w-4 h-0.5 bg-slate-200" />
              <div className={'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ' + (bookStep === 'confirm' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400')}>2</div>
              <span className={'text-xs font-medium ' + (bookStep === 'confirm' ? 'text-slate-900' : 'text-slate-400')}>Confirm</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {bookStep === 'details' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Subject</label>
                    <select value={bookSubject} onChange={e => setBookSubject(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select subject...</option>
                      {bookingTutor.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Monthly Tuition (PKR)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 font-mono">PKR</span>
                      <input type="number" value={bookBaseTuition} onChange={e => setBookBaseTuition(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[10000, 15000, 20000, 25000, 30000].map(v => (
                        <button key={v} onClick={() => setBookBaseTuition(v)}
                          className={'flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-colors ' + (bookBaseTuition === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {v / 1000}K
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1"><Calendar size={12} className="text-slate-400" /> Start Date</label>
                    <input type="date" value={bookStart} onChange={e => setBookStart(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <p className="text-[10px] text-slate-400 mt-1">Timezone: Asia/Karachi (PKT)</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Preferred Weekdays</label>
                    <div className="flex flex-wrap gap-1.5">
                      {WEEKDAYS.map(wd => (
                        <button key={wd} onClick={() => toggleWeekday(wd)}
                          className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ' + (bookWeekdays.includes(wd) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {wd}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Daily Start Time</label>
                    <input type="time" value={bookDailyStart} onChange={e => setBookDailyStart(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Session Duration</label>
                    <div className="flex gap-2">
                      {([90, 120] as SessionDurationMinutes[]).map(d => (
                        <button key={d} onClick={() => setBookDuration(d)}
                          className={'flex-1 py-2 rounded-xl text-xs font-bold transition-colors ' + (bookDuration === d ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {d === 90 ? '1.5 hours' : '2 hours'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Sessions per Cycle</label>
                    <div className="flex gap-2">
                      {([24, 26] as SessionsPerCycle[]).map(s => (
                        <button key={s} onClick={() => setBookSessions(s)}
                          className={'flex-1 py-2 rounded-xl text-xs font-bold transition-colors ' + (bookSessions === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {s} sessions
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">One session per selected weekday; cycle ends when count is reached.</p>
                  </div>
                </>
              )}

              {bookStep === 'confirm' && (
                <>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Booking Summary</span>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Tutor</span><span className="font-bold">{bookingTutor.name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="font-bold">{bookSubject || bookingTutor.subjects[0]}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Start</span><span className="font-bold">{bookStart}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Days</span><span className="font-bold">{bookWeekdays.join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold">{bookDailyStart} ({bookDuration === 90 ? '1.5h' : '2h'})</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Sessions</span><span className="font-bold">{bookSessions}</span></div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-xs text-emerald-800 block flex items-center gap-1"><Shield size={13} /> Pricing Breakdown</span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Base tuition</span><span className="font-mono">PKR {pricing.baseTuition.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Operating fee (8%)</span><span className="font-mono">PKR {pricing.operatingFee.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Platform fee (15%)</span><span className="font-mono">PKR {pricing.platformFee.toLocaleString()}</span></div>
                      <div className="border-t border-emerald-200 pt-1.5 flex justify-between text-sm"><span className="font-bold text-slate-800">Parent pays total</span><span className="font-black text-emerald-700 font-mono">PKR {pricing.totalParentPays.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="font-bold text-slate-800">Tutor net receives</span><span className="font-black text-emerald-700 font-mono">PKR {pricing.tutorNet.toLocaleString()}</span></div>
                    </div>
                    <p className="text-[10px] text-emerald-600 mt-2">Parent pays base + 8% operating fee. Tutor receives 85% of base tuition. Platform keeps 15% commission.</p>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800">Booking request created. Tutor must confirm. Payment via escrow after confirmation. Contact unmasked after 1st session.</p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 shrink-0">
              {bookStep === 'confirm' && (
                <button onClick={() => setBookStep('details')} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors">Back</button>
              )}
              <button onClick={() => bookStep === 'details' ? setBookStep('confirm') : handleBookingSubmit()}
                disabled={bookStep === 'confirm' && bookWeekdays.length === 0}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                {bookStep === 'confirm' ? 'Submit Booking Request' : 'Continue'}
                {bookStep === 'details' && <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};