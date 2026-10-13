import React, { useState } from 'react';
import { Megaphone, MapPin, Clock, CreditCard, CheckCircle, X, AlertTriangle, Users, BookOpen, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { SUBJECTS } from '../data/mockData';
import { WEEKDAYS } from '../services/scheduling';
import { Weekday, SessionDurationMinutes, SessionsPerCycle } from '../types';

export const TuitionNeedView: React.FC = () => {
  const { tuitionNeeds, postTuitionNeed, toggleTuitionNeedStatus, currentUser, tutors } = useApp();
  const [showPost, setShowPost] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [budget, setBudget] = useState(20000);
  const [gradeLevel, setGradeLevel] = useState('A-Levels (FSc)');
  const [durationMinutes, setDurationMinutes] = useState<SessionDurationMinutes>(90);
  const [sessionsPerCycle, setSessionsPerCycle] = useState<SessionsPerCycle>(24);
  const [weekdays, setWeekdays] = useState<Weekday[]>(['Mon', 'Wed', 'Fri', 'Sat']);
  const [description, setDescription] = useState('');

  const toggleSubject = (s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleWeekday = (wd: Weekday) => {
    setWeekdays(prev => prev.includes(wd) ? prev.filter(x => x !== wd) : [...prev, wd]);
  };

  const handleSubmit = () => {
    if (subjects.length === 0) return;
    postTuitionNeed({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      subjects,
      gradeLevel,
      city: currentUser.city,
      area: currentUser.area,
      budgetPKR: budget,
      durationMinutes,
      sessionsPerCycle,
      preferredWeekdays: weekdays,
      description: description || `${subjects.join(', ')} tutor needed`,
    });
    setShowPost(false);
    setSubjects([]);
    setDescription('');
  };

  const statusColors = {
    open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
    filled: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="p-4 space-y-4 animate-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Tuition Needs</h1>
        <p className="text-xs text-slate-500 mt-0.5">Broadcast your tuition requirement. Tutors will respond.</p>
      </div>

      <button onClick={() => setShowPost(!showPost)}
        className="w-full py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
        <Megaphone size={14} />
        <span>{showPost ? 'Hide Form' : 'Post New Tuition Need'}</span>
      </button>

      {showPost && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <span className="font-bold text-xs text-slate-700 block">Post Tuition Need</span>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Subjects Needed</label>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => toggleSubject(s)}
                  className={'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ' + (subjects.includes(s) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1"><CreditCard size={12} className="text-slate-400" /> Monthly Budget (PKR)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-mono">PKR</span>
              <input type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2 mt-2">
              {[10000, 15000, 20000, 25000, 30000].map(v => (
                <button key={v} onClick={() => setBudget(v)}
                  className={'flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-colors ' + (budget === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {v / 1000}K
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Grade Level</label>
            <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {['Matric (8th/9th/10th)', 'Intermediate (FSc/FA)', 'A-Levels', 'BSc/BS', 'MSc/MS', 'Graduate', 'Professional (LLB/CAS)'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Session Duration</label>
            <div className="flex gap-2">
              {([90, 120] as SessionDurationMinutes[]).map(d => (
                <button key={d} onClick={() => setDurationMinutes(d)}
                  className={'flex-1 py-2 rounded-xl text-xs font-bold transition-colors ' + (durationMinutes === d ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Sessions per Cycle</label>
            <div className="flex gap-2">
              {([24, 26] as SessionsPerCycle[]).map(s => (
                <button key={s} onClick={() => setSessionsPerCycle(s)}
                  className={'flex-1 py-2 rounded-xl text-xs font-bold transition-colors ' + (sessionsPerCycle === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {s} sessions
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Preferred Weekdays</label>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map(wd => (
                <button key={wd} onClick={() => toggleWeekday(wd)}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ' + (weekdays.includes(wd) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {wd}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Describe what kind of help you need..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>

          <button onClick={handleSubmit} disabled={subjects.length === 0}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
            <Megaphone size={14} />Post Tuition Need
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold text-sm text-slate-900">Active Needs ({tuitionNeeds.filter(n => n.status === 'open' || n.status === 'in_progress').length})</h2>
        {tuitionNeeds.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">No tuition needs posted yet.</p>
        )}
        {tuitionNeeds.map(need => {
          const isMine = need.studentId === currentUser.id;
          const matchingTutors = tutors.filter(t => need.subjects.some(s => t.subjects.includes(s)));
          return (
            <div key={need.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{need.studentAvatar}</div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{need.studentName} {isMine && <span className="text-[10px] text-blue-500">(You)</span>}</p>
                    <p className="text-[10px] text-slate-500">{need.gradeLevel}</p>
                  </div>
                </div>
                <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + statusColors[need.status]}>
                  {need.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {need.subjects.map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={12} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-emerald-700 font-mono">PKR {need.budgetPKR.toLocaleString()}/month</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-[11px] text-slate-600">{need.area}, {need.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-[11px] text-slate-600">{need.durationMinutes}min x {need.sessionsPerCycle}/cycle</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-[11px] text-slate-600">{need.preferredWeekdays.join(', ')}</span>
                </div>
              </div>

              {need.description && (
                <p className="text-[11px] text-slate-600 mb-2">{need.description}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500">{matchingTutors.length} matching tutors · {need.responses} response(s)</span>
                </div>
                {(need.status === 'open' || need.status === 'in_progress') && (
                  <button onClick={() => toggleTuitionNeedStatus(need.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors">
                    {need.status === 'open' ? 'Accept Response' : 'Mark Filled'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
