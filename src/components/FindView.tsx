import React, { useState } from 'react';
import { Star, MapPin, Shield, Search, Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingModal } from './BookingModal';
import { matchTutors } from '../services/matching';
import { SUBJECTS } from '../data/mockData';

export const FindView: React.FC = () => {
  const { tutors, currentUser, premium, setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bookingTutorId, setBookingTutorId] = useState('');

  const student = {
    id: 'user',
    name: currentUser.name,
    avatar: currentUser.avatar,
    gradeLevel: '10',
    subjects: selectedSubject ? [selectedSubject] : [],
    city: currentUser.city,
    area: 'DHA',
    budgetPKR: 30000,
    cnicVerified: true,
    cnicNumber: '',
    description: ''
  };

  const matched = matchTutors(tutors, student, selectedSubject);
  const filtered = query
    ? matched.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()))
      )
    : matched;

  return (
    <div className="p-4 space-y-3 animate-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Find Tutors</h1>
        <p className="text-xs text-slate-500 mt-0.5">Town-first matching. All payments via platform escrow.</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or subject..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <option value="">All Subjects</option>
        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">No tutors found.</p>
        )}
        {filtered.map(tutor => (
          <div key={tutor.id} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">
                {tutor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{tutor.name}</h3>
                  {tutor.verified && <Shield size={14} className="text-emerald-600 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {tutor.cnicVerified ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                      <Shield size={8} /> CNIC Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                      <Shield size={8} /> CNIC Pending
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{tutor.qualifications}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-amber-500 fill-amber-400" />
                  <span className="text-[11px] font-bold text-slate-700">{tutor.rating}</span>
                  <span className="text-[11px] text-slate-400">({tutor.totalStudents} students)</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tutor.subjects.map(s => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-[11px] text-slate-500">{tutor.area}, {tutor.city}</span>
                  {tutor.area === 'DHA' && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Same area</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <div>
                <span className="text-sm font-bold text-emerald-700 font-mono">PKR {tutor.hourlyRatePKR.toLocaleString()}</span>
                <span className="text-[11px] text-slate-500">/month</span>
              </div>
              <button onClick={() => setBookingTutorId(tutor.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors">
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setActiveTab('bookings')}
        className="w-full py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
        <Megaphone size={14} />
        <span>Post Tuition Need</span>
      </button>

      <BookingModal
        isOpen={!!bookingTutorId}
        tutor={tutors.find(t => t.id === bookingTutorId) || null}
        onClose={() => setBookingTutorId('')}
      />
    </div>
  );
};
