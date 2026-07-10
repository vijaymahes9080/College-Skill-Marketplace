import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  GitBranch, MessageSquare, Video, Mic, MicOff, PhoneOff, 
  Send, Users, CheckSquare, Plus, ArrowRight, ArrowLeft,
  Trash2, Eraser, Edit3
} from 'lucide-react';

export default function CollabWorkspace() {
  const { projects, currentUser, handleUpdateKanban, handleSendChatMessage, sendWsMessage } = useContext(AppContext);
  
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const chatBottomRef = useRef(null);

  // Whiteboard & Sandbox states
  const [collabTab, setCollabTab] = useState('kanban'); // kanban, sandbox
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(4);
  const [lastCoords, setLastCoords] = useState(null);
  const [codePlayground, setCodePlayground] = useState(`// Welcome to the Collaborative Code Sandbox!
// Keystrokes are synced with active team members in real-time.

function calculateOptimizedRoute(nodes) {
  console.log("Analyzing paths...");
  // Write collaborative algorithms here
  
}`);

  // Setup Canvas context
  useEffect(() => {
    if (collabTab !== 'sandbox' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.clientWidth || 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, [collabTab]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastCoords({ x, y });
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing || !canvasRef.current || !lastCoords) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw locally
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.moveTo(lastCoords.x, lastCoords.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Send socket sync
    sendWsMessage('WHITEBOARD_DRAW', {
      projectId: selectedProjectId,
      x,
      y,
      prevX: lastCoords.x,
      prevY: lastCoords.y,
      color: brushColor,
      brushSize
    });
    
    setLastCoords({ x, y });
  };

  const stopDrawing = () => {
    setDrawing(false);
    setLastCoords(null);
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCodePlayground(val);
    sendWsMessage('CODE_SYNC', {
      projectId: selectedProjectId,
      code: val
    });
  };

  // Listen to incoming sockets
  useEffect(() => {
    const handleWhiteboardDraw = (e) => {
      const { projectId, x, y, prevX, prevY, color, brushSize } = e.detail;
      if (projectId !== selectedProjectId || !ctxRef.current) return;
      
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleCodeSync = (e) => {
      const { projectId, code } = e.detail;
      if (projectId !== selectedProjectId) return;
      setCodePlayground(code);
    };

    window.addEventListener('ws-whiteboard-draw', handleWhiteboardDraw);
    window.addEventListener('ws-code-sync', handleCodeSync);

    return () => {
      window.removeEventListener('ws-whiteboard-draw', handleWhiteboardDraw);
      window.removeEventListener('ws-code-sync', handleCodeSync);
    };
  }, [selectedProjectId, collabTab]);

  // Call simulation states
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSpeakers, setActiveSpeakers] = useState(['Alex Chen']);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeProject?.chats]);

  // Voice activity simulator
  useEffect(() => {
    if (!isInCall) return;
    const interval = setInterval(() => {
      if (!activeProject) return;
      const speakers = [];
      if (!isMuted && Math.random() > 0.4) speakers.push(currentUser.name);
      activeProject.members.forEach(m => {
        if (m.name !== currentUser.name && Math.random() > 0.5) {
          speakers.push(m.name);
        }
      });
      setActiveSpeakers(speakers);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInCall, isMuted, activeProject]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    handleSendChatMessage(selectedProjectId, chatMessage);
    setChatMessage('');
  };

  const moveTask = (taskId, source, direction) => {
    let destination = 'in_progress';
    if (source === 'todo' && direction === 'right') destination = 'in_progress';
    else if (source === 'in_progress' && direction === 'left') destination = 'todo';
    else if (source === 'in_progress' && direction === 'right') destination = 'done';
    else if (source === 'done' && direction === 'left') destination = 'in_progress';

    handleUpdateKanban(selectedProjectId, taskId, source, destination);
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-500">
        No active collaboration workspaces found.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">PROJECT WORKSPACE</span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-extrabold text-white">{activeProject.name}</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
              <GitBranch size={10} className="text-secondary" />
              <span>{activeProject.gitRepo}</span>
            </div>
          </div>
        </div>

        {/* Video Voice Rooms Call Trigger */}
        <div className="flex items-center gap-3">
          {isInCall ? (
            <div className="flex items-center gap-2 p-1.5 bg-success/15 border border-success/30 rounded-xl">
              {/* Pulsing indicator */}
              <span className="w-2.5 h-2.5 bg-success rounded-full animate-ping ml-1"></span>
              <span className="text-[10px] text-success font-semibold px-2">Voice Call Active</span>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all ${isMuted ? 'text-red-500 bg-red-500/10' : ''}`}
              >
                {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button 
                onClick={() => setIsInCall(false)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
              >
                <PhoneOff size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsInCall(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Video size={14} className="text-primary" />
              Start Meeting Room
            </button>
          )}

          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-primary"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Kanban Task Board - Left Columns */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Sub-tab selection row */}
          <div className="flex border-b border-zinc-800 gap-6">
            <button
              onClick={() => setCollabTab('kanban')}
              className={`pb-4 text-sm font-semibold relative ${collabTab === 'kanban' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Interactive Kanban Sprint
              {collabTab === 'kanban' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
            </button>
            <button
              onClick={() => setCollabTab('sandbox')}
              className={`pb-4 text-sm font-semibold relative ${collabTab === 'sandbox' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Shared Draw Whiteboard & Playground
              {collabTab === 'sandbox' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
            </button>
          </div>

          {collabTab === 'kanban' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare size={16} className="text-secondary" />
                  Sprint Kanban Board
                </h2>
                <span className="text-[10px] text-zinc-500 font-medium">Click arrows to update tasks</span>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: TODO */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">To Do</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] text-zinc-500 font-bold">
                  {activeProject.kanban.todo.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {activeProject.kanban.todo.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-normal">{task.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-2">Assignee: {task.assignedTo}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-zinc-900">
                      <button 
                        onClick={() => moveTask(task.id, 'todo', 'right')}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Move to In Progress"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">In Progress</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] text-primary font-bold">
                  {activeProject.kanban.in_progress.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {activeProject.kanban.in_progress.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl bg-zinc-950 border border-primary/20 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-normal">{task.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-2">Assignee: {task.assignedTo}</p>
                    </div>
                    <div className="flex justify-between gap-2 mt-4 pt-2 border-t border-zinc-900">
                      <button 
                        onClick={() => moveTask(task.id, 'in_progress', 'left')}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Move to Todo"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button 
                        onClick={() => moveTask(task.id, 'in_progress', 'right')}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Move to Done"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-success">Completed</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] text-success font-bold">
                  {activeProject.kanban.done.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {activeProject.kanban.done.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl bg-zinc-950 border border-success/20 flex flex-col justify-between opacity-85">
                    <div>
                      <h4 className="text-xs font-semibold text-white line-through leading-normal">{task.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-2">Assignee: {task.assignedTo}</p>
                    </div>
                    <div className="flex justify-start gap-2 mt-4 pt-2 border-t border-zinc-900">
                      <button 
                        onClick={() => moveTask(task.id, 'done', 'left')}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Move to In Progress"
                      >
                        <ArrowLeft size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

          {collabTab === 'sandbox' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Left Side: Whiteboard Canvas */}
                <div className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Eraser size={14} className="text-primary" />
                      Shared Drawing Board
                    </h3>
                    
                    <button
                      onClick={() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }
                      }}
                      className="p-1 px-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={10} /> Clear
                    </button>
                  </div>

                  {/* Draw Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Brush Colors */}
                    <div className="flex items-center gap-1.5">
                      {['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#E4E4E7'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBrushColor(color)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            brushColor === color ? 'scale-110 border-white ring-2 ring-primary/20' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Brush Size */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">Brush:</span>
                      <select
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold px-2 py-1 text-white focus:outline-none"
                      >
                        <option value="2">2px</option>
                        <option value="4">4px</option>
                        <option value="8">8px</option>
                        <option value="12">12px</option>
                      </select>
                    </div>
                  </div>

                  {/* HTML5 Canvas */}
                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950 relative h-[300px]">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="absolute inset-0 w-full h-full cursor-crosshair"
                    />
                  </div>
                </div>

                {/* Right Side: Shared Code Editor */}
                <div className="flex flex-col bg-zinc-955 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 size={14} className="text-secondary" />
                      Collaborative Playground
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] text-zinc-500 font-mono">
                      sync_play.js
                    </span>
                  </div>

                  <textarea
                    value={codePlayground}
                    onChange={handleCodeChange}
                    className="flex-1 bg-zinc-955 text-secondary border border-zinc-900 rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-secondary resize-none min-h-[300px]"
                    style={{ tabSize: 2 }}
                    placeholder="// Write code together..."
                  />
                </div>

              </div>
        </div>
        )}
      </div>

        {/* Real-time Workspace Chat Panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800 flex flex-col h-[500px]">
            {/* Chat header */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sprint Channels</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded-full">
                <Users size={10} />
                <span>{activeProject.members.length} online</span>
              </div>
            </div>

            {/* Speaking overlays in active calls */}
            {isInCall && activeSpeakers.length > 0 && (
              <div className="bg-success/5 border-b border-success/15 px-4 py-2 flex items-center gap-2">
                <Mic size={10} className="text-success animate-pulse" />
                <span className="text-[10px] text-success font-medium">
                  Speaking: {activeSpeakers.join(', ')}
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeProject.chats.map((chat, idx) => {
                const isSelf = chat.sender === currentUser.name;
                return (
                  <div key={idx} className={`flex gap-2.5 items-start ${isSelf ? 'flex-row-reverse' : ''}`}>
                    <img 
                      src={chat.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'} 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover border border-zinc-800"
                    />
                    <div className="max-w-[70%]">
                      <div className={`flex items-baseline gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] font-bold text-zinc-300">{chat.sender}</span>
                        <span className="text-[8px] text-zinc-650">{chat.time}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl text-xs mt-1 leading-normal ${
                        isSelf 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
                      }`}>
                        {chat.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-zinc-950 border-t border-zinc-850 flex gap-2">
              <input
                type="text"
                placeholder="Message active team members..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all"
              />
              <button 
                type="submit"
                className="p-2 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
