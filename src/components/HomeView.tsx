import React from 'react';
import { Shield, AlertTriangle, CreditCard, Clock, Zap, Megaphone, Info, FileText, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomeView: React.FC = () => {
  const { activeTab, setActiveTab, bookings, otpVerified, setSignupOpen } = useApp();

  return (
    <div className="p-4 space-y-4 animate-in">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Shield size={22} /></div>
          <div><h1 className="font-bold text-lg">TuitionFinder</h1><p className="text-[10px] text-emerald-100">Escrow-only tutoring marketplace</p></div>
        </div>
        <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
          Book verified tutors by location and subject. All payments flow through platform escrow: 16% GST as operating fee & taxes, 15% platform commission. No cash. No off-platform deals.
        </p>
      </div>

      {!otpVerified && (
        <button onClick={() => setSignupOpen(true)}
          className="w-full p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-left">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div><span className="text-xs font-bold text-amber-800 block">Account Not Verified</span><p className="text-[10px] text-amber-700">Complete CNIC + OTP verification</p></div>
        </button>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <span className="text-xs font-bold text-slate-700 block mb-3 flex items-center gap-1"><CreditCard size={14} className="text-emerald-600" /> Pricing Strategy</span>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
            <div><span className="text-xs font-bold text-slate-800 block">Base Tuition</span><p className="text-[10px] text-slate-500">Agreed amount before tax</p></div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
            <div><span className="text-xs font-bold text-slate-800 block">16% GST (Operating Fee & Taxes)</span><p className="text-[10px] text-slate-500">Platform revenue, shown to customer</p></div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
            <div><span className="text-xs font-bold text-slate-800 block">15% Platform Fee</span><p className="text-[10px] text-slate-500">Commission from base tuition</p></div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Example: PKR 20,000 base</span>
          <div className="grid grid-cols-2 gap-2 mt-2 text-center">
            <div className="bg-emerald-50 rounded-xl p-2"><p className="text-sm font-black text-emerald-700 font-mono">PKR 17,000</p><p className="text-[9px] text-slate-500">Tutor receives</p></div>
            <div className="bg-amber-50 rounded-xl p-2"><p className="text-sm font-black text-amber-700 font-mono">PKR 23,200</p><p className="text-[9px] text-slate-500">Parent pays</p></div>
          </div>
          <div className="flex justify-around text-[9px] text-slate-400 mt-1">
            <span>Base - 15% commission</span><span>Base + 16% operating fee</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <span className="text-xs font-bold text-slate-700 block mb-3 flex items-center gap-1"><Zap size={14} className="text-emerald-600" /> Quick Actions</span>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setActiveTab('find')} className="p-3 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 transition-colors">
            <span className="block text-xs font-bold text-emerald-700">Find Tutor</span>
            <span className="block text-[9px] text-emerald-600">Search by subject</span>
          </button>
          <button onClick={() => setActiveTab('bookings')} className="p-3 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
            <span className="block text-xs font-bold text-blue-700 flex items-center justify-center gap-1"><Calendar size={12} />Bookings</span>
            <span className="block text-[9px] text-blue-600">Manage bookings</span>
          </button>
          <button onClick={() => setActiveTab('needs')} className="p-3 bg-slate-100 rounded-xl text-center hover:bg-slate-200 transition-colors">
            <span className="block text-xs font-bold text-slate-700 flex items-center justify-center gap-1"><Megaphone size={12} />Post Need</span>
            <span className="block text-[9px] text-slate-500">Broadcast tuition need</span>
          </button>
          <button onClick={() => setActiveTab('rules')} className="p-3 bg-slate-100 rounded-xl text-center hover:bg-slate-200 transition-colors">
            <span className="block text-xs font-bold text-slate-700 flex items-center justify-center gap-1"><FileText size={12} />Rules</span>
            <span className="block text-[9px] text-slate-500">Platform policies</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <span className="text-xs font-bold text-slate-700 block mb-3 flex items-center gap-1"><Clock size={14} className="text-emerald-600" /> Active Bookings</span>
        {bookings.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-4">No active bookings yet</p>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div><p className="text-xs font-bold text-slate-800">{b.tutorName}</p><p className="text-[10px] text-slate-500">{b.subject}</p></div>
                <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + (b.state === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : b.state === 'awaiting_tutor_confirmation' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500')}>{b.state.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-blue-800 block">CNIC Verification</span>
          <p className="text-[11px] text-blue-700 mt-0.5">All users must complete CNIC verification for account security. CNIC is verified against NADRA and shown masked publicly.</p>
        </div>
      </div>
    </div>
  );
};