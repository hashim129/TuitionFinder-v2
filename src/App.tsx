import React from 'react';
import { Home, Search, Calendar, User, Megaphone, Shield, FileText } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './components/HomeView';
import { FindView } from './components/FindView';
import { BookingsView } from './components/BookingsView';
import { ProfileView } from './components/ProfileView';
import { TuitionNeedView } from './components/TuitionNeedView';
import { RulesView } from './components/RulesView';
import { SignupModal } from './components/SignupModal';

const BottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: <Home size={20} /> },
    { id: 'find' as const, label: 'Find', icon: <Search size={20} /> },
    { id: 'bookings' as const, label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'needs' as const, label: 'Needs', icon: <Megaphone size={20} /> },
    { id: 'profile' as const, label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <nav className="border-t border-slate-200 bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={'flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ' + (activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600')}>
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const Shell = () => {
  const { activeTab } = useApp();

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 flex flex-col shadow-2xl border-x border-slate-200">
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'find' && <FindView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'needs' && <TuitionNeedView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'rules' && <RulesView />}
      </div>
      <BottomNav />
    </div>
  );
};

const Root = () => (
  <AppProvider>
    <Shell />
    <SignupModal />
  </AppProvider>
);

export default Root;
