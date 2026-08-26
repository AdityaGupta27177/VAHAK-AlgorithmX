<div align="center">

<br/>

<h1>
<picture>
  <img alt="VAHAK" src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&size=80&duration=3000&pause=1000&color=00D4FF&center=true&vCenter=true&width=600&height=120&lines=VAHAK" />
</picture>
</h1>

<h3>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code><br/>
&nbsp;&nbsp;&nbsp;🚑&nbsp; <strong>Rural Healthcare 3D Dispatch &amp; Routing Command Center</strong> &nbsp;🚑<br/>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>
</h3>

<p><em>Intelligent Routing &nbsp;·&nbsp; Faster Care &nbsp;·&nbsp; Stronger Communities</em></p>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Hackathon%20%2F%20Educational-lightgrey?style=for-the-badge)](#-license)

<br/>

**🔗 Repository:** [github.com/AdityaGupta27177/VAHAK-AlgorithmX](https://github.com/AdityaGupta27177/VAHAK-AlgorithmX)

<br/>

<!-- ═══════════════════ PREVIEW SCREENSHOT ═══════════════════ -->
<!-- 📸 Save your screenshot as: assets/preview.png in the repo -->
<img src="assets/preview.png" alt="VAHAK 3D Command Center — Live Preview" width="900" />

<br/><br/>

### 📍 DHARNAI RURAL HEALTH NETWORK &nbsp;·&nbsp; JEHANABAD, BIHAR (NH-83)

<br/>

</div>

---

## 📌 Overview

Rural healthcare dispatch is **not** a simple "find the nearest location" problem. A patient may need a specific specialist, an available hospital bed, a particular medicine, a compatible ambulance, and a route that stays inside the emergency SLA — all decided in seconds.

**VAHAK** answers exactly that:

> *Which ambulance should respond, which hospital should receive the patient, and which route minimizes operational cost while satisfying every clinical and emergency constraint?*

The core decision pipeline:

```
Emergency → Priority Queue → Clinical/Resource Validation → Hospital Filtering
   → Ambulance Filtering → A*/Dijkstra Routing → Dispatch Score
   → Resource Reservation → Realtime Update → 3D Command Center → AI Explanation
```

**Primary optimization objective:**
```
Minimize: Travel Time + Patient Wait Time + Resource Penalty
Subject to: Urgency · Specialist availability · Bed capacity · Medicine · Ambulance type · Road conditions · SLA
```

---

## 🎯 The Core Problem

The nearest hospital is **not** necessarily the correct hospital.

```
Village A — Urgent Cardiology Emergency
      │
      ├── Hospital B — 10 km — ❌ NO Cardiologist on duty    → REJECTED
      │
      └── Hospital C — 25 km — ✅ Cardiologist available
                                ✅ Bed available
                                ✅ Medicine in stock
                                ✅ Route within SLA           → SELECTED
```

VAHAK enforces this evaluation across **every** emergency, automatically.

---

## ✨ Key Features

| Module | Capability |
|---|---|
| 🌍 **3D Command Center** | Live digital twin of villages, hospitals, pharmacies, junctions, ambulances, active/blocked roads, and animated routes |
| 🚨 **Emergency Prioritization** | Binary-heap priority queue ranked by `CRITICAL → HIGH → MEDIUM → LOW`, tie-broken by SLA remaining & wait time |
| 🏥 **Intelligent Hospital Allocation** | Filters on specialist availability, doctor-on-duty, bed & ICU capacity, medicine stock, route feasibility & SLA |
| 🚑 **Smart Ambulance Allocation** | Matches ambulance type (`BLS`, `ALS`, `TRAUMA`, `NEONATAL`, `CRITICAL_CARE`), equipment, ETA, fuel & status |
| 🛣️ **Real Road Routing** | A\* / Dijkstra on actual road graph — no straight-line shortcuts across farms, fields, rivers or buildings |
| 🔄 **Dynamic Road Closures** | Live rerouting on flood, landslide, accident, construction, traffic — canonical route shared by 3D map, Google Maps & ETA |
| 💊 **Medicine Inventory** | Real-time hospital-wise stock tracking with reorder-level alerts |
| 🤖 **AI Operations Intelligence** | Gemini-powered dispatch explanations, hospital comparisons, risk analysis, forecasting & natural-language queries |
| 🗄️ **Table & SQL Editor** | Built-in Supabase-style data browser with row CRUD, filtering, pagination, CSV export & live SQL console |
| 📊 **Analytics Dashboard** | Response-time trends, SLA compliance, route recalculation stats, A\* performance telemetry |
| 🔐 **Auth & RBAC** | Supabase Auth with roles: `dispatcher` · `doctor` · `hospital_admin` · `database_admin` · `system_admin` |

---

## 🧠 Tech Stack

**Frontend** — React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS 4 · shadcn/ui · Lucide Icons · Three.js · React Three Fiber · Drei · Framer Motion · Recharts · Leaflet

**Backend / Data** — Supabase (PostgreSQL + Auth + Realtime + RLS) · Express + tsx server

**Algorithms** — A\* · Dijkstra · Binary Heap Priority Queue · Adjacency-list Graph Engine · Route Caching · Dynamic Graph Updates

**AI** — Google Gemini API (server-side proxy — secrets never exposed to the browser)

**State** — Zustand

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────┐
                    │   React + Three.js Frontend  │
                    │   3D Command Center · HUD    │
                    └────────────┬─────────────────┘
                                 │  REST + Supabase Realtime
                    ┌────────────▼─────────────────┐
                    │          Supabase             │
                    │   Auth · PostgreSQL · RT      │
                    └──────┬──────────┬─────────────┘
                           │          │
          ┌────────────────┼──────────┼──────────────────┐
          ▼                ▼          ▼                   ▼
   ┌─────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐
   │  Dispatch   │  │  Routing   │  │    AI      │  │  Google Maps │
   │  Engine     │  │  Engine    │  │  Layer     │  │  Integration │
   ├─────────────┤  ├────────────┤  ├────────────┤  └──────┬───────┘
   │ Priority Q  │  │ A*/Dijkstra│  │ Gemini API │         │
   │ Hospital ✓  │  │ Graph Cache│  │ Explain    │         │
   │ Ambulance ✓ │  │ Road Close │  │ Forecast   │         │
   │ Reservation │  │ Rerouting  │  │ Risk Analy │         │
   └──────┬──────┘  └─────┬──────┘  └─────┬──────┘         │
          └───────────────┴───────────────┴────────────────┘
                                 │
                    ┌────────────▼─────────────────┐
                    │      CANONICAL ROUTE          │
                    │  (shared by 3D · Maps · ETA) │
                    └────────────┬─────────────────┘
                                 │
                    ┌────────────▼─────────────────┐
                    │     Local Simulation          │
                    │  50 Villages · 10 Hospitals  │
                    │  50 Ambulances · 200 Doctors  │
                    └──────────────────────────────┘
```

---

## 🧠 Algorithm Engine

### Binary Min-Heap Priority Queue
```typescript
class BinaryHeap<T> {
  push(item: T): void   // O(log n)
  pop(): T | undefined  // O(log n)
  peek(): T | undefined // O(1)
}
```

Emergency priority order: `CRITICAL → HIGH → MEDIUM → LOW`
Tie-breaking: SLA remaining → deadline → waiting time

### A\* Pathfinding
```
f(n) = g(n) + h(n)

g(n) = accumulated travel cost (distance × traffic × road_condition)
h(n) = geographic heuristic (3D Euclidean, elevation weighted ×4)
f(n) = estimated total cost to goal
```

- **Graph:** Adjacency-list with weighted edges
- **Cache:** Route cache with incremental invalidation on closure events
- **Smooth paths:** Catmull-Rom spline subdivision (12 segments/waypoint)
- A\* traverses only **connected road edges** — never arbitrary lat/lng points

### Real Road Routing — Non-Negotiable
```
❌  Origin ─────────────────── Destination   (straight line — NEVER)

✅  Origin
      ↓ Nearest valid road node
      ↓ Road segment
      ↓ Junction
      ↓ Road segment
      ↓ Bridge (if river crossing)
      ↓ Road segment
      Destination
```

If no valid road route exists → return `NO VALID ROAD ROUTE AVAILABLE`. No imaginary lines.

### Dispatch Score
```
Score = AmbulanceETA + HospitalTravelTime + CapacityPenalty + TrafficPenalty + SLARisk
```
Lower = better. Only clinically eligible hospitals enter scoring.

---

## 🔄 Lifecycle States

### Ambulance
```
AVAILABLE → ASSIGNED → EN_ROUTE → ARRIVED → TRANSPORTING → AVAILABLE
```

### Emergency
```
QUEUED → DISPATCHING → DISPATCHED → EN_ROUTE → ARRIVED → COMPLETED
```

### Road Closure → Reroute Flow
```
ROAD BLOCKED
   ↓ Invalidate affected route
   ↓ Update graph version
   ↓ Run A* on updated graph
   ↓ Find alternative valid road route
   ↓ Recalculate ETA
   ↓ Update ambulance route
   ↓ Push via Supabase Realtime
   ↓ 3D path animation updates live
```

---

## 🗄️ Database Schema

**21 core Supabase/PostgreSQL tables:**

```
villages              patients              hospitals
hospital_departments  hospital_beds         doctors
doctor_shifts         ambulances            ambulance_equipment
medicines             medicine_inventory    emergencies
road_nodes            road_edges            road_closures
routes                dispatches            dispatch_events
ai_recommendations    audit_logs
```

---

## 📊 Demo Dataset

| Entity | Count | Entity | Count |
|---|---|---|---|
| 🏘️ Villages | 50 | 🗺️ Road Nodes | 80 |
| 🏥 Hospitals | 10 | 🛣️ Road Edges | 100+ |
| 🚑 Ambulances | 50 | 👨‍⚕️ Doctors | 200 |
| 💊 Medicines | 20 | 🧑‍🤝‍🧑 Patients | 100 |
| 🛏️ Hospital Beds | 300+ | 🆘 Demo Emergencies | 20 |

> Architecture targets: **5,000+ villages · 50,000+ graph nodes · 200,000+ weighted road edges**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project
- Google Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/AdityaGupta27177/VAHAK-AlgorithmX.git
cd VAHAK-AlgorithmX
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```
```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_anon_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# AI (server-side only — never expose in browser)
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.0-flash
```
> ⚠️ Never commit `.env`. Never use `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

### 3. Database Setup
1. Open Supabase → SQL Editor
2. Run `src/services/supabaseSchema.sql`
3. Enable **Realtime** for: `emergencies` · `ambulances` · `hospitals` · `medicine_inventory` · `road_edges` · `dispatches`
4. Configure Row Level Security

### 4. Run
```bash
npm run dev       # development
npm run build     # production build
npm start         # run production server
```

---

## 📁 Project Structure

```
VAHAK-AlgorithmX/
├── src/
│   ├── components/
│   │   ├── 3d/              # CommandCenter3D, Ambulance3D, HospitalNode,
│   │   │                      VillageNode, RoutePath, RoadNetwork,
│   │   │                      MapHUDOverlay, RoutingAnalysisOverlay
│   │   ├── dashboard/       # RightIntelligencePanel
│   │   ├── layout/          # TopBar, Sidebar, BottomTelemetry
│   │   └── modals/          # CreateEmergency, Dispatch, JudgeDemo
│   ├── pages/               # Emergencies, Ambulances, Hospitals, Doctors,
│   │                          AiAssistant, Analytics, Simulation, Roads,
│   │                          Medicines, Logs, Settings, Auth
│   ├── services/
│   │   ├── intelligentRoutingEngine.ts   ← A* implementation
│   │   ├── routingAlgorithm.ts           ← Dijkstra + Catmull-Rom splines
│   │   ├── dispatchEngine.ts             ← Hospital + ambulance scoring
│   │   ├── priorityQueue.ts              ← Binary heap
│   │   ├── graphEngine.ts                ← Adjacency list graph
│   │   ├── geminiService.ts              ← AI integration
│   │   ├── seedDataGenerator.ts          ← Demo data
│   │   └── supabaseSchema.sql            ← Full DB schema
│   ├── store/
│   │   └── useHealthcareStore.ts         ← Zustand global state
│   └── types.ts                          ← Shared TypeScript types
├── server.ts                             ← Express AI proxy (keys stay server-side)
└── .env.example
```

---

## 🎬 Judge Demo — 3 Minutes

```
00:00 – 00:20  Open 3D Command Center
               → 50 Villages · 10 Hospitals · 50 Ambulances live on Bihar road network

00:20 – 00:45  Create: CRITICAL CARDIAC EMERGENCY — Jehanabad village
               → Emergency enters priority queue at CRITICAL slot

00:45 – 01:15  Hospital evaluation shown in real time
               → Hospital B (10 km): ❌ REJECTED — No Cardiologist on duty
               → Hospital C (25 km): ✅ SELECTED — All constraints satisfied

01:15 – 01:40  A* Telemetry
               → Route follows NH-83 road network (no farm shortcuts)
               → Distance · ETA · Nodes visited · Execution time
               → Ambulance animates along actual road path in 3D

01:40 – 02:00  Road BLOCKED during active dispatch
               → A* recalculates in real time on updated graph
               → New route pushed via Supabase Realtime
               → 3D path + ETA update live

02:00 – 02:25  Ask AI: "Why was Hospital C selected?"
               → Structured JSON explanation with confidence score

02:25 – 03:00  EMERGENCY RESOLVED
               → Response time · SLA compliance · Route recalculations
               → A* performance · AI confidence
```

---

## 📡 Telemetry Exposed

The command center surfaces metrics derived from **actual system state**:

- Active emergencies & queue size
- Available ambulances
- Hospital capacity & ICU occupancy
- Medicine stock levels
- A\* execution time & nodes visited
- Dijkstra execution time (comparison)
- Route recalculations count
- Dispatch latency
- SLA compliance status

---

## 🔐 AI Safety Architecture

```
User → AI → Recommendation → Backend Validation → Deterministic Engine → DB Mutation
                    ↑
         ❌ AI never directly mutates the database
```

**Always deterministic (never AI-driven):**
Emergency priority · Hospital eligibility · Ambulance eligibility · A\*/Dijkstra routing · Bed/medicine/ambulance reservation

**AI is for:** Explanation · Comparison · Risk analysis · Forecasting · Simulation planning

> AI unavailable? The system keeps running — dispatch and routing are hard dependencies on deterministic logic only.

---

## 📈 Scaling Roadmap

| Phase | Villages | Graph Nodes | Road Edges |
|-------|----------|-------------|------------|
| 🟢 **Phase 1** — Hackathon | 50 | 80 | 100+ |
| 🟡 **Phase 2** — Expanded | 500 | 5,000 | 10,000+ |
| 🔴 **Phase 3** — Challenge Benchmark | 5,000+ | 50,000+ | 200,000+ |

Phase 3 additions: Redis · Background workers · Graph partitioning · Geospatial indexing · Connection pooling · Horizontal scaling

---

## ✅ Pre-Presentation Checklist

<details>
<summary>Expand checklist</summary>

- [ ] Demo location set: Jehanabad, Bihar (NH-83)
- [ ] Supabase connected
- [ ] 50 villages loaded from database
- [ ] 10 hospitals loaded from database
- [ ] 50 ambulances loaded from database
- [ ] Real coordinates used (no hardcoded arrays)
- [ ] Google Maps integration working
- [ ] Routes follow actual roads (no farm/field shortcuts)
- [ ] Bridges used for valid river crossings
- [ ] Blocked roads avoided by A*
- [ ] Priority queue ordering correct
- [ ] Specialist filtering working
- [ ] Bed & ICU availability working
- [ ] Medicine availability working
- [ ] Ambulance allocation & scoring working
- [ ] Dynamic road closure + rerouting working
- [ ] Supabase Realtime updating frontend live
- [ ] 3D route animation synced with dispatch
- [ ] AI explanation returning structured JSON
- [ ] Analytics page showing real metrics
- [ ] Simulation engine running

</details>

---

## 👥 The Team — Algorithm X

<div align="center">

| | Name | Role | Contribution | GitHub |
|--|------|------|-------------|--------|
| 🧠 | **Aditya Gupta** | Team Lead · AI & Algorithms | Dispatch engine, priority queue, A\*/Dijkstra routing, Gemini AI integration | [@AdityaGupta27177](https://github.com/AdityaGupta27177) |
| 🎨 | **Abhishek Gupta** | UI/UX & Frontend | React/TypeScript UI, 3D Command Center, dashboards, data visualization | [@MrAbhishekA279784](https://github.com/MrAbhishekA279784) |
| ⚙️ | **Parth Angare** | Backend Engineering | Services layer, dispatch/routing engines, API integration | [@arceus6667-art](https://github.com/arceus6667-art) |
| 🔐 | **Raj Barai** | Auth & Database | Supabase Auth, PostgreSQL schema, Row-Level Security, Realtime pipelines, docs | [@lavender-0523](https://github.com/lavender-0523) |

</div>

---

## 📄 License

This project is a hackathon and educational prototype built by **Team Algorithm X**.  
Add an institution/competition-specific license before any public production deployment.

---

<div align="center">

**VAHAK** — *Optimizing emergency healthcare routing and resource allocation with real-time, explainable operational intelligence.*

`React` · `Three.js` · `Supabase` · `PostgreSQL` · `A*` · `Dijkstra` · `Priority Queue` · `Realtime` · `Gemini AI`

Built with ❤️ by **Team Algorithm X** for rural India

*Every second counts. Every route matters. Every life is worth the algorithm.*

**📍 DHARNAI RURAL HEALTH NETWORK · JEHANABAD, BIHAR (NH-83)**

</div>
