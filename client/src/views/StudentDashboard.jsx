import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  TrendingUp, Award, DollarSign, BookOpen, 
  Trophy, Brain, Zap, GraduationCap, ArrowRight, CheckCircle2 
} from 'lucide-react';

export default function StudentDashboard({ setView }) {
  const { studentProfile, notifications, currentRole, handleSimulateEvent } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');

  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border-gradient-violet p-8 bg-zinc-950/40 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pulse-glow"></div>
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-secondary/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/20 text-primary border border-primary/30">
              Level {studentProfile.level} Student
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{studentProfile.name}</span>!
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-sm leading-relaxed">
              Your profile is verified and active. You have earned <span className="text-success font-semibold">${studentProfile.earnings}</span> this semester and added 3 new skills to your portfolio.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setView('ai-agent')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple text-white text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Brain size={16} />
              AI Career Companion
            </button>
            <button 
              onClick={() => setView('marketplace')}
              className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold transition-all flex items-center gap-2"
            >
              Find Gigs
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-medium tracking-wide uppercase">Skill Score</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{studentProfile.skillScore}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${studentProfile.skillScore}%` }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-medium tracking-wide uppercase">Career Score</span>
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{studentProfile.careerScore}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${studentProfile.careerScore}%` }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-medium tracking-wide uppercase">Portfolio Strength</span>
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{studentProfile.portfolioStrength}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-success h-full rounded-full" style={{ width: `${studentProfile.portfolioStrength}%` }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-medium tracking-wide uppercase">Total Earnings</span>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">${studentProfile.earnings}</span>
            <span className="text-xs text-zinc-500">USD</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2">Commission rate: 10% platform fee</p>
        </div>
      </div>

      {/* Main Panel Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double-Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sub-tabs Selection */}
          <div className="flex border-b border-zinc-800 gap-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 text-sm font-semibold relative ${activeTab === 'overview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Overview & Skills
              {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('learning')}
              className={`pb-4 text-sm font-semibold relative ${activeTab === 'learning' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Learning & Challenges
              {activeTab === 'learning' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`pb-4 text-sm font-semibold relative ${activeTab === 'timeline' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Timeline Achievements
              {activeTab === 'timeline' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Skill Checklist cards */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">My Core Skills Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentProfile.skills.map((skill, index) => (
                    <div key={index} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{skill.name}</h4>
                          {skill.verified && (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-success/20 text-success border border-success/30 flex items-center gap-1">
                              <CheckCircle2 size={8} /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 capitalize">Proficiency: {skill.level}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-zinc-300">{skill.score}%</span>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Mock Grade</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic project showcase card */}
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Active Projects & Gigs Workspace</h3>
                  <button 
                    onClick={() => setView('collaboration')}
                    className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                  >
                    Go to Workspace <ArrowRight size={12} />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-secondary/20 text-secondary border border-secondary/30">
                      GitHub Linked
                    </span>
                    <h4 className="text-md font-bold text-white mt-2">Smart Campus Nav</h4>
                    <p className="text-xs text-zinc-400 mt-1">Collab team: Alex, Priya. Submissions scheduled next week.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">1 task in progress, 2 to-do</span>
                    <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center text-xs font-semibold text-secondary">
                      50%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-6">
              {/* Learning Progress List */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Enrolled Course Learning Paths</h3>
                <div className="space-y-4">
                  {studentProfile.learningPath.map((path, index) => (
                    <div key={index} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-sm">{path.title}</h4>
                          <span className="text-xs text-zinc-500">{path.lessonsCompleted} of {path.totalLessons} lessons finished</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 capitalize">{path.status}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${path.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open challenges panel */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Mentor Classroom Assignments</h3>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">Advanced Optimization Challenge</h4>
                    <p className="text-xs text-zinc-400 mt-1">Submit optimized pathfinding routine for 10K requests/min.</p>
                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                      +250 XP • Optimization Wizard Badge
                    </span>
                  </div>
                  <button 
                    onClick={() => setView('collaboration')}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-all"
                  >
                    Solve
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Achievement Timeline Milestones</h3>
              <div className="relative border-l border-zinc-800 ml-4 space-y-8 pb-4">
                {studentProfile.achievements.map((ach, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                    <span className="text-xs text-zinc-500 block">{ach.date}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{ach.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Widget Column */}
        <div className="space-y-6">
          
          {/* AI Helper mini widget */}
          <div className="glass-card border-gradient-violet p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Brain size={18} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">AI Career Advice</h4>
                <p className="text-[10px] text-zinc-500">Agentic Career Matcher</p>
              </div>
            </div>
            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
              "Based on your 92% React.js certification and current UI/UX project workload, you are in the top 5% of candidate matches for Stripe's Front-End React Intern role."
            </div>
            <button 
              onClick={() => setView('ai-agent')}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1"
            >
              Open AI Companion Center <ArrowRight size={12} />
            </button>
          </div>

          {/* Notifications Feed */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold tracking-wide uppercase text-zinc-400">Campus Activity</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif, index) => (
                <div key={index} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex gap-2">
                  <div className="mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary block"></span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">{notif.title}</h5>
                    <p className="text-zinc-400 mt-0.5">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dev Quick simulation controls */}
          <div className="glass-card p-6 rounded-2xl space-y-4 border border-zinc-800">
            <h3 className="text-sm font-bold tracking-wide uppercase text-zinc-400">Event Simulator</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">Test real-time WS integrations by triggering global student platform events.</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleSimulateEvent('gig-sale')}
                className="py-2 text-[10px] font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
              >
                Simulate Gig Purchase
              </button>
              <button 
                onClick={() => handleSimulateEvent('recruiter-match')}
                className="py-2 text-[10px] font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
              >
                Simulate Recruiter Match
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
