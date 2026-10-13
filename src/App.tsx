import React from 'react';
import { Home, Search, Calendar, User, Megaphone, Shield, FileText, Lock, ArrowRight } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './components/HomeView';
import { FindView } from './components/FindView';
import { BookingsView } from './components/BookingsView';
import { ProfileView } from './components/ProfileView';
import { TuitionNeedView } from './components/TuitionNeedView';
import { RulesView } from './components/RulesView';
import { SignupModal } from './components/SignupModal';

const SignupGate = () => {
  const { userSignedUp, setSignupOpen, currentUser } = useApp();
  
  if (userSignedUp) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">TuitionFinder</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Pakistan's secure tutoring marketplace. All payments via platform escrow. No cash. No off-platform deals.
        </p>
        <button onClick={() => setSignupOpen(true)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
          <User size={18} />
          <span>Create Your Account</span>
          <ArrowRight size={16} />
        </button>
        <p className="text-[10px] text-slate-500 mt-4">
          CNIC + OTP verification required · 15% platform fee · 8% operating fee
        </p>
      </div>
    </div>
  );
};

const BottomNav = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const isTutor = currentUser.role === 'tutor';

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: <Home size={20} /> },
    { id: 'find' as const, label: isTutor ? 'Needs' : 'Find', icon: isTutor ? <Megaphone size={20} /> : <Search size={20} /> },
    { id: 'bookings' as const, label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'needs' as const, label: 'Post Need', icon: <Megaphone size={20} /> },
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

const Header = () => {
  const { activeTab, currentUser, setActiveTab } = useApp();
  const title = activeTab === 'home' ? 'Home' : activeTab === 'find' ? (currentUser.role === 'tutor' ? 'Find Needs' : 'Find Tutors') : activeTab === 'bookings' ? 'Bookings' : activeTab === 'needs' ? 'Post Need' : activeTab === 'profile' ? 'Profile' : 'Rules';
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <button onClick={() => setActiveTab('home')} className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
          <Shield size={14} />
        </div>
        <span className="font-bold text-sm text-slate-900">TuitionFinder</span>
      </button>
      <span className="text-xs font-medium text-slate-500">{title}</span>
    </header>
  );
};

const Shell = () => {
  const { activeTab, userSignedUp } = useApp();

  if (!userSignedUp) {
    return (
      <div className="max-w-md mx-auto h-screen bg-slate-900 flex items-center justify-center">
        <SignupGate />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 flex flex-col shadow-2xl border-x border-slate-200">
      <Header />
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
