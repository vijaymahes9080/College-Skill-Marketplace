import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Sliders, Briefcase, Calendar, Plus, UserCheck, Star, Users } from 'lucide-react';

export default function RecruiterHub() {
  const { jobs, studentProfile, alumniSlots, currentUser, handlePublishJob } = useContext(AppContext);
  const [showJobModal, setShowJobModal] = useState(false);

  // Job form states
  const [title, setTitle] = useState('');
  const [stipend, setStipend] = useState('');
  const [loc, setLoc] = useState('Remote');
  const [reqSkills, setReqSkills] = useState('');
  const [desc, setDesc] = useState('');

  // Semantic search match settings
  const [reactWeight, setReactWeight] = useState(80);
  const [designWeight, setDesignWeight] = useState(50);
  const [compatibilityScore, setCompatibilityScore] = useState(88);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!title || !stipend || !desc) {
      alert("Please fill in core details.");
      return;
    }
    const skillsArr = reqSkills.split(',').map(s => s.trim()).filter(Boolean);
    const success = await handlePublishJob({
      title,
      stipend,
      location: loc,
      skillsRequired: skillsArr,
      description: desc
    });

    if (success) {
      setShowJobModal(false);
      setTitle('');
      setStipend('');
      setReqSkills('');
      setDesc('');
      alert("🚀 Internship post successfully listed for all college students!");
    }
  };

  // Mock semantic profiles matching
  const matchingCandidates = [
    { name: 'Alex Chen', department: 'Computer Science & Engineering', compatibility: compatibilityScore, skills: ['React.js', 'Node.js', 'FastAPI'], avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', portfolioScore: 90 },
    { name: 'Priya Sharma', department: 'Design & Creative Arts', compatibility: Math.round(designWeight * 1.05), skills: ['Figma', 'UI/UX Design', 'Illustration'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', portfolioScore: 95 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Recruiter & Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sponsor Hub</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Search student portfolios by verified classroom skill ratings, publish internships, and schedule mentoring sessions.</p>
        </div>

        {currentUser.role === 'recruiter' && (
          <button 
            onClick={() => setShowJobModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white text-sm font-semibold hover:glow-purple transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Post Internship
          </button>
        )}
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recruiter semantic search panel */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-md font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              AI Semantic Student Matchmaker
            </h3>
            
            {/* Weight Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>React / Full-Stack Weight</span>
                  <span className="text-primary font-bold">{reactWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={reactWeight}
                  onChange={(e) => {
                    setReactWeight(Number(e.target.value));
                    setCompatibilityScore(Math.round(40 + Number(e.target.value) * 0.48));
                  }}
                  className="w-full accent-primary bg-zinc-800 h-1 rounded" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>UI / Figma Experience Weight</span>
                  <span className="text-secondary font-bold">{designWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={designWeight}
                  onChange={(e) => setDesignWeight(Number(e.target.value))}
                  className="w-full accent-secondary bg-zinc-800 h-1 rounded" 
                />
              </div>
            </div>

            {/* List matching candidates */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/80">
              <h4 className="text-xs font-bold text-zinc-400">Matching Profiles sorted by score</h4>
              <div className="space-y-3">
                {matchingCandidates.map((candidate, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={candidate.avatar} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{candidate.name}</h4>
                        <p className="text-[10px] text-zinc-500">{candidate.department}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {candidate.skills.map((s, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center md:flex-col gap-3 md:gap-0 justify-between md:justify-center">
                      <span className="text-[10px] text-zinc-500">AI Compatibility</span>
                      <p className="text-md font-bold text-success mt-0.5">{candidate.compatibility}%</p>
                      <button 
                        onClick={() => alert(`📧 Interview invitation sent to ${candidate.name}.`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-bold text-zinc-300 transition-all mt-2"
                      >
                        Contact Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Gigs & Alumni network */}
        <div className="space-y-6">
          {/* Active Job vacancy postings */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-secondary" />
              Posted Opportunities
            </h3>
            <div className="space-y-3">
              {jobs.map((job, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-secondary">{job.company}</span>
                    <span className="text-[9px] text-success font-bold">{job.stipend}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{job.title}</h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alumni Mentor Schedule */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Alumni Mentorship Slots
            </h3>
            <div className="space-y-3">
              {alumniSlots.map((slot, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                  <h4 className="text-xs font-bold text-white">{slot.title}</h4>
                  <p className="text-[10px] text-zinc-550">Mentor: {slot.alumniName}</p>
                  
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-2 border-t border-zinc-900">
                    <span>{slot.time}</span>
                    <button 
                      onClick={() => alert("🎉 Registered for mentoring session slot!")}
                      className="px-2 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* POST JOB MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleJobSubmit}
            className="glass-card w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-zoomIn space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Post Internship Placement</h3>
              <button 
                type="button"
                onClick={() => setShowJobModal(false)}
                className="text-zinc-500 hover:text-white font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Position Title</label>
              <input
                type="text"
                placeholder="e.g. Back-End Engineering Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Monthly Stipend</label>
                <input
                  type="text"
                  placeholder="e.g. $2,500/mo"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote / SF"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Required Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="React.js, Node.js, SQLite"
                value={reqSkills}
                onChange={(e) => setReqSkills(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Role Description</label>
              <textarea
                placeholder="Describe role responsibilities..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
              <button 
                type="button"
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple text-white text-xs font-semibold transition-all"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
