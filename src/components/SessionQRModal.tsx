import React from 'react';
import { X, Shield, CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';

interface Props {
  sessionId: string;
  onClose: () => void;
}

export const SessionQRModal: React.FC<Props> = ({ sessionId, onClose }) => {
  const { sessions } = useApp();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="font-bold text-sm block">Session QR & Escrow</span>
            <p className="text-xs text-slate-400 mt-0.5">{session.subject} with {session.tutorName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl mb-3">
            <QRCodeSVG value={session.qrCode} size={160} />
          </div>
          <span className="font-mono font-bold text-sm text-slate-900">{session.qrCode}</span>
          <p className="text-[11px] text-slate-500 mt-1">Present this QR to your tutor upon arrival</p>
        </div>

        {/* Escrow Breakdown */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-800">Escrow Breakdown (80/20 Split)</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">30-Day Milestone</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="p-2 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 block">Monthly Tuition</span>
              <span className="font-bold text-xs text-slate-900 font-mono">PKR {session.amountPKR.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 block">Platform Fee (20%)</span>
              <span className="font-bold text-xs text-slate-700 font-mono">PKR {session.platformFee.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-700 font-semibold block">Tutor Payout (80%)</span>
              <span className="font-bold text-xs text-emerald-900 font-mono">PKR {session.tutorPayout.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Shield size={12} className="text-emerald-600 shrink-0" />
            <span>Funds held securely. Payout released after 30-day milestone completion.</span>
          </div>
        </div>

        {/* Session Progress */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Sessions Completed</span>
            <span className="text-xs font-bold text-slate-900">{session.sessionsCompleted} / {session.totalSessions}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${(session.sessionsCompleted / session.totalSessions) * 100}%` }} />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500">
            <CheckCircle size={12} className="text-emerald-600" />
            <span>Escrow balance: PKR {session.escrowBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
