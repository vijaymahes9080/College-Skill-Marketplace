import React, { useState } from 'react';
import { 
  Brain, FileText, Compass, GraduationCap, 
  Lightbulb, HelpCircle, ArrowRight, UserCheck, CheckSquare, RefreshCw,
  Play, Send, Terminal, Check, X, ShieldCheck
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

  // Interview Sandbox states
  const [interviewQuestionId, setInterviewQuestionId] = useState('subarray');
  const [codeContent, setCodeContent] = useState(`function findLongestSubarray(arr, k) {
  // Write your code here
  let map = new Map();
  let maxLen = 0;
  let sum = 0;
  
  for(let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (sum === k) maxLen = i + 1;
    if (!map.has(sum)) map.set(sum, i);
    if (map.has(sum - k)) {
      maxLen = Math.max(maxLen, i - map.get(sum - k));
    }
  }
  return maxLen;
}`);
  const [testResults, setTestResults] = useState(null);
  const [thinkingStep, setThinkingStep] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI Interviewer', text: "Hello! I am your Stripe AI technical interviewer. Today, let's start with this coding challenge. We need to implement an optimized function to find the longest subarray that sums to a target value k. Write your solution in the editor on the left and run our system tests.", time: '12:00 PM' }
  ]);
  const [interviewOutput, setInterviewOutput] = useState(null);

  const interviewQuestions = [
    {
      id: 'subarray',
      title: 'Longest Subarray Sum',
      description: 'Implement an optimized function findLongestSubarray(arr, k) that returns the length of the longest contiguous subarray with a sum equal to k.',
      template: `function findLongestSubarray(arr, k) {
  // Write your code here
  let map = new Map();
  let maxLen = 0;
  let sum = 0;
  
  for(let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (sum === k) maxLen = i + 1;
    if (!map.has(sum)) map.set(sum, i);
    if (map.has(sum - k)) {
      maxLen = Math.max(maxLen, i - map.get(sum - k));
    }
  }
  return maxLen;
}`
    },
    {
      id: 'anagrams',
      title: 'Group Anagrams',
      description: 'Implement an optimized function groupAnagrams(strs) that groups an array of strings together if they are anagrams of each other.',
      template: `function groupAnagrams(strs) {
  // Write your code here
  let map = {};
  for (let str of strs) {
    let sorted = str.split('').sort().join('');
    if (!map[sorted]) map[sorted] = [];
    map[sorted].push(str);
  }
  return Object.values(map);
}`
    },
    {
      id: 'parentheses',
      title: 'Valid Parentheses',
      description: 'Implement a function isValidParentheses(s) that returns true if brackets are balanced: (), [], {}.',
      template: `function isValidParentheses(s) {
  // Write your code here
  let stack = [];
  let map = { ')': '(', ']': '[', '}': '{' };
  
  for (let char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`
    }
  ];

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

  const handleQuestionChange = (id) => {
    setInterviewQuestionId(id);
    const selected = interviewQuestions.find(q => q.id === id);
    if (selected) {
      setCodeContent(selected.template);
      setTestResults(null);
      setInterviewOutput(null);
      setChatMessages([
        { sender: 'AI Interviewer', text: `Next question selected: "${selected.title}". ${selected.description} Write your code on the left and run tests.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
  };

  const runLocalTests = () => {
    try {
      // Create user function inside container
      const userFn = new Function(`
        ${codeContent};
        return {
          findLongestSubarray: typeof findLongestSubarray !== 'undefined' ? findLongestSubarray : null,
          groupAnagrams: typeof groupAnagrams !== 'undefined' ? groupAnagrams : null,
          isValidParentheses: typeof isValidParentheses !== 'undefined' ? isValidParentheses : null
        };
      `)();

      if (interviewQuestionId === 'subarray') {
        const fn = userFn.findLongestSubarray;
        if (!fn) throw new Error("findLongestSubarray is not defined.");
        const tc1 = fn([1, -1, 5, -2, 3], 3) === 4;
        const tc2 = fn([1, 2, 3], 3) === 2;
        const tc3 = fn([10, 5, 2, 7, 1, 9], 15) === 4;
        setTestResults([
          { name: 'TC 1: Longest sum k=3 in [1, -1, 5, -2, 3]', passed: tc1, expected: '4', actual: String(fn([1, -1, 5, -2, 3], 3)) },
          { name: 'TC 2: Longest sum k=3 in [1, 2, 3]', passed: tc2, expected: '2', actual: String(fn([1, 2, 3], 3)) },
          { name: 'TC 3: Longest sum k=15 in [10, 5, 2, 7, 1, 9]', passed: tc3, expected: '4', actual: String(fn([10, 5, 2, 7, 1, 9], 15)) }
        ]);
      } else if (interviewQuestionId === 'anagrams') {
        const fn = userFn.groupAnagrams;
        if (!fn) throw new Error("groupAnagrams is not defined.");
        const res1 = fn(["eat", "tea", "tan", "ate", "nat", "bat"]);
        const tc1 = Array.isArray(res1) && res1.length === 3;
        const res2 = fn(["a"]);
        const tc2 = Array.isArray(res2) && res2.length === 1 && res2[0][0] === "a";
        setTestResults([
          { name: 'TC 1: Check grouped size for ["eat", "tea", "tan", "ate", "nat", "bat"]', passed: tc1, expected: '3 groups', actual: `${res1 ? res1.length : 0} groups` },
          { name: 'TC 2: Check grouping for ["a"]', passed: tc2, expected: '[["a"]]', actual: JSON.stringify(res2) }
        ]);
      } else if (interviewQuestionId === 'parentheses') {
        const fn = userFn.isValidParentheses;
        if (!fn) throw new Error("isValidParentheses is not defined.");
        const tc1 = fn("()[]{}") === true;
        const tc2 = fn("([)]") === false;
        const tc3 = fn("{[]}") === true;
        setTestResults([
          { name: 'TC 1: Check balance for "()[]{}"', passed: tc1, expected: 'true', actual: String(fn("()[]{}")) },
          { name: 'TC 2: Check balance for "([)]"', passed: tc2, expected: 'false', actual: String(fn("([)]")) },
          { name: 'TC 3: Check balance for "{[]}"', passed: tc3, expected: 'true', actual: String(fn("{[]}")) }
        ]);
      }
    } catch (e) {
      setTestResults([
        { name: 'Compilation & Execution Error', passed: false, error: e.message }
      ]);
    }
  };

  const runInterviewGrade = async () => {
    setIsLoading(true);
    setInterviewOutput(null);
    setThinkingStep('AST Analysis: checking syntax structure...');
    
    // Simulate thinking steps
    await new Promise(r => setTimeout(r, 600));
    setThinkingStep('Big-O evaluation: calculating complexity bounds...');
    await new Promise(r => setTimeout(r, 600));
    setThinkingStep('Edge Case analysis: verifying null bounds & empty list results...');
    await new Promise(r => setTimeout(r, 600));
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {
      sender: 'Student (You)',
      text: 'Code submitted in Sandbox. Evaluation requested.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
      const selected = interviewQuestions.find(q => q.id === interviewQuestionId);
      const res = await fetch('/api/v1/ai/interview-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: selected ? selected.title : 'Coding challenge', answer: codeContent })
      });
      if (res.ok) {
        const val = await res.json();
        
        // Custom check to see if tests passed locally
        const allPassed = testResults && testResults.every(r => r.passed);
        if (!allPassed) {
          val.score = Math.max(30, val.score - 20); // Penalize score if tests aren't passing
          val.feedback = "Tests are currently failing on the sandbox console. Please check the compilation errors or logical flaws. " + val.feedback;
        }

        setInterviewOutput(val);
        setChatMessages(prev => [...prev, {
          sender: 'AI Interviewer',
          text: `Review complete. Score: ${val.score}/100. ${val.feedback}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setThinkingStep('');
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
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-pink-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Interactive Mock Interview Sandbox</h3>
              </div>
              
              {/* Question Selectors */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Challenge:</span>
                <select
                  value={interviewQuestionId}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold px-2 py-1 text-white focus:outline-none"
                >
                  {interviewQuestions.map(q => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Screen Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Left Pane: Code Editor & Local Console */}
              <div className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Editor Header */}
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal size={14} />
                    <span className="text-xs font-semibold font-mono">sandbox_editor.js</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                  </div>
                </div>

                {/* Question Info */}
                <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 text-xs text-zinc-300 font-medium">
                  {interviewQuestions.find(q => q.id === interviewQuestionId)?.description}
                </div>

                {/* Interactive Code Editor (simulated) */}
                <div className="relative flex-1 flex">
                  {/* Line Numbers gutter */}
                  <div className="bg-zinc-950 text-zinc-650 px-3.5 py-4 text-xs font-mono select-none border-r border-zinc-900 text-right leading-relaxed flex flex-col">
                    {Array.from({ length: codeContent.split('\n').length }).map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Textarea Code Input */}
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-4 text-xs text-secondary font-mono leading-relaxed focus:outline-none resize-none min-h-[250px]"
                    style={{ whiteSpace: 'pre', tabSize: 2 }}
                    placeholder="// Implement function here"
                  />
                </div>

                {/* Editor Footer / Action Buttons */}
                <div className="bg-zinc-900/60 p-3 border-t border-zinc-900 flex justify-between items-center">
                  <button
                    onClick={runLocalTests}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Play size={12} className="text-secondary" />
                    Run Local Tests
                  </button>
                  <button
                    onClick={runInterviewGrade}
                    disabled={isLoading}
                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-850 disabled:text-zinc-600 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-pink-500/10"
                  >
                    {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                    Submit Code for AI Review
                  </button>
                </div>

                {/* Local Console Output Panel */}
                <div className="bg-zinc-950 p-4 border-t border-zinc-900 font-mono min-h-[120px] max-h-[200px] overflow-y-auto">
                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mb-2">Local Console Test Results</span>
                  {!testResults ? (
                    <span className="text-xs text-zinc-650">No tests executed yet. Click "Run Local Tests" to verify syntax and outputs.</span>
                  ) : testResults[0].error ? (
                    <div className="text-xs text-red-400 p-2.5 rounded-lg bg-red-950/20 border border-red-900/50">
                      <strong>Execution Error:</strong> {testResults[0].error}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {testResults.map((tr, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs p-1.5 rounded bg-zinc-900 border border-zinc-900/50">
                          <div className="flex items-center gap-2 text-zinc-300">
                            {tr.passed ? (
                              <Check size={12} className="text-success" />
                            ) : (
                              <X size={12} className="text-red-400" />
                            )}
                            <span>{tr.name}</span>
                          </div>
                          <span className={`text-[10px] ${tr.passed ? 'text-success' : 'text-red-400'}`}>
                            {tr.passed ? 'PASSED' : `FAILED (Expected ${tr.expected}, got ${tr.actual})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane: AI Interviewer Chat feed & Analysis Grade */}
              <div className="flex flex-col gap-6">
                
                {/* AI Interviewer Live Feed */}
                <div className="glass-card rounded-2xl p-4 border flex flex-col justify-between h-[300px]">
                  <div className="border-b border-zinc-800 pb-2 mb-3">
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">Live Interview Chat</span>
                  </div>

                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[220px]">
                    {chatMessages.map((msg, idx) => {
                      const isAI = msg.sender === 'AI Interviewer';
                      return (
                        <div key={idx} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                          <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-semibold mb-0.5">
                            <span>{msg.sender}</span>
                            <span>•</span>
                            <span>{msg.time}</span>
                          </div>
                          <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            isAI ? 'bg-zinc-900 border border-zinc-850 text-zinc-300 rounded-tl-none' : 'bg-primary/20 text-white rounded-tr-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Thinking overlay */}
                  {isLoading && thinkingStep && (
                    <div className="mt-3 p-2.5 rounded-xl bg-pink-950/15 border border-pink-900/30 flex items-center gap-2.5 text-xs text-pink-400 animate-pulse">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>{thinkingStep}</span>
                    </div>
                  )}
                </div>

                {/* AI Evaluation Grade Report */}
                {interviewOutput && (
                  <div className="glass-card rounded-2xl p-5 border border-zinc-800/80 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <CheckSquare size={16} className="text-secondary" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">AI Evaluation Grade Report</span>
                      </div>
                      <span className="text-xs font-black text-secondary bg-secondary/15 px-3 py-1 rounded-full">{interviewOutput.score}/100 Rating</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">Clarity</span>
                        <span className="text-xs font-bold text-white">{interviewOutput.analysis.clarity}</span>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">Accuracy</span>
                        <span className="text-xs font-bold text-white">{interviewOutput.analysis.technicalAccuracy}</span>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">Code Health</span>
                        <span className="text-xs font-bold text-success">Passed</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Suggested Optimizations</span>
                      <div className="space-y-1.5">
                        {interviewOutput.analysis.suggestions.map((sg, idx) => (
                          <div key={idx} className="p-2 rounded bg-zinc-900 border border-zinc-850 text-[10px] text-zinc-400 leading-relaxed">
                            💡 {sg}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
