# EduMarket: College Skill Marketplace & Career Ecosystem

An AI-powered student skill development and opportunity ecosystem designed to transform traditional higher education into a skill-first, experiential environment. Students can build dynamic portfolios, join collaborative workspaces, compete in class challenges, earn income through peer gigs, and receive career advice from specialized AI agents.

---

## 🚀 Key Features

* **Student Workspace**: Tracking levels, radial skill scores, weekly learning progress, and earnings statistics.
* **Skill Marketplace**: List gigs, buy and sell peer services, and handle transactions using safe escrow flows.
* **Collaboration Hub**: Interactive Kanban sprint boards, WebSocket real-time group chat, and voice call speaking status waves.
* **AI Career Companion**: 8 specialized agents providing path roadmaps, ATS resume generation, skill gap analysis, and mock technical interview training.
* **Mentor Space**: Grade class submissions, certify skill items, and issue performance XP.
* **Recruiter Center**: Slider-based semantic search matchmaker and job vacancies management.

---

## 🛠 Tech Stack

* **Frontend**: Next.js (React), Tailwind CSS, Lucide Icons, HSL styling system.
* **Backend**: Node.js, Express APIs, WebSocket gateways.
* **Database**: In-memory JSON datasets simulating PostgreSQL and MongoDB relationships.
* **AI Orchestration**: Python-simulated LLM routing services.

---

## 💻 Setup and Local Launch

### Prerequisites
* **Node.js** (v16 or higher) installed on your system.

### 1. Install Workspace Packages
From the root workspace directory, install the monorepo dependencies and configurations:
```bash
npm run install-all
```

### 2. Start Application Servers

You have two choices to launch the application:

#### A. Development Mode (Hot Reloading)
Launches the frontend Vite server on `http://localhost:5173` and Express on `http://localhost:5000` with hot module reloading enabled:
```bash
npm run dev
```

#### B. Production Mode (Single Port Gateway)
Builds the client React assets and launches the Express server serving the frontend on `http://localhost:5000`:
```bash
npm run build --prefix client
npm start
```

### 3. Open Browser
Depending on the option you chose:
* Development mode: 👉 **[http://localhost:5173](http://localhost:5173)**
* Production mode: 👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔗 Repository Navigation

* Frontend Client codebase: [`client/`](file:///d:/current%20project/College%20Skill%20Marketplace/client)
* App Layout entry: [`client/src/App.jsx`](file:///d:/current%20project/College%20Skill%20Marketplace/client/src/App.jsx)
* Express REST WebSocket server: [`server/server.js`](file:///d:/current%20project/College%20Skill%20Marketplace/server/server.js)
* State Coordinator context: [`client/src/context/AppContext.jsx`](file:///d:/current%20project/College%20Skill%20Marketplace/client/src/context/AppContext.jsx)

---

## 📂 Implementation Walkthrough

You can view the detailed architecture layout, user flows, database relational definitions, and manual verification procedures in the [Implementation Plan](file:///C:/Users/vijay/.gemini/antigravity-ide/brain/3734957a-4b79-4cce-a93a-762811e65088/implementation_plan.md) and [Walkthrough](file:///C:/Users/vijay/.gemini/antigravity-ide/brain/3734957a-4b79-4cce-a93a-762811e65088/walkthrough.md) artifacts.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/current%20project/College%20Skill%20Marketplace/LICENSE) file for details.

