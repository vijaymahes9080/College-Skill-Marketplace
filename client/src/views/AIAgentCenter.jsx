import React, { useState } from 'react';
import { 
  Brain, FileText, Compass, GraduationCap, 
  Lightbulb, HelpCircle, ArrowRight, UserCheck, CheckSquare, RefreshCw 
} from 'lucide-react';

export default function AIAgentCenter() {
  const [selectedAgent, setSelectedAgent] = useState('advisor');
  const [isLoading, setIsLoading] = useState(false);

  // Chat inputs
  const [advisorGoal, setAdvisorGoal] = useState('Full Stack AI Developer');
  const [advisorOutput, setAdvisorOutput] = useState(null);

  // Resume compiler
  const [resumeOutput, setResumeOutput] = useState(null);

  // Gap analysis
  const [targetRole, setTargetRole] = useState('Front-End React Intern (Stripe)');
  const [gapOutput, setGapOutput] = useState(null);

  // Interview trainer
  const [interviewQuestion, setInterviewQuestion] = useState('How do you manage client-side state optimization in deep React component structures?');
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewOutput, setInterviewOutput] = useState(null);

  const agents = [
    { id: 'advisor', name: 'Career Advisor', icon: Compass, color: 'text-primary' },
    { id: 'resume', name: 'Resume Builder', icon: FileText, color: 'text-secondary' },
    { id: 'gap', name: 'Skill Gap Detector', icon: Brain, color: 'text-red-400' },
    { id: 'planner', name: 'Learning Planner', icon: GraduationCap, color: 'text-green-400' },
    { id: 'projects', name: 'Project Recommender', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 'interview', name: 'Interview Trainer', icon: HelpCircle, color: 'text-pink-400' }
  ];

  // Agent Actions
  const runCareerAdvisor = async () => {
    setIsLoading(true);
    setAdvisorOutput(null);
    try {
      const res = await fetch('/api/v1/ai/career-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: ['React', 'Node'], goal: advisorGoal })
      });
      if (res.ok) {
        const val = await res.json();
        setAdvisorOutput(val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const runResumeBuilder = async () => {
    setIsLoading(true);
    setResumeOutput(null);
    try {
      const res = await fetch('/api/v1/ai/resume-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: 'Alex Chen', skills: [{ name: 'React' }, { name: 'Node' }] })
      });
      if (res.ok) {
        const val = await res.json();
        setResumeOutput(val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const runGapAnalyzer = async () => {
    setIsLoading(true);
    setGapOutput(null);
    try {
      const res = await fetch('/api/v1/ai/gap-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      });
      if (res.ok) {
        const val = await res.json();
        setGapOutput(val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const runInterviewGrade = async () => {
    if (!interviewAnswer.trim()) {
      alert("Please enter a response to analyze.");
      return;
    }
    setIsLoading(true);
    setInterviewOutput(null);
    try {
      const res = await fetch('/api/v1/ai/interview-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: interviewQuestion, answer: interviewAnswer })
      });
      if (res.ok) {
        const val = await res.json();
        setInterviewOutput(val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Coaching Center</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Leverage 8 multi-agent specialized networks to accelerate career navigation, project validations, and interview readiness.</p>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = selectedAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgent(agent.id);
                setIsLoading(false);
              }}
              className={`glass-card p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all text-center ${
                isActive 
                ? 'border-primary bg-primary/10 hover:bg-primary/15' 
                : 'hover:border-zinc-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-zinc-900 ${agent.color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold text-white">{agent.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Agent Sandbox */}
      <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

        {/* 1. CAREER ADVISOR CONSOLE */}
        {selectedAgent === 'advisor' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Compass size={18} className="text-primary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Career path routing agent</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Long term dream goal</label>
                <input
                  type="text"
                  value={advisorGoal}
                  onChange={(e) => setAdvisorGoal(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button 
                onClick={runCareerAdvisor}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple disabled:opacity-55 text-white text-xs font-semibold transition-all flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={12} /> : 'Calculate Roadmap'}
              </button>
            </div>

            {advisorOutput && (
              <div className="space-y-6 pt-4 border-t border-zinc-900 animate-fadeIn">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Recommended Career Track</span>
                  <p className="text-md font-bold text-white mt-1">{advisorOutput.careerPath}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    <h4 className="text-xs font-bold text-zinc-300">Bi-Weekly Skill Roadmap</h4>
                    <ul className="space-y-2">
                      {advisorOutput.roadmap.map((rm, idx) => (
                        <li key={idx} className="text-xs text-zinc-400">
                          <strong className="text-primary">{rm.week}:</strong> {rm.focus}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    <h4 className="text-xs font-bold text-zinc-300">Recommended Next Steps</h4>
                    <div className="space-y-2">
                      {advisorOutput.recommendations.map((rec, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between text-zinc-400 p-2 rounded bg-zinc-900 border border-zinc-800">
                          <span>{rec.title}</span>
                          <span className="text-secondary text-[10px] uppercase font-bold">{rec.reward || rec.estPrice || 'Course'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. RESUME BUILDER CONSOLE */}
        {selectedAgent === 'resume' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <FileText size={18} className="text-secondary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">ATS Optimizer & Compiler</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The Resume Builder Agent auto-compiles your validated classroom projects, peer gig contracts, and ratings into an ATS-optimized layout designed for companies like Google or Stripe.
                </p>
                <button 
                  onClick={runResumeBuilder}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-hover text-white text-xs font-semibold hover:glow-cyan disabled:opacity-55 transition-all"
                >
                  {isLoading ? 'Compiling Portfolio...' : 'Generate Resume & Portfolio'}
                </button>
              </div>

              {resumeOutput && (
                <div className="flex-1 space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">ATS Readiness Score</span>
                    <span className="text-xs font-bold text-success">{resumeOutput.atsScore}% Match</span>
                  </div>
                  
                  <pre className="p-3 bg-zinc-900 rounded-lg text-[10px] text-zinc-400 font-mono overflow-x-auto max-h-[220px] select-all whitespace-pre-wrap">
                    {resumeOutput.resumeMarkdown}
                  </pre>
                  
                  <div className="p-2 border border-zinc-800 rounded bg-zinc-900/60 text-[10px] text-zinc-500">
                    💡 <strong>AI Suggestion:</strong> {resumeOutput.suggestions[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. SKILL GAP ANALYZER */}
        {selectedAgent === 'gap' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Brain size={18} className="text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Target Role Gap Analyzer</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Target Job Position / Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button 
                onClick={runGapAnalyzer}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-650 disabled:opacity-55 transition-all"
              >
                {isLoading ? 'Scanning Requirements...' : 'Check Gaps'}
              </button>
            </div>

            {gapOutput && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900 animate-fadeIn">
                <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300">Missing Proficiencies</h4>
                    <span className="text-[10px] font-extrabold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                      Match: {gapOutput.matchingScore}%
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {gapOutput.missingSkills.map((sk, idx) => (
                      <li key={idx} className="text-xs text-red-300/80 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {sk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <h4 className="text-xs font-bold text-zinc-300">Action Plan to Qualify</h4>
                  <ul className="space-y-2">
                    {gapOutput.remediationPlan.map((step, idx) => (
                      <li key={idx} className="text-xs text-zinc-400">
                        <strong className="text-secondary">{step.step}:</strong> {step.action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. LEARNING PLANNER */}
        {selectedAgent === 'planner' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-green-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Learning Optimizer</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              This planner evaluates missing target requirements from your gap analysis log, generates a micro-course list, and creates scheduled quizzes.
            </p>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
              <h4 className="text-xs font-bold text-zinc-300">Generated Course Sequence for React Development</h4>
              <div className="space-y-2">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-white">Course CS-409: REST Architecture Scaling</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Faculty Sponsor: Dr. Vance Vance</p>
                  </div>
                  <span className="text-xs text-primary font-bold">120 XP</span>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-white">Figma to React Component Integration Workshop</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Sponsor Class of '22 Alumni</p>
                  </div>
                  <span className="text-xs text-primary font-bold">90 XP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PROJECT RECOMMENDER */}
        {selectedAgent === 'projects' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Custom Project Generator</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              Tell the agent your tech preferences and get a mock team project plan structure.
            </p>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
              <h4 className="text-xs font-bold text-zinc-300">Generated Startup/Idea prompt</h4>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs leading-relaxed text-zinc-300">
                <strong>Project:</strong> Build a Decentralized Campus Escrow Manager using Solidity, Next.js, and Node backend REST layers. Handheld app enabling college clubs to securely stake competition awards.
              </div>
            </div>
          </div>
        )}

        {/* 6. INTERVIEW TRAINER */}
        {selectedAgent === 'interview' && (
          <div className="space-y-6 flex-1">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-2">
              <HelpCircle size={18} className="text-pink-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Interactive Mock Interview</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-300">
                <span className="font-bold text-pink-400 block mb-1">Interview Question:</span>
                "{interviewQuestion}"
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Your Answer</label>
                <textarea
                  placeholder="Type your structured solution explanation..."
                  value={interviewAnswer}
                  onChange={(e) => setInterviewAnswer(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Audio input simulator: disabled. Type response.</span>
                <button 
                  onClick={runInterviewGrade}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold disabled:opacity-55 transition-all"
                >
                  {isLoading ? 'Grading Answer...' : 'Submit Answer for AI Grading'}
                </button>
              </div>

              {interviewOutput && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-zinc-300">AI Assessment Feedback</span>
                    <span className="text-xs font-bold text-secondary">{interviewOutput.score}/100 Rating</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{interviewOutput.feedback}</p>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Suggested Improvements:</span>
                    <ul className="list-disc pl-4 text-[10px] text-zinc-400 space-y-1">
                      {interviewOutput.analysis.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => {
                      setInterviewQuestion(interviewOutput.nextQuestion);
                      setInterviewAnswer('');
                      setInterviewOutput(null);
                    }}
                    className="mt-2 text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                  >
                    Load Next Question <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
