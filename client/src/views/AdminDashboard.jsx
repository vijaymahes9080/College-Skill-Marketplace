import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Users, DollarSign, TrendingUp, BarChart3, 
  Settings, Award, HelpCircle, Activity, Play 
} from 'lucide-react';

export default function AdminDashboard() {
  const { handleSimulateEvent, notifications } = useContext(AppContext);
  const [stats, setStats] = useState(null);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/v1/admin/analytics');
      if (res.ok) {
        const val = await res.json();
        setStats(val.analytics);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [notifications]); // auto-reload statistics if events trigger notifications

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          University <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Analytics Dashboard</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Track aggregate student skill ratings, marketplace economy volume, placements indices, and department rankings.</p>
      </div>

      {/* Aggregate metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Active Enrolled</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-4">{stats.totalStudents} Students</p>
          <span className="text-[10px] text-zinc-500 block mt-2">Verified Skill Profiles</span>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Market Gigs</span>
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <BarChart3 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-4">{stats.activeGigs} Services</p>
          <span className="text-[10px] text-zinc-500 block mt-2">Active student developer Gigs</span>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Volume</span>
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-4">${stats.totalEarnings}</p>
          <span className="text-[10px] text-zinc-500 block mt-2">Campus Economic Volume</span>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Campus Skill Score</span>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
              <Award size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-4">{stats.averageSkill} / 100</p>
          <span className="text-[10px] text-zinc-500 block mt-2">Aggregate Student index</span>
        </div>
      </div>

      {/* Analytics chart and events controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Department Rankings */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-md font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Department Skill Progress Index
          </h3>
          <div className="space-y-4">
            {stats.departmentPerformance.map((dept, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{dept.name}</h4>
                    <span className="text-[10px] text-zinc-500">{dept.activeStudents} active students participating</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{dept.score}% Index</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: `${dept.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Control Center */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-md font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Settings size={16} className="text-secondary" />
            Platform Simulation Panel
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Trigger custom system events on the Express socket layer. Active browser windows will capture and update widgets in real-time.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => handleSimulateEvent('gig-sale')}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800 hover:text-white flex items-center justify-between transition-all group"
            >
              <span>Trigger Gig Sale ($120)</span>
              <Play size={12} className="text-zinc-500 group-hover:text-primary transition-all" />
            </button>
            <button 
              onClick={() => handleSimulateEvent('recruiter-match')}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800 hover:text-white flex items-center justify-between transition-all group"
            >
              <span>Trigger AI Recruiter Match</span>
              <Play size={12} className="text-zinc-500 group-hover:text-primary transition-all" />
            </button>
            <button 
              onClick={() => handleSimulateEvent('hackathon-launch')}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800 hover:text-white flex items-center justify-between transition-all group"
            >
              <span>Trigger Hackathon Launch</span>
              <Play size={12} className="text-zinc-500 group-hover:text-primary transition-all" />
            </button>
          </div>
          
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-[10px] text-zinc-400 leading-relaxed">
            🎓 <strong>Real-time broadcast:</strong> Simulates API web sockets routing messages (notifications, wallet balance updates) across student client portals.
          </div>
        </div>

      </div>
    </div>
  );
}
