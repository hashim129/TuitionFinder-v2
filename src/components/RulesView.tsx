import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Ban, Fingerprint, CreditCard, Calendar, Lock, Users, HelpCircle, ArrowRight, FileText, Scale, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RULES = [
  {
    icon: <Fingerprint size={16} />,
    title: '1. Account Registration & Profile Accuracy',
    content: 'All users must complete CNIC verification and mobile OTP verification. Profiles must contain accurate information. Misrepresentation leads to account suspension.'
  },
  {
    icon: <Users size={16} />,
    title: '2. Tutor Qualifications & Subject Representation',
    content: 'Tutors must accurately represent their qualifications and subject expertise. Free profiles limited to 3 subjects; premium adds 6 (9 total). Unverified qualifications may be removed.'
  },
  {
    icon: <Lock size={16} />,
    title: '3. Acceptable Communication',
    content: 'All communication must occur through the platform. Sharing phone numbers, WhatsApp, or personal contact details is prohibited. All deal terms must be booked through the platform.'
  },
  {
    icon: <Calendar size={16} />,
    title: '4. Booking Confirmation & Attendance',
    content: 'Both parties must confirm bookings through the platform. Tutors must attend confirmed sessions. No-shows may result in booking cancellation and account penalties.'
  },
  {
    icon: <Calendar size={16} />,
    title: '5. Scheduling, Cancellations & Rescheduling',
    content: 'Cancellations must follow the rescheduling policy. Confirmed sessions cannot be modified without rescheduling approval. Repeated cancellations may affect account standing.'
  },
  {
    icon: <CreditCard size={16} />,
    title: '6. Pricing Transparency & Payment Obligations',
    content: 'All pricing is transparent and displayed before confirmation. Payments must be made through platform escrow (JazzCash/EasyPaisa/Raast). Cash or off-platform payments are prohibited.'
  },
  {
    icon: <Scale size={16} />,
    title: '7. Tax & Transaction Disclosures',
    content: '8% operating fee is calculated on base tuition and paid by parent/student. Platform fee is 15% commission. All pricing is stored as an immutable snapshot at time of booking.'
  },
  {
    icon: <CreditCard size={16} />,
    title: '8. Refunds & Disputes',
    content: 'Refunds are processed only through the platform. Disputes must be filed within 7 days of the relevant session. Resolution involves platform review and possible refund to escrow.'
  },
  {
    icon: <Ban size={16} />,
    title: '9. Prohibition of Fraud, Harassment & Abuse',
    content: 'Fraud, impersonation, harassment, or abuse of any kind results in immediate suspension. Zero-tolerance policy for payment fraud, fake profiles, or scam attempts.'
  },
  {
    icon: <Lock size={16} />,
    title: '10. Protection of Personal Information',
    content: 'CNIC numbers are stored encrypted and displayed masked. Contact details are unmasked only after escrow payment. User data is never sold to third parties.'
  },
  {
    icon: <FileText size={16} />,
    title: '11. Academic Integrity & Conduct',
    content: 'Tutors must maintain academic integrity. Cheating, plagiarism facilitation, or inappropriate conduct results in immediate removal from the platform.'
  },
  {
    icon: <AlertTriangle size={16} />,
    title: '12. Reviews & Feedback Manipulation',
    content: 'Fake reviews, incentivized ratings, or review manipulation are prohibited. Only genuine feedback from verified completed sessions is accepted.'
  },
  {
    icon: <Users size={16} />,
    title: '13. Premium Package Terms',
    content: 'Premium (PKR 2,000 / 2 months) adds 6 subjects (9 total). Premium does not guarantee top ranking. Subjects remain after expiry but only 3 stay active without renewal.'
  },
  {
    icon: <HelpCircle size={16} />,
    title: '14. Reporting Violations',
    content: 'Users can report violations through the app. Reports are reviewed by the platform team. Reporters are not identified to the reported party. All reports are handled confidentially.'
  },
  {
    icon: <Shield size={16} />,
    title: '15. Investigation & Enforcement',
    content: 'Enforcement levels: Warning → Temporary restriction → Suspension → Termination. Not all reports lead to bans. Human review is used for serious actions. Appeals may be submitted.'
  },
  {
    icon: <Scale size={16} />,
    title: '16. Account Termination & Data',
    content: 'Terminated accounts lose access immediately. Personal data is retained as required by law. Payment data is processed for 7 years for financial compliance.'
  },
  {
    icon: <Info size={16} />,
    title: '17. Contact & Support',
    content: 'Support available through the app. Response times: 24-48 hours. For urgent payment issues, contact the platform directly. Emergency contact for safety concerns available.'
  },
];

export const RulesView: React.FC = () => {
  const { setActiveTab, violations, submitViolation } = useApp();
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState('');
  const [reportTarget, setReportTarget] = useState('');
  const [reportDesc, setReportDesc] = useState('');

  const handleSubmitReport = () => {
    if (!reportCategory || !reportDesc) return;
    submitViolation({
      reporter: 'user',
      targetType: reportTarget as any,
      targetId: reportTarget,
      category: reportCategory,
      description: reportDesc,
    });
    setShowReport(false);
    setReportCategory('');
    setReportTarget('');
    setReportDesc('');
  };

  return (
    <div className="p-4 space-y-4 animate-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Platform Rules</h1>
        <p className="text-xs text-slate-500 mt-0.5">TuitionFinder Terms of Service · Version 1.0 · Effective Oct 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800">By using TuitionFinder, you agree to these terms. Violations may result in warnings, restrictions, suspension, or termination.</p>
      </div>

      {RULES.map((rule, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">{rule.icon}</div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">{rule.title}</h3>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rule.content}</p>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => setShowReport(true)}
        className="w-full py-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
        <AlertTriangle size={14} />
        <span>Report a Violation</span>
      </button>

      {violations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h3 className="font-bold text-xs text-slate-700 block mb-3">Your Reports ({violations.length})</h3>
          <div className="space-y-2">
            {violations.map(v => (
              <div key={v.id} className="bg-slate-50 rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{v.category}</span>
                  <span className="text-[10px] font-bold text-amber-600">{v.status}</span>
                </div>
                <p className="text-[11px] text-slate-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Report a Violation</span>
              <button onClick={() => setShowReport(false)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Violation Category</label>
                <select value={reportCategory} onChange={e => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select category...</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Fake Profile">Fake Profile</option>
                  <option value="Off-platform Deal">Off-platform Deal</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target</label>
                <select value={reportTarget} onChange={e => setReportTarget(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select target...</option>
                  <option value="tutor">Tutor Profile</option>
                  <option value="message">Message</option>
                  <option value="booking">Booking</option>
                  <option value="transaction">Transaction</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Description</label>
                <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} rows={3}
                  placeholder="Describe the violation in detail..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>
              <button onClick={handleSubmitReport} disabled={!reportCategory || !reportDesc}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};