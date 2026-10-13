import React, { useState } from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  tutorId: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export const DealModal: React.FC<Props> = ({ isOpen, tutorId, onClose, onConfirm }) => {
  const { tutors } = useApp();
  const tutor = tutors.find(t => t.id === tutorId);
  const [amount, setAmount] = useState(20000);
  const [method, setMethod] = useState<'jazzcash' | 'easypaisa' | 'raast'>('jazzcash');
  const [step, setStep] = useState<'price' | 'payment'>('price');

  if (!isOpen || !tutor) return null;

  const platformFee = Math.round(amount * 0.20);
  const tutorPayout = amount - platformFee;

  const handleConfirm = () => {
    if (step === 'price') {
      setStep('payment');
    } else {
      onConfirm(amount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="font-bold text-sm block">New Session Booking</span>
            <p className="text-xs text-slate-400 mt-0.5">{tutor.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {step === 'price' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Monthly Tuition Amount (PKR)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-mono">PKR</span>
                  <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[10000, 15000, 20000, 25000, 30000].map(v => (
                  <button key={v} onClick={() => setAmount(v)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                      amount === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {v / 1000}K
                  </button>
                ))}
              </div>

              {/* Escrow Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2">
                <span className="font-bold text-xs text-slate-800 block">Escrow Breakdown (80/20 Split)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Tutor Receives (80%)</span>
                    <span className="font-bold text-sm text-emerald-700 font-mono">PKR {tutorPayout.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Platform Fee (20%)</span>
                    <span className="font-bold text-sm text-slate-700 font-mono">PKR {platformFee.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500">
                  <Shield size={12} className="text-emerald-600 shrink-0" />
                  <span>Funds held in escrow. Released after 30-day verification.</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Payment Method</label>
                <div className="space-y-2">
                  {(['jazzcash', 'easypaisa', 'raast'] as const).map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                        method === m ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          m === 'jazzcash' ? 'bg-red-100 text-red-700' :
                          m === 'easypaisa' ? 'bg-orange-100 text-orange-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {m === 'jazzcash' ? 'JC' : m === 'easypaisa' ? 'EP' : 'R'}
                        </div>
                        <span className="text-sm font-medium text-slate-900 capitalize">{m}</span>
                      </div>
                      {method === m && <CheckCircle size={16} className="text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">Total to Pay: </span>
                <span className="font-mono font-bold text-emerald-700">PKR {amount.toLocaleString()}</span>
                <p className="mt-1 text-slate-500">This amount will be held in platform escrow for one month.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
          {step === 'payment' && (
            <button onClick={() => setStep('price')}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors">
              Back
            </button>
          )}
          <button onClick={handleConfirm}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors">
            {step === 'price' ? 'Continue to Payment' : `Pay PKR ${amount.toLocaleString()} & Book Session`}
          </button>
        </div>
      </div>
    </div>
  );
};
