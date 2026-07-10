import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { 
  GraduationCap, Briefcase, BookOpen, Compass, 
  MessageSquare, User, Bell, Radio, Menu, X, ArrowRight, ShieldCheck
} from 'lucide-react';

import StudentDashboard from './views/StudentDashboard';
import Marketplace from './views/Marketplace';
import CollabWorkspace from './views/CollabWorkspace';
import AIAgentCenter from './views/AIAgentCenter';
import AdminDashboard from './views/AdminDashboard';
import MentorWorkspace from './views/MentorWorkspace';
import RecruiterHub from './views/RecruiterHub';

function DashboardShell() {
  const { currentRole, handleRoleChange, currentUser, notifications, wsStatus } = useContext(AppContext);
  const [view, setView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map view rendering
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <StudentDashboard setView={setView} />;
      case 'marketplace':
        return <Marketplace />;
      case 'collaboration':
        return <CollabWorkspace />;
      case 'ai-agent':
        return <AIAgentCenter />;
      case 'admin':
        return <AdminDashboard />;
      case 'mentor':
        return <MentorWorkspace />;
      case 'recruiter':
        return <RecruiterHub />;
      default:
        return <StudentDashboard setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col">
      {/* Dynamic Header Navbar */}
      <header className="glass-panel sticky top-0 z-40 border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & WS Gateway Status */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">EduMarket</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${wsStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-zinc-650'}`}></span>
                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Gateway: {wsStatus}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-850">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${view === 'dashboard' ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('marketplace')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${view === 'marketplace' ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => setView('collaboration')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${view === 'collaboration' ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Team Workspaces
            </button>
            <button 
              onClick={() => setView('ai-agent')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${view === 'ai-agent' ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              AI Companion
            </button>
            
            {/* Conditional role navigations */}
            {currentRole === 'admin' && (
              <button 
                onClick={() => setView('admin')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all text-secondary ${view === 'admin' ? 'bg-secondary/15 text-white border border-secondary/20' : 'hover:text-white'}`}
              >
                Admin Stats
              </button>
            )}
            {currentRole === 'mentor' && (
              <button 
                onClick={() => setView('mentor')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all text-primary ${view === 'mentor' ? 'bg-primary/15 text-white border border-primary/20' : 'hover:text-white'}`}
              >
                Mentor Center
              </button>
            )}
            {currentRole === 'recruiter' && (
              <button 
                onClick={() => setView('recruiter')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all text-success ${view === 'recruiter' ? 'bg-success/15 text-white border border-success/20' : 'hover:text-white'}`}
              >
                Recruiter Hub
              </button>
            )}
          </nav>

          {/* User Controls, Role Dropdown, and Notification bells */}
          <div className="flex items-center gap-4">
            
            {/* Quick Role switcher dropdown */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Test Role:</span>
              <select 
                value={currentRole} 
                onChange={(e) => {
                  handleRoleChange(e.target.value);
                  // Automatically redirect to suitable views
                  if (e.target.value === 'mentor') setView('mentor');
                  else if (e.target.value === 'recruiter') setView('recruiter');
                  else if (e.target.value === 'admin') setView('admin');
                  else setView('dashboard');
                }}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="student" className="bg-background">Student</option>
                <option value="mentor" className="bg-background">Mentor (Dr. Marcus)</option>
                <option value="recruiter" className="bg-background">Recruiter (Stripe)</option>
                <option value="alumni" className="bg-background">Alumni (Sarah K.)</option>
                <option value="admin" className="bg-background">Admin (Sarah Jenkins)</option>
              </select>
            </div>

            {/* Notification trigger bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 relative transition-all"
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                )}
              </button>

              {/* Notification drop popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl border border-zinc-800/80 p-4 shadow-2xl z-50 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-850 pb-2">Platform Notifications</h4>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-secondary">{notif.category}</span>
                          <span className="text-zinc-600">{notif.date || 'Live'}</span>
                        </div>
                        <h5 className="font-semibold text-white mt-1">{notif.title}</h5>
                        <p className="text-zinc-400 text-[10px] mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full py-1.5 text-center text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold"
                  >
                    Close Panel
                  </button>
                </div>
              )}
            </div>

            {/* Profile pill */}
            <div className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-4">
              <img 
                src={currentUser.avatar} 
                alt="" 
                className="w-8 h-8 rounded-full object-cover border border-zinc-700"
              />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-500 capitalize">{currentUser.role}</p>
              </div>
            </div>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-zinc-850 text-zinc-350 hover:bg-zinc-800 lg:hidden"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile nav bar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 border-b border-zinc-850 p-4 space-y-2 animate-fadeIn z-30">
          <button 
            onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-white text-left"
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setView('marketplace'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-white text-left"
          >
            Marketplace
          </button>
          <button 
            onClick={() => { setView('collaboration'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-white text-left"
          >
            Team Workspaces
          </button>
          <button 
            onClick={() => { setView('ai-agent'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-white text-left"
          >
            AI Companion
          </button>
        </div>
      )}

      {/* Main Content Layout Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[10px] text-zinc-650">
        © 2026 EduMarket Inc. College Skill Development & Opportunity Ecosystem. Built Open-Source.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}
