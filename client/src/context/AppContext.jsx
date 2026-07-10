import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('student'); // student, mentor, recruiter, alumni, admin
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-stud-1',
    email: 'alex.chen@edu.com',
    name: 'Alex Chen',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
  });
  
  const [studentProfile, setStudentProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [alumniSlots, setAlumniSlots] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Welcome to EduMarket', message: 'Ready to build, earn and grow your skills?', category: 'system', date: 'Just Now' }
  ]);
  const [wsStatus, setWsStatus] = useState('disconnected');
  
  const wsRef = useRef(null);

  // Map role switching
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    // Auto-update logged user based on seed data
    let userDetails = { id: 'usr-stud-1', email: 'alex.chen@edu.com', name: 'Alex Chen', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120' };
    
    if (role === 'mentor') {
      userDetails = { id: 'usr-ment-1', email: 'dr.marcus@edu.com', name: 'Dr. Marcus Vance', role: 'mentor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', dept: 'Computer Science' };
    } else if (role === 'recruiter') {
      userDetails = { id: 'usr-recr-1', email: 'hiring@stripe.com', name: 'Stripe Inc.', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120', company: 'Stripe' };
    } else if (role === 'alumni') {
      userDetails = { id: 'usr-alum-1', email: 'sarah.k@google.com', name: 'Sarah K. (Google Eng)', role: 'alumni', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120', classOf: '2022' };
    } else if (role === 'admin') {
      userDetails = { id: 'usr-admin-1', email: 'admin@edu.com', name: 'Dean Sarah Jenkins', role: 'admin', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120' };
    }
    
    setCurrentUser(userDetails);
  };

  // Fetch initial system states from local APIs
  const refreshAllData = async () => {
    try {
      // 1. Fetch Profile
      const pRes = await fetch(`/api/v1/student/profile/${currentRole === 'student' ? currentUser.id : 'usr-stud-1'}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setStudentProfile(pData.profile);
      }

      // 2. Fetch Gigs
      const gRes = await fetch('/api/v1/marketplace/gigs');
      if (gRes.ok) {
        const gData = await gRes.json();
        setGigs(gData.gigs);
      }

      // 3. Fetch Projects
      const prRes = await fetch('/api/v1/collaboration/projects');
      if (prRes.ok) {
        const prData = await prRes.json();
        setProjects(prData.projects);
        
        // Load active orders based on gigs/buyer status
        // We will mock orders client-side or fetch via endpoints. We pull sample orders from server too.
      }

      // 4. Fetch Recruiter Jobs
      const jRes = await fetch('/api/v1/recruiter/jobs');
      if (jRes.ok) {
        const jData = await jRes.json();
        setJobs(jData.jobs);
      }

      // Load static challenges/slots fallbacks if empty
      setChallenges([
        { id: 'chal-1', mentorId: 'usr-ment-1', mentorName: 'Dr. Marcus Vance', title: 'Advanced Optimization Challenge', description: 'Write an optimized pathfinding algorithm in TypeScript/Go that handles 10,000 requests per minute with a response latency under 5ms.', points: 250, badge: 'Optimization Wizard', submissions: 2, dueDate: '2026-07-02' }
      ]);
      setAlumniSlots([
        { id: 'slot-1', alumniId: 'usr-alum-1', alumniName: 'Sarah K. (Google)', title: 'AI Engineering Career Path Q&A', time: 'June 27, 4:00 PM', capacity: 15, registered: 8 }
      ]);
    } catch (err) {
      console.warn('API Error, continuing in offline/mock mode:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentRole, currentUser]);

  // Connect WebSockets for Real-time feeds
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connectWs = () => {
      setWsStatus('connecting');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        console.log('WS Connection Established.');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WS Broadcast Received:', message);
          
          if (message.type === 'NOTIFICATION') {
            setNotifications(prev => [
              { id: String(Date.now()), title: message.payload.title, message: message.payload.message, category: message.payload.category || 'info', date: 'Just Now' },
              ...prev
            ]);
          } else if (message.type === 'ORDER_HIRE') {
            setNotifications(prev => [
              { id: String(Date.now()), title: message.payload.title, message: message.payload.message, category: 'order', date: 'Just Now' },
              ...prev
            ]);
            // If the current student is the one hired, alert them
            if (message.payload.studentUserId === currentUser.id) {
              alert(`🎉 Congrats! ${message.payload.message}`);
            }
            refreshAllData();
          } else if (message.type === 'CHAT_MSG') {
            // Update the chats array for the matching project
            setProjects(prev => prev.map(p => {
              if (p.id === message.payload.projectId) {
                return { ...p, chats: [...p.chats, message.payload.chat] };
              }
              return p;
            }));
          } else if (message.type === 'KANBAN_MOVE') {
            // Update Kanban state
            setProjects(prev => prev.map(p => {
              if (p.id === message.payload.projectId) {
                const { taskId, source, destination, task } = message.payload;
                
                // Clear task from source
                const newSourceList = p.kanban[source].filter(t => t.id !== taskId);
                
                // Append task to destination if not exists
                const exists = p.kanban[destination].some(t => t.id === taskId);
                const newDestList = exists ? p.kanban[destination] : [...p.kanban[destination], task];
                
                return {
                  ...p,
                  kanban: {
                    ...p.kanban,
                    [source]: newSourceList,
                    [destination]: newDestList
                  }
                };
              }
              return p;
            }));
          }
        } catch (err) {
          console.error('Error handling WS event data:', err);
        }
      };

      ws.onerror = () => {
        setWsStatus('error');
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        // Reconnect after 5 seconds
        setTimeout(connectWs, 5000);
      };
    };

    connectWs();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // --- API Handlers to Backend ---
  const handleCreateGig = async (gigData) => {
    try {
      const res = await fetch('/api/v1/marketplace/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...gigData, studentId: 'stud-1' })
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('Failed to create gig:', err);
    }
    return false;
  };

  const handleHireStudent = async (gigId) => {
    try {
      const res = await fetch('/api/v1/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId, buyerId: currentUser.id })
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('Failed to purchase gig:', err);
    }
    return false;
  };

  const handleUpdateKanban = async (projectId, taskId, source, destination) => {
    // Optimistic UI updates
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const columns = ['todo', 'in_progress', 'done'];
        let movedTask = null;
        for (const col of columns) {
          const idx = p.kanban[col].findIndex(t => t.id === taskId);
          if (idx !== -1) {
            movedTask = p.kanban[col].splice(idx, 1)[0];
            break;
          }
        }
        if (movedTask) {
          p.kanban[destination].push(movedTask);
        }
        return { ...p };
      }
      return p;
    }));

    try {
      const res = await fetch(`/api/v1/collaboration/projects/${projectId}/kanban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, taskId })
      });
      if (!res.ok) {
        // Rollback or refresh on error
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed to update Kanban on server:', err);
    }
  };

  const handleSendChatMessage = async (projectId, messageText) => {
    const payload = {
      sender: currentUser.name,
      avatar: currentUser.avatar,
      text: messageText
    };

    // Client-side local WS broadcast send
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MSG',
        payload: { projectId, chat: { ...payload, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } }
      }));
    }

    try {
      await fetch(`/api/v1/collaboration/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to dispatch API chat message:', err);
    }
  };

  const handleSimulateEvent = async (eventType) => {
    try {
      await fetch('/api/v1/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType })
      });
    } catch (err) {
      console.error('Simulation trigger failed:', err);
    }
  };

  const handlePublishChallenge = async (challengeData) => {
    try {
      const res = await fetch('/api/v1/mentor/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData)
      });
      if (res.ok) {
        const val = await res.json();
        setChallenges(prev => [...prev, val.challenge]);
        return true;
      }
    } catch (err) {
      console.error('Failed to launch mentor challenge:', err);
    }
    return false;
  };

  const handlePublishJob = async (jobData) => {
    try {
      const res = await fetch('/api/v1/recruiter/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('Failed to post recruiter internship:', err);
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      currentUser,
      studentProfile,
      gigs,
      orders,
      projects,
      jobs,
      challenges,
      alumniSlots,
      notifications,
      wsStatus,
      handleRoleChange,
      handleCreateGig,
      handleHireStudent,
      handleUpdateKanban,
      handleSendChatMessage,
      handlePublishChallenge,
      handlePublishJob,
      handleSimulateEvent,
      refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};
