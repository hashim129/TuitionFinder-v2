import React, { useState } from 'react';
import { X, Shield, User, Smartphone, CheckCircle, Fingerprint, CreditCard, BookOpen, ArrowRight, AlertTriangle, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockData';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Sialkot', 'Hyderabad', 'Quetta'];
const AREAS = ['DHA', 'Gulberg', 'Model Town', 'Johar Town', 'Wapda Town', 'Bahria Town', 'Cantt', 'F-Block', 'Other'];
const GRADE_LEVELS = ['Matric (8th/9th/10th)', 'Intermediate (FSc/FA)', 'A-Levels', 'BSc/BS', 'MSc/MS', 'Graduate', 'Professional (LLB/CAS)', 'Other'];

export const SignupModal: React.FC = () => {
  const { signupOpen, setSignupOpen, completeSignup, otpVerified, verifyOtp } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'parent' | 'student' | 'tutor' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [area, setArea] = useState(AREAS[0]);
  const [cnicInput, setCnicInput] = useState('');
  const [cnicValidating, setCnicValidating] = useState(false);
  const [cnicError, setCnicError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[1]);
  const [hourlyRate, setHourlyRate] = useState(2000);
  const [cninMasked, setCninMasked] = useState('');

  if (!signupOpen) return null;

  const toggleSubject = (s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 9 ? [...prev, s] : prev);
  };

  const validateCnic = () => {
    setCnicError('');
    const clean = cnicInput.replace(/[^0-9Xx]/g, '');
    if (clean.length < 13) {
      setCnicError('CNIC must be 13 characters.');
      return;
    }
    setCnicValidating(true);
    setTimeout(() => {
      setCnicValidating(false);
      setCnicError('');
      const masked = clean.substring(0, 3) + '******-' + clean.substring(clean.length - 3);
      setCninMasked(masked);
      setStep(3);
    }, 1500);
  };

  const sendOtp = () => {
    if (!/^03\d{9}$/.test(phone)) {
      return;
    }
    setOtpSent(true);
  };

  const verifyOtpSubmit = () => {
    if (otpInput.length === 6) {
      verifyOtp();
      setStep(4);
    }
  };

  const isTutor = role === 'tutor';

  const canSubmit = name && phone && cnicInput && otpVerified && (isTutor ? subjects.length > 0 : true);

  const handleSubmit = () => {
    if (!canSubmit) return;
    completeSignup({
      role: role!,
      name,
      phone,
      email,
      city,
      area,
      cnicNumber: cnicInput,
      subjects,
      gradeLevel,
      hourlyRatePKR: hourlyRate,
      cnicVerified: true,
    });
  };

  const stepLabels = ['Account', 'CNIC Verification', 'Mobile OTP', 'Profile Details'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="font-bold text-sm block">Create Account</span>
            <p className="text-xs text-slate-400 mt-0.5">Join TuitionFinder</p>
          </div>
          <button onClick={() => setSignupOpen(false)} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex items-center justify-center gap-2 py-3 border-b border-slate-200 shrink-0">
          {stepLabels.map((label, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={label} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-4 h-0.5 bg-slate-200" />}
                <div className={'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ' + (active ? 'bg-emerald-600 text-white' : done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')}>
                  {done ? <CheckCircle size={10} /> : i + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">I am a...</label>
                <div className="space-y-2">
                  {[
                    { id: 'parent' as const, label: 'Parent', desc: 'Finding a tutor for my child', icon: <Building2 size={16} /> },
                    { id: 'student' as const, label: 'Student', desc: 'Finding a tutor for myself', icon: <User size={16} /> },
                    { id: 'tutor' as const, label: 'Tutor', desc: 'Offering tutoring services', icon: <BookOpen size={16} /> },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setRole(opt.id)}
                      className={'w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ' + (role === opt.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50')}>
                      <div className={'w-9 h-9 rounded-xl flex items-center justify-center ' + (role === opt.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>{opt.icon}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-900">{opt.label}</p>
                        <p className="text-[10px] text-slate-500">{opt.desc}</p>
                      </div>
                      {role === opt.id && <CheckCircle size={16} className="text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1"><Smartphone size={12} className="text-slate-400" /> Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="03XXXXXXXXX"
                  maxLength={11}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Email (optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">City</label>
                  <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Area</label>
                  <select value={area} onChange={e => setArea(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint size={20} className="text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">CNIC Verification</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">CNIC verification is required for account security. We verify against NADRA database. Your CNIC number is stored encrypted and never shown publicly.</p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">CNIC Number (13 digits)</label>
                <input type="text" value={cnicInput} onChange={e => setCnicInput(e.target.value.replace(/[^0-9Xx]/g, '').substring(0, 13))} placeholder="35202-1234567-8"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              {cnicError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5">
                  <AlertTriangle size={14} className="text-red-600 shrink-0" />
                  <span className="text-[11px] text-red-700">{cnicError}</span>
                </div>
              )}

              {cnicValidating && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-blue-700">Verifying with NADRA database...</span>
                </div>
              )}

              {cninMasked && !cnicValidating && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 block">CNIC Verified</span>
                    <span className="text-[11px] text-emerald-700 font-mono">{cninMasked}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={20} className="text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">Mobile OTP Verification</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">A 6-digit verification code will be sent to your mobile number via SMS. This ensures your phone number is valid and you own it.</p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                <div className="flex items-center gap-2">
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))} maxLength={11}
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button onClick={sendOtp} disabled={!/^03\d{9}$/.test(phone)}
                    className="px-3 py-2.5 bg-slate-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors">
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {!/^03\d{9}$/.test(phone) && phone.length > 0 && (
                  <p className="text-[10px] text-red-500 mt-1">Enter a valid 11-digit Pakistani number starting with 03</p>
                )}
              </div>

              {otpSent && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Enter 6-digit OTP</label>
                  <input type="text" value={otpInput} onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))} placeholder="000000"
                    className="w-full px-3 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <p className="text-[10px] text-slate-400 mt-1 text-center">Demo: enter any 6 digits to verify</p>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">Profile Details</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Grade Level</label>
                <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {isTutor ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Subjects You Teach (max 9)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {SUBJECTS.slice(0, 20).map(s => (
                        <button key={s} onClick={() => toggleSubject(s)}
                          className={'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ' + (subjects.includes(s) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{subjects.length} subject(s) selected. Max 3 free, 9 with premium.</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1"><CreditCard size={12} className="text-slate-400" /> Monthly Tuition Rate (PKR)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 font-mono">PKR</span>
                      <input type="number" value={hourlyRate} onChange={e => setHourlyRate(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[1000, 1500, 2000, 2500, 3000].map(v => (
                        <button key={v} onClick={() => setHourlyRate(v)}
                          className={'flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-colors ' + (hourlyRate === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                          {v / 1000}K
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Subjects Needed</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.slice(0, 20).map(s => (
                      <button key={s} onClick={() => toggleSubject(s)}
                        className={'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ' + (subjects.includes(s) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{subjects.length} subject(s) selected</p>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Verification Summary</span>
                <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-600" /><span className="text-[11px] text-emerald-800">CNIC Verified: {cninMasked}</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-600" /><span className="text-[11px] text-emerald-800">Phone Verified: {phone}</span></div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 shrink-0">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors">Back</button>
          )}
          {step === 2 && (
            <button onClick={validateCnic} disabled={cnicValidating || cnicInput.length < 13}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
              {cnicValidating ? 'Verifying...' : 'Verify CNIC'}<ArrowRight size={14} />
            </button>
          )}
          {step === 3 && (
            <button onClick={() => { verifyOtp(); setStep(step + 1); }} disabled={!otpSent || otpInput.length < 6}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
              Verify OTP<ArrowRight size={14} />
            </button>
          )}
          {step === 1 && (
            <button onClick={() => setStep(step + 1)}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
              Continue<ArrowRight size={14} />
            </button>
          )}
          {step === 4 && (
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
              <CheckCircle size={14} />Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
