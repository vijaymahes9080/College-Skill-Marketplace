import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { BookOpen, CheckSquare, Plus, RefreshCw, Send, ShieldAlert, Award } from 'lucide-react';

export default function MentorWorkspace() {
  const { challenges, studentProfile, handlePublishChallenge } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);

  // New challenge form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('');
  const [badge, setBadge] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Grading queue items
  const [gradingQueue, setGradingQueue] = useState([
    { id: 'sub-1', studentName: 'Alex Chen', challengeTitle: 'Optimization Challenge', repo: 'alex-c/fast-pathfinder', date: 'Yesterday' },
    { id: 'sub-2', studentName: 'Priya Sharma', challengeTitle: 'Wireframe Layout Prototype', repo: 'priya-s/smart-campus-figma', date: '2 days ago' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !points || !badge || !dueDate) {
      alert("Please fill out all fields.");
      return;
    }
    const success = await handlePublishChallenge({ title, description: desc, points: Number(points), badge, dueDate });
    if (success) {
      setShowForm(false);
      setTitle('');
      setDesc('');
      setPoints('');
      setBadge('');
      setDueDate('');
      alert("🚀 Class challenge successfully dispatched to all students!");
    }
  };

  const handleGrade = (id, approve) => {
    setGradingQueue(prev => prev.filter(item => item.id !== id));
    if (approve) {
      alert("🏆 Submission approved! Certifications and skill points successfully updated on Student Profile.");
    } else {
      alert("📁 Submission flagged for review and revisions.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Faculty & Mentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Workspace</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Grade student submissions, verify skill portfolios, publish certification pathways, and coordinate project teams.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white text-sm font-semibold hover:glow-purple transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          Publish Challenge
        </button>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double-Column - submissions queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare size={16} className="text-primary" />
              Submissions Review Center
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-bold">
              {gradingQueue.length} pending review
            </span>
          </div>

          {gradingQueue.length === 0 ? (
            <div className="glass-card p-8 text-center text-zinc-500 text-xs">
              All student submissions reviewed and certified!
            </div>
          ) : (
            <div className="space-y-4">
              {gradingQueue.map((item) => (
                <div key={item.id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">GitHub Branch Submitted</span>
                    <h3 className="text-md font-bold text-white mt-1">{item.studentName}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Assigned Challenge: {item.challengeTitle}</p>
                    <a href={`https://github.com/${item.repo}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary mt-2 inline-flex items-center gap-1 hover:underline">
                      view repository: github.com/{item.repo}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGrade(item.id, false)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold hover:border-zinc-700 hover:text-white transition-all"
                    >
                      Request Revisions
                    </button>
                    <button 
                      onClick={() => handleGrade(item.id, true)}
                      className="px-4 py-2 rounded-xl bg-success hover:bg-success-hover text-white text-xs font-semibold hover:glow-purple transition-all flex items-center gap-1.5"
                    >
                      <Award size={14} />
                      Verify & Certify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - active challenge dashboard */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-secondary" />
              Active Classroom Challenges
            </h3>
            <div className="space-y-3">
              {challenges.map((chal, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                  <h4 className="text-xs font-bold text-white leading-normal">{chal.title}</h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{chal.description}</p>
                  
                  <div className="flex items-center justify-between text-[8px] text-zinc-500 pt-2 border-t border-zinc-900">
                    <span>Reward: +{chal.points} XP</span>
                    <span>Due: {chal.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* PUBLISH CHALLENGE MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="glass-card w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-zoomIn space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Class Challenge</h3>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="text-zinc-500 hover:text-white font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Challenge Title</label>
              <input
                type="text"
                placeholder="e.g. Write optimized DB indexes lookup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Instructions & Deliverables</label>
              <textarea
                placeholder="Explain the performance test requirements..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">XP Reward Points</label>
                <input
                  type="number"
                  placeholder="200"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Award Certification Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Optimization Expert"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Submission Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-350 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple text-white text-xs font-semibold transition-all"
              >
                Launch Challenge
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
