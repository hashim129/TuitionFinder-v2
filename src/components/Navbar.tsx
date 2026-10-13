import React from 'react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">TF</div>
        <div>
          <span className="font-bold text-slate-900 text-sm block leading-none">TuitionFinder</span>
          <span className="text-[10px] text-slate-500 block">Lahore, Pakistan</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500">{currentUser.name.split(' ')[0]}</span>
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">{currentUser.avatar}</div>
      </div>
    </header>
  );
};
