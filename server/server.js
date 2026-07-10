import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// --- WebSocket Broadcast Utilities ---
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New WebSocket Client connected. Active clients:', clients.size);
  
  ws.send(JSON.stringify({
    type: 'SYSTEM_INFO',
    payload: { message: 'Connected to EduMarket Real-time Gateway' }
  }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      console.log('Received WebSocket Message:', parsed);
      
      // If it's a chat message, we broadcast it to all other clients
      if (parsed.type === 'CHAT_MSG' || parsed.type === 'KANBAN_MOVE' || parsed.type === 'WHITEBOARD_DRAW' || parsed.type === 'CODE_SYNC') {
        broadcast(parsed);
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket Client disconnected. Active clients:', clients.size);
  });
});

function broadcast(data) {
  const messageStr = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === 1) { // OPEN
      client.send(messageStr);
    }
  }
}

// Upgrade handler for WebSocket connections
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// --- Mock Database (In-Memory State) ---
const db = {
  users: [
    { id: 'usr-stud-1', email: 'alex.chen@edu.com', name: 'Alex Chen', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120' },
    { id: 'usr-stud-2', email: 'priya.sharma@edu.com', name: 'Priya Sharma', role: 'student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
    { id: 'usr-stud-3', email: 'sam.wilson@edu.com', name: 'Sam Wilson', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    { id: 'usr-ment-1', email: 'dr.marcus@edu.com', name: 'Dr. Marcus Vance', role: 'mentor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', dept: 'Computer Science' },
    { id: 'usr-recr-1', email: 'hiring@stripe.com', name: 'Stripe Inc.', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120', company: 'Stripe' },
    { id: 'usr-alum-1', email: 'sarah.k@google.com', name: 'Sarah K. (Google Eng)', role: 'alumni', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120', classOf: '2022' },
    { id: 'usr-admin-1', email: 'admin@edu.com', name: 'Dean Sarah Jenkins', role: 'admin', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120' }
  ],
  students: [
    {
      id: 'stud-1',
      userId: 'usr-stud-1',
      college: 'Apex Technology University',
      department: 'Computer Science & Engineering',
      graduationYear: 2027,
      skillScore: 88,
      careerScore: 84,
      portfolioStrength: 90,
      placementReadiness: 85,
      xp: 2450,
      level: 4,
      earnings: 450.00,
      bio: 'Full-stack developer focused on React, Node.js and AI integrations. Building solutions for student collaboration.',
      skills: [
        { name: 'React.js', level: 'expert', verified: true, score: 92 },
        { name: 'Node.js', level: 'expert', verified: true, score: 88 },
        { name: 'Tailwind CSS', level: 'expert', verified: false, score: 75 },
        { name: 'FastAPI', level: 'intermediate', verified: true, score: 82 },
        { name: 'MongoDB', level: 'intermediate', verified: false, score: 70 }
      ],
      learningPath: [
        { id: 'path-1', title: 'Advanced Full Stack Developer', progress: 75, status: 'in_progress', lessonsCompleted: 6, totalLessons: 8 },
        { id: 'path-2', title: 'Generative AI Integration', progress: 20, status: 'in_progress', lessonsCompleted: 1, totalLessons: 5 }
      ],
      achievements: [
        { title: 'Hackathon Winner', icon: 'Trophy', description: '1st Place in TechFest 2026', date: 'March 2026' },
        { title: 'Top Rated Gig Seller', icon: 'Award', description: 'Completed 5 development contracts with 5-star rating', date: 'May 2026' },
        { title: 'React Certified', icon: 'ShieldAlert', description: 'Verified by Dr. Marcus Vance', date: 'April 2026' }
      ]
    },
    {
      id: 'stud-2',
      userId: 'usr-stud-2',
      college: 'Apex Technology University',
      department: 'Design & Creative Arts',
      graduationYear: 2026,
      skillScore: 92,
      careerScore: 78,
      portfolioStrength: 95,
      placementReadiness: 80,
      xp: 3100,
      level: 5,
      earnings: 1200.00,
      bio: 'UI/UX Designer and Illustrator. I design beautiful visual interfaces for modern web and mobile apps.',
      skills: [
        { name: 'Figma', level: 'expert', verified: true, score: 95 },
        { name: 'UI/UX Design', level: 'expert', verified: true, score: 94 },
        { name: 'Adobe Illustrator', level: 'expert', verified: false, score: 80 },
        { name: 'Prototyping', level: 'intermediate', verified: true, score: 88 }
      ],
      learningPath: [
        { id: 'path-3', title: 'Mobile Experience Strategy', progress: 100, status: 'completed', lessonsCompleted: 6, totalLessons: 6 }
      ],
      achievements: [
        { title: 'Design Star', icon: 'Sparkles', description: 'Behance Featured Project Badge', date: 'Jan 2026' }
      ]
    }
  ],
  gigs: [
    { id: 'gig-1', studentId: 'stud-1', title: 'I will build a React + Tailwind Landing Page', description: 'Highly responsive, interactive React landing page with pixel-perfect Tailwind layouts, animations, and form validations. Delivered in clean component code structure.', pricing: 150.00, deliveryTime: 3, category: 'Web Development', rating: 4.9, reviewCount: 8, availability: 'Available', tags: ['React', 'Tailwind', 'Landing Page', 'HTML'] },
    { id: 'gig-2', studentId: 'stud-1', title: 'Build clean REST APIs in Node.js / FastAPI', description: 'Secure backend API routing using Express or FastAPI. Integrates SQLite or MongoDB connections, full validation middlewares, and visual Swagger documentation.', pricing: 200.00, deliveryTime: 5, category: 'Web Development', rating: 5.0, reviewCount: 4, availability: 'Available', tags: ['Node.js', 'FastAPI', 'Express', 'API'] },
    { id: 'gig-3', studentId: 'stud-2', title: 'Create interactive Figma Wireframes & UX prototypes', description: 'Complete UX mapping, interactive layouts, component libraries, and mock prototypes for your web application or mobile app. Includes unlimited revisions.', pricing: 120.00, deliveryTime: 4, category: 'UI/UX', rating: 4.8, reviewCount: 15, availability: 'Available', tags: ['Figma', 'UI/UX', 'Wireframes', 'Mobile'] },
    { id: 'gig-4', studentId: 'stud-2', title: 'Professional Vector Graphics & Logo Branding', description: 'Creative corporate branding packages, SVG files, social media banners, and vector assets. Handcrafted in Adobe Illustrator with export formats.', pricing: 60.00, deliveryTime: 2, category: 'Graphic Design', rating: 5.0, reviewCount: 12, availability: 'Available', tags: ['Logo', 'Vector', 'Branding', 'Adobe'] }
  ],
  orders: [
    { id: 'ord-1', gigId: 'gig-1', studentId: 'stud-1', buyerId: 'usr-recr-1', buyerName: 'Stripe Inc.', title: 'I will build a React + Tailwind Landing Page', amount: 150.00, status: 'completed', timelineDeadline: '2026-06-15T18:00:00Z', createdAt: '2026-06-12T10:00:00.000Z', rating: 5, comment: 'Excellent code quality, delivered early! Highly recommended for landing pages.' },
    { id: 'ord-2', gigId: 'gig-3', studentId: 'stud-2', buyerId: 'usr-stud-1', buyerName: 'Alex Chen', title: 'Create interactive Figma Wireframes & UX prototypes', amount: 120.00, status: 'in_progress', timelineDeadline: '2026-06-28T18:00:00Z', createdAt: '2026-06-24T09:30:00.000Z' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Smart Campus Nav',
      leadId: 'stud-1',
      leadName: 'Alex Chen',
      members: [
        { id: 'stud-1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', role: 'Developer' },
        { id: 'stud-2', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', role: 'UI/UX Designer' }
      ],
      kanban: {
        todo: [
          { id: 't-1', title: 'Determine GPS node points for campus paths', assignedTo: 'Priya Sharma', difficulty: 'Medium' },
          { id: 't-2', title: 'Write WebSocket server connection handler', assignedTo: 'Alex Chen', difficulty: 'Hard' }
        ],
        in_progress: [
          { id: 't-3', title: 'Create main Map overlay component using Leaflet', assignedTo: 'Alex Chen', difficulty: 'Hard' }
        ],
        done: [
          { id: 't-4', title: 'Design Figma layout mockups', assignedTo: 'Priya Sharma', difficulty: 'Easy' }
        ]
      },
      gitRepo: 'apex-college/smart-campus-nav',
      chats: [
        { sender: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', text: 'Hey Alex, I completed the UI mocks for the pathfinding view. What do you think?', time: '11:20 AM' },
        { sender: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', text: 'They look absolutely brilliant Priya! I am starting on the map components mapping those paths now.', time: '11:22 AM' }
      ]
    }
  ],
  challenges: [
    { id: 'chal-1', mentorId: 'usr-ment-1', mentorName: 'Dr. Marcus Vance', title: 'Advanced Optimization Challenge', description: 'Write an optimized pathfinding algorithm in TypeScript/Go that handles 10,000 requests per minute with a response latency under 5ms.', points: 250, badge: 'Optimization Wizard', submissions: 2, dueDate: '2026-07-02' }
  ],
  jobs: [
    { id: 'job-1', recruiterId: 'usr-recr-1', company: 'Stripe Inc.', title: 'Front-End React Intern', description: 'Seeking a talented student React developer to assist in building dashboard visualizer packages. Familiarity with charts and UI animations required.', stipend: '$2,500/mo', location: 'Remote / San Francisco', skillsRequired: ['React.js', 'Tailwind CSS', 'Figma'], status: 'active' }
  ],
  alumniSlots: [
    { id: 'slot-1', alumniId: 'usr-alum-1', alumniName: 'Sarah K. (Google)', title: 'AI Engineering Career Path Q&A', time: 'June 27, 4:00 PM', capacity: 15, registered: 8 }
  ]
};

// --- AUTHENTICATION APIS ---
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const foundUser = db.users.find(u => u.email === email.toLowerCase());
  
  if (foundUser) {
    // Generate simple mock token
    res.json({
      success: true,
      token: `mock-jwt-token-for-${foundUser.id}`,
      user: foundUser
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials. Try: alex.chen@edu.com, dr.marcus@edu.com, hiring@stripe.com, sarah.k@google.com, admin@edu.com' });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, role, department, graduationYear } = req.body;
  
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  
  const id = `usr-gen-${Date.now()}`;
  const newUser = {
    id,
    email: email.toLowerCase(),
    name,
    role,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  };
  
  db.users.push(newUser);
  
  if (role === 'student') {
    const studentId = `stud-gen-${Date.now()}`;
    const newStudent = {
      id: studentId,
      userId: id,
      college: 'Apex Technology University',
      department: department || 'General Engineering',
      graduationYear: Number(graduationYear) || 2027,
      skillScore: 50,
      careerScore: 40,
      portfolioStrength: 30,
      placementReadiness: 35,
      xp: 100,
      level: 1,
      earnings: 0.00,
      bio: 'New student on EduMarket!',
      skills: [],
      learningPath: [],
      achievements: []
    };
    db.students.push(newStudent);
  }
  
  res.json({ success: true, user: newUser });
});

// --- STUDENT PROFILE APIS ---
app.get('/api/v1/student/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const student = db.students.find(s => s.userId === userId);
  
  if (student) {
    const user = db.users.find(u => u.id === userId);
    res.json({ success: true, profile: { ...student, name: user.name, avatar: user.avatar } });
  } else {
    res.status(404).json({ success: false, message: 'Student profile not found' });
  }
});

app.put('/api/v1/student/profile', (req, res) => {
  const { userId, bio, skills } = req.body;
  const index = db.students.findIndex(s => s.userId === userId);
  if (index !== -1) {
    db.students[index].bio = bio !== undefined ? bio : db.students[index].bio;
    db.students[index].skills = skills !== undefined ? skills : db.students[index].skills;
    
    // Recalculate portfolio strength based on data
    db.students[index].portfolioStrength = Math.min(100, 30 + db.students[index].skills.length * 12);
    
    res.json({ success: true, profile: db.students[index] });
  } else {
    res.status(404).json({ success: false, message: 'Student profile not found' });
  }
});

// --- MARKETPLACE APIS ---
app.get('/api/v1/marketplace/gigs', (req, res) => {
  // Populate gig profiles with creator details
  const populatedGigs = db.gigs.map(gig => {
    const student = db.students.find(s => s.id === gig.studentId);
    const user = student ? db.users.find(u => u.id === student.userId) : null;
    return {
      ...gig,
      studentName: user ? user.name : 'Unknown Student',
      studentAvatar: user ? user.avatar : ''
    };
  });
  res.json({ success: true, gigs: populatedGigs });
});

app.post('/api/v1/marketplace/gigs', (req, res) => {
  const { studentId, title, description, pricing, deliveryTime, category, tags } = req.body;
  
  const id = `gig-${Date.now()}`;
  const newGig = {
    id,
    studentId,
    title,
    description,
    pricing: Number(pricing),
    deliveryTime: Number(deliveryTime),
    category,
    rating: 5.0,
    reviewCount: 0,
    availability: 'Available',
    tags: tags || []
  };
  
  db.gigs.push(newGig);
  
  // Real-time broadcast
  broadcast({
    type: 'NOTIFICATION',
    payload: {
      title: 'New Service Listed!',
      message: `${newGig.title} is now active in the Marketplace!`,
      category: 'marketplace'
    }
  });

  res.json({ success: true, gig: newGig });
});

app.post('/api/v1/marketplace/orders', (req, res) => {
  const { gigId, buyerId } = req.body;
  const gig = db.gigs.find(g => g.id === gigId);
  const buyer = db.users.find(u => u.id === buyerId);
  
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
  
  const student = db.students.find(s => s.id === gig.studentId);
  const studentUser = student ? db.users.find(u => u.id === student.userId) : null;

  const id = `ord-${Date.now()}`;
  const newOrder = {
    id,
    gigId,
    studentId: gig.studentId,
    buyerId,
    buyerName: buyer ? buyer.name : 'Client',
    title: gig.title,
    amount: gig.pricing,
    status: 'in_progress',
    timelineDeadline: new Date(Date.now() + gig.deliveryTime * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };
  
  db.orders.push(newOrder);

  // Send real-time socket alert to the student
  broadcast({
    type: 'ORDER_HIRE',
    payload: {
      orderId: newOrder.id,
      title: 'You Have Been Hired!',
      message: `Client ${newOrder.buyerName} ordered: "${newOrder.title}" for $${newOrder.amount}`,
      studentUserId: studentUser ? studentUser.id : ''
    }
  });

  res.json({ success: true, order: newOrder });
});

app.post('/api/v1/marketplace/orders/:id/submit', (req, res) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id === id);
  
  if (order) {
    order.status = 'submitted';
    
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'Project Submission',
        message: `Order #${id} has been submitted for review by the student.`,
        category: 'order'
      }
    });
    
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

app.post('/api/v1/marketplace/orders/:id/complete', (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const order = db.orders.find(o => o.id === id);
  
  if (order) {
    order.status = 'completed';
    order.rating = rating || 5;
    order.comment = comment || 'Excellent work!';
    
    // Add funds to student account
    const student = db.students.find(s => s.id === order.studentId);
    if (student) {
      student.earnings += order.amount;
      student.xp += Math.round(order.amount * 1.5);
      student.level = Math.floor(student.xp / 600) + 1;
      student.skillScore = Math.min(100, student.skillScore + 2);
    }

    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'Order Completed & Released',
        message: `Funds of $${order.amount} have been released to the student.`,
        category: 'order'
      }
    });

    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

app.post('/api/v1/marketplace/orders/:id/dispute', (req, res) => {
  const { id } = req.params;
  const { reason, proofText } = req.body;
  const order = db.orders.find(o => o.id === id);
  
  if (order) {
    order.status = 'disputed';
    order.disputeReason = reason || 'Unresolved specification mismatch';
    order.proofText = proofText || 'Milestone proof of work submitted but buyer refused release.';
    order.disputeStatus = 'awaiting_jury';
    
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'Escrow Dispute Initiated!',
        message: `Order #${id} is disputed. Escrow locked. AI Jury summoned.`,
        category: 'order'
      }
    });
    
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

app.post('/api/v1/marketplace/orders/:id/arbitrate', (req, res) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id === id);
  
  if (order) {
    const deliberation = [
      { speaker: 'Dr. Marcus Vance (CS Mentor)', vote: 90, comment: 'Code structure is sound and matches milestone specs. Some documentation is missing, but core logic functions perfectly. Recommend 90% payout.' },
      { speaker: 'Sarah K. (Google Alumni)', vote: 80, comment: 'The UI components match Figma designs, but there are a few console warnings. Payout 80% to student, refunding 20% for refactoring.' },
      { speaker: 'AI complianceBot', vote: 100, comment: 'Transaction ledger logs indicate student submitted files 12 hours before deadline. Buyer failed to respond within milestone period. Recommend 100% payout.' }
    ];
    
    const avgVote = Math.round((deliberation[0].vote + deliberation[1].vote + deliberation[2].vote) / 3);
    
    order.status = 'resolved';
    order.disputeStatus = 'resolved';
    order.verdict = `Jury split verdict: Student awarded ${avgVote}%, Client refunded ${100 - avgVote}%.`;
    order.deliberationLog = deliberation;
    
    const student = db.students.find(s => s.id === order.studentId);
    if (student) {
      const awardedAmount = (order.amount * avgVote) / 100;
      student.earnings += awardedAmount;
      student.xp += Math.round(awardedAmount * 1.5);
      student.level = Math.floor(student.xp / 600) + 1;
    }
    
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'AI Arbitration Verdict Rendered',
        message: `Order #${id} resolved: Student awarded ${avgVote}% of escrow.`,
        category: 'order'
      }
    });
    
    res.json({ success: true, order, deliberationLog: deliberation });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// --- COLLABORATION PROJECTS APIS ---
app.get('/api/v1/collaboration/projects', (req, res) => {
  res.json({ success: true, projects: db.projects });
});

app.post('/api/v1/collaboration/projects/:id/kanban', (req, res) => {
  const { id } = req.params;
  const { source, destination, taskId } = req.body;
  
  const project = db.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  
  // Find task
  let task = null;
  const columns = ['todo', 'in_progress', 'done'];
  
  for (const col of columns) {
    const idx = project.kanban[col].findIndex(t => t.id === taskId);
    if (idx !== -1) {
      task = project.kanban[col].splice(idx, 1)[0];
      break;
    }
  }
  
  if (task) {
    project.kanban[destination].push(task);
    
    // Broadcast workspace movement via WS
    broadcast({
      type: 'KANBAN_MOVE',
      payload: {
        projectId: id,
        taskId,
        source,
        destination,
        task
      }
    });
    
    res.json({ success: true, kanban: project.kanban });
  } else {
    res.status(404).json({ success: false, message: 'Task not found' });
  }
});

app.post('/api/v1/collaboration/projects/:id/chat', (req, res) => {
  const { id } = req.params;
  const { sender, avatar, text } = req.body;
  
  const project = db.projects.find(p => p.id === id);
  if (project) {
    const newChat = { sender, avatar, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    project.chats.push(newChat);
    
    // Broadcast live chat
    broadcast({
      type: 'CHAT_MSG',
      payload: {
        projectId: id,
        chat: newChat
      }
    });
    
    res.json({ success: true, chat: newChat });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

// --- AI SERVICES ---
app.post('/api/v1/ai/career-advisor', (req, res) => {
  const { skills, interests, goal } = req.body;
  
  // High-fidelity AI recommendations simulator
  setTimeout(() => {
    res.json({
      success: true,
      careerPath: `Senior Web Solution Architect & AI Integration Lead`,
      roadmap: [
        { week: 'Week 1-2', focus: 'Deep Dive into API optimization and gRPC protocol structures' },
        { week: 'Week 3-4', focus: 'Design Patterns in Microservices & Vector indexing algorithms' },
        { week: 'Week 5-6', focus: 'Deploying high-throughput models on FastAPI with CUDA validation' }
      ],
      recommendations: [
        { type: 'course', title: 'Microservices Architecture Patterns (Apex Course CS-409)', rating: '4.8' },
        { type: 'gig', title: 'Write structured API routing specifications in Node/Go', estPrice: '$250' },
        { type: 'challenge', title: 'High-Scale Optimization Sandbox Challenge by Dr. Marcus Vance', reward: '250 XP' }
      ]
    });
  }, 800);
});

app.post('/api/v1/ai/gap-analyzer', (req, res) => {
  const { currentSkills, targetRole } = req.body;
  
  setTimeout(() => {
    res.json({
      success: true,
      targetRole: targetRole || 'AI Product Engineer (Stripe)',
      matchingScore: 78,
      missingSkills: ['TypeScript', 'FastAPI & RAG pipeline integration', 'CI/CD Pipelines (Docker/AWS)'],
      remediationPlan: [
        { step: 'Skill Certification', action: 'Enroll in RAG & VectorDB workshops' },
        { step: 'Practical Project', action: 'Build the campus navigation API routing using FastAPI and deploy to AWS Local' },
        { step: 'Alumni Coaching', action: 'Register for Sarah K\'s upcoming engineering seminar Q&A session' }
      ]
    });
  }, 800);
});

app.post('/api/v1/ai/resume-builder', (req, res) => {
  const { studentName, skills, projects, education } = req.body;
  
  setTimeout(() => {
    res.json({
      success: true,
      resumeMarkdown: `# ${studentName || 'Alex Chen'}
**Email**: student@university.edu | **Portfolio Score**: 90/100
***

### Technical Skills
* **Languages & Libraries**: ${skills ? skills.map(s => s.name).join(', ') : 'React, Node.js, FastAPI, CSS, SQL'}
* **Specializations**: REST Architectures, Vector Data Analytics, Agile Sprint Kanban

### Featured Validated Projects
${projects ? projects.map(p => `* **${p.project_title}**: ${p.description} (Approved by Mentor: ${p.mentor_validated})`).join('\n') : '* **Smart Campus Nav**: Interactive path-finding vector routing overlay. Mentor approved.'}

### Academic Profile
* **University**: Apex Technology University
* **Degree**: B.Tech Computer Science (${education ? education.graduationYear : 'Class of 2027'})
* **Skill Verification Rating**: Exceptional
`,
      atsScore: 92,
      suggestions: [
        'Add quantitative metrics to your projects (e.g., improved load latency by 30%)',
        'Verify your Tailwind CSS skills through class challenge certificates'
      ]
    });
  }, 1000);
});

app.post('/api/v1/ai/interview-practice', (req, res) => {
  const { question, answer } = req.body;
  
  setTimeout(() => {
    // Basic analysis on answer string length and key terms
    const text = (answer || '').toLowerCase();
    let score = 65;
    let feedback = 'Your answer is somewhat brief. Try expanding on the structure, tools used, and optimization details.';
    
    if (text.includes('react') || text.includes('api') || text.includes('state') || text.includes('latency')) {
      score = 85;
      feedback = 'Excellent use of technical terminology! You successfully explained the architectural trade-offs.';
    }
    
    res.json({
      success: true,
      score,
      analysis: {
        clarity: score > 80 ? 'High' : 'Medium',
        technicalAccuracy: score > 80 ? 'Strong' : 'Basic',
        suggestions: [
          'Describe how you handled latency optimization in your database connections.',
          'Provide a concrete scenario from your campus project when this technique was implemented.'
        ]
      },
      feedback,
      nextQuestion: 'Can you describe a situation where you had a database bottleneck and how you optimized it?'
    });
  }, 1000);
});

// --- CHALLENGES & GRADING (MENTORS) ---
app.post('/api/v1/mentor/challenges', (req, res) => {
  const { title, description, points, badge, dueDate } = req.body;
  
  const newChal = {
    id: `chal-${Date.now()}`,
    mentorId: 'usr-ment-1',
    mentorName: 'Dr. Marcus Vance',
    title,
    description,
    points: Number(points) || 100,
    badge: badge || 'Project Star',
    dueDate: dueDate || '2026-07-10',
    submissions: 0
  };
  
  db.challenges.push(newChal);
  
  broadcast({
    type: 'NOTIFICATION',
    payload: {
      title: 'New Class Challenge!',
      message: `Dr. Marcus Vance published: "${newChal.title}"`,
      category: 'challenge'
    }
  });

  res.json({ success: true, challenge: newChal });
});

// --- RECRUITER APIS ---
app.get('/api/v1/recruiter/jobs', (req, res) => {
  res.json({ success: true, jobs: db.jobs });
});

app.post('/api/v1/recruiter/jobs', (req, res) => {
  const { company, title, description, stipend, location, skillsRequired } = req.body;
  
  const newJob = {
    id: `job-${Date.now()}`,
    recruiterId: 'usr-recr-1',
    company: company || 'Stripe Inc.',
    title,
    description,
    stipend,
    location,
    skillsRequired: skillsRequired || [],
    status: 'active'
  };
  
  db.jobs.push(newJob);
  
  broadcast({
    type: 'NOTIFICATION',
    payload: {
      title: 'New Internship Posted!',
      message: `${newJob.company} is hiring for: "${newJob.title}"`,
      category: 'job'
    }
  });

  res.json({ success: true, job: newJob });
});

// --- ANALYTICS APIS ---
app.get('/api/v1/admin/analytics', (req, res) => {
  const totalStudents = db.students.length;
  const activeGigs = db.gigs.length;
  const totalEarnings = db.students.reduce((acc, curr) => acc + curr.earnings, 0);
  const averageSkill = Math.round(db.students.reduce((acc, curr) => acc + curr.skillScore, 0) / totalStudents);
  
  res.json({
    success: true,
    analytics: {
      totalStudents,
      activeGigs,
      totalEarnings,
      averageSkill,
      employabilityIndex: 82, // Campus aggregate index
      departmentPerformance: [
        { name: 'Computer Science', score: 88, activeStudents: 45 },
        { name: 'Design & Arts', score: 92, activeStudents: 22 },
        { name: 'Electronics', score: 76, activeStudents: 31 }
      ],
      recentOrdersCount: db.orders.length
    }
  });
});

// --- SIMULATION ENDPOINT (For interactive demo updates) ---
app.post('/api/v1/simulate-event', (req, res) => {
  const { eventType } = req.body;
  
  if (eventType === 'gig-sale') {
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'Live Marketplace Sale!',
        message: 'Student Priya Sharma just closed a $120 mobile UX wireframing gig!',
        category: 'marketplace'
      }
    });
  } else if (eventType === 'recruiter-match') {
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'AI Recruiter Match!',
        message: 'Alex Chen’s profile has been auto-matched with Stripe’s React Intern role.',
        category: 'ai'
      }
    });
  } else if (eventType === 'hackathon-launch') {
    broadcast({
      type: 'NOTIFICATION',
      payload: {
        title: 'New Campus Challenge!',
        message: 'Apex Incubator launched: "EdTech MVP Sprint 2026" - $5,000 in MVP prizes.',
        category: 'challenge'
      }
    });
  }
  
  res.json({ success: true, message: `Event ${eventType} simulated` });
});

// Serve frontend static files in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  // If the index file doesn't exist, we send a simple status (development fallback)
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('EduMarket Dev Server running API layer. Frontend is loading on Vite server...');
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EduMarket Core Server running on port ${PORT}`);
});
