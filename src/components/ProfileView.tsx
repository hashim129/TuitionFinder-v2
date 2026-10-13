import React, { useState } from 'react';
import { Shield, Wallet, BookOpen, CheckCircle, ArrowRight, Settings, Bell, HelpCircle, LogOut, Fingerprint, Smartphone, Lock, Megaphone, Calendar, CreditCard, AlertTriangle, X, CheckCircle2, Ban, AlertOctagon, Clock, Phone, Mail, MessageCircle, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculatePricing } from '../services/pricing';
import { SUBJECTS } from '../data/mockData';

export const ProfileView: React.FC = () => {
  const {
    currentUser, sessions, setActiveTab, premium, addPremiumSubject,
    bookings, tuitionNeeds, violations, setSignupOpen
  } = useApp();

  const [showPremium, setShowPremium] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const totalEscrow = sessions.reduce((s, sess) => s + sess.escrowBalance, 0);
  const totalTutorPayout = sessions.reduce((s, sess) => s + sess.tutorPayout, 0);
  const totalPlatformFee = sessions.reduce((s, sess) => s + sess.platformFee, 0);

  // Notifications data
  const notifications = [
    { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Engr. Ahmad Raza confirmed your Physics booking for Monday.', time: '2h ago', read: false },
    { id: 2, type: 'payment', title: 'Payment Processed', message: 'PKR 23,200 held in escrow for your Physics sessions.', time: '5h ago', read: false },
    { id: 3, type: 'session', title: 'Session Reminder', message: 'Your Physics session with Engr. Ahmad Raza is tomorrow at 6:00 PM.', time: '1d ago', read: true },
    { id: 4, type: 'tutor', title: 'New Tutor Available', message: 'Dr. Fatima Zahra (Mathematics, Calculus) is now available in your area.', time: '2d ago', read: true },
    { id: 5, type: 'system', title: 'Account Verified', message: 'Your CNIC verification has been completed successfully.', time: '3d ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Masked CNIC - show only last 4 digits
  const maskedCnic = currentUser.cnicNumber ? currentUser.cnicNumber.replace(/^(\d{3}).*(\d{4})$/, '$1****-$2') : '35202-****-**7';

  return (
    <div className="p-4 space-y-4 animate-in">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold mx-auto mb-2">
          {currentUser.avatar}
        </div>
        <h1 className="text-lg font-bold text-slate-900">{currentUser.name}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{currentUser.phone} · {currentUser.city}</p>
        <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
          {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} / Student
        </span>

        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint size={14} className="text-slate-400" />
              <span className="text-xs text-slate-600">CNIC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-800">{maskedCnic}</span>
              {currentUser.cnicVerified ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle size={8} /> Verified
                </span>
              ) : (
                <button onClick={() => setSignupOpen(true)} className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">Verify</button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={14} className="text-slate-400" />
              <span className="text-xs text-slate-600">Mobile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold">{currentUser.phone}</span>
              {currentUser.otpVerified ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle size={8} /> OTP Verified
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Summary */}
      <div className="bg-emerald-600 text-white rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} />
          <span className="font-bold text-sm">Platform Escrow Summary</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-[10px] opacity-80">Total Escrow</p>
            <p className="font-bold text-sm font-mono">PKR {totalEscrow.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-[10px] opacity-80">Tutor Payout</p>
            <p className="font-bold text-sm font-mono">PKR {totalTutorPayout.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-[10px] opacity-80">Platform Fee (15%)</p>
            <p className="font-bold text-sm font-mono">PKR {totalPlatformFee.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Active Bookings</h2>
          <span className="text-[10px] text-slate-400">{bookings.filter(b => b.state !== 'cancelled').length} active</span>
        </div>
        {bookings.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No bookings yet. Find a tutor and book a session.</p>
            <button onClick={() => setActiveTab('find')} className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Find Tutor</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map(b => (
              <div key={b.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{b.tutorName}</p>
                    <p className="text-[10px] text-slate-500">{b.subject} · {b.weekdays.join(', ')} · {b.durationMinutes}m</p>
                  </div>
                  <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + (
                    b.state === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    b.state === 'awaiting_tutor_confirmation' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  )}>{b.state.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-700 font-mono">PKR {b.pricing.totalParentPays.toLocaleString()}</span>
                  {b.canRebook && (
                    <button onClick={() => setActiveTab('find')} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">Re-book</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tuition Needs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><Megaphone size={12} /> Tuition Needs</h2>
          <span className="text-[10px] text-slate-400">{tuitionNeeds.length} total</span>
        </div>
        <button onClick={() => setActiveTab('needs')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Megaphone size={16} />
            </div>
            <span className="text-sm font-medium text-slate-900">Post & Manage Needs</span>
          </div>
          <ArrowRight size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Premium Upgrades */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><Wallet size={12} /> Premium Upgrades</h2>
          <span className="text-[10px] text-slate-400">{premium.active ? `EXPIRES ${premium.expiryDate}` : 'FREE PLAN'}</span>
        </div>
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{premium.active ? 'Active Premium' : 'Add Premium Subject'}</p>
                <p className="text-[11px] text-slate-500">3 subjects free + 6 premium (9 total)</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">PKR 2,000 / 2 mo</span>
            </div>
            {premium.active && (
              <div className="mb-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700">Active until: <b>{premium.expiryDate}</b></span>
                  <span className="text-emerald-700">{premium.additionalSubjectCount} premium subjects</span>
                </div>
              </div>
            )}
            <button onClick={() => {
              const ok = addPremiumSubject();
              if (!ok) {
                alert('Premium is already active.');
              }
            }}
              disabled={premium.active}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold">
              {premium.active ? 'Premium Active' : 'Buy Premium (PKR 2,000)'}
            </button>
        </div>
      </div>

      {/* Violations */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><AlertTriangle size={12} /> Violations</h2>
          <span className="text-[10px] text-slate-400">{violations.length} reported</span>
        </div>
        {violations.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No violations reported. Keep it clean!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {violations.map(v => (
              <div key={v.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{v.category}</span>
                  <span className="text-[10px] font-bold text-red-600">SUBMITTED</span>
                </div>
                <p className="text-[11px] text-slate-600">{v.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Account</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <button onClick={() => setActiveTab('home')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Settings size={16} /></div>
              <span className="text-sm font-medium text-slate-900">Account Settings</span>
            </div>
            <ArrowRight size={16} className="text-slate-400" />
          </button>
          <button onClick={() => setShowNotifications(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Bell size={16} /></div>
              <span className="text-sm font-medium text-slate-900">Notifications</span>
              {unreadCount > 0 && <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </div>
            <ArrowRight size={16} className="text-slate-400" />
          </button>
          <button onClick={() => setShowHelp(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><HelpCircle size={16} /></div>
              <span className="text-sm font-medium text-slate-900">Help & Support</span>
            </div>
            <ArrowRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl hover:bg-red-100 transition-colors">
        <LogOut size={16} />
        <span className="text-sm font-medium">Sign Out</span>
      </button>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={16} />
                <span className="font-bold text-sm">Notifications</span>
              </div>
              <button onClick={() => setShowNotifications(false)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={'p-4 border-b border-slate-100 ' + (n.read ? '' : 'bg-emerald-50/50')}>
                  <div className="flex items-start gap-3">
                    <div className={'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ' + (n.read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600')}>
                      {n.type === 'booking' ? <Calendar size={14} /> :
                       n.type === 'payment' ? <CreditCard size={14} /> :
                       n.type === 'session' ? <Clock size={14} /> :
                       n.type === 'tutor' ? <Shield size={14} /> : <CheckCircle size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} />
                <span className="font-bold text-sm">Help & Support</span>
              </div>
              <button onClick={() => setShowHelp(false)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <button onClick={() => { setShowHelp(false); setActiveTab('rules'); }}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><FileText size={16} /></div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 block">Platform Rules & Policies</span>
                  <span className="text-[10px] text-slate-500">Terms of Service, privacy policy, refund policy</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>

              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Contact Support</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><Phone size={14} /></div>
                  <div><span className="text-xs font-bold block">Phone</span><span className="text-[10px] text-slate-500">0300-1234567 (9AM-9PM)</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0"><Mail size={14} /></div>
                  <div><span className="text-xs font-bold block">Email</span><span className="text-[10px] text-slate-500">support@tuitionfinder.pk</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0"><MessageCircle size={14} /></div>
                  <div><span className="text-xs font-bold block">WhatsApp</span><span className="text-[10px] text-slate-500">0321-1234567</span></div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800">Response time: 24-48 hours. For urgent payment issues, use the priority queue.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};