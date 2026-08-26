<div align="center">

# 🚑 VAHAK

### Intelligent 3D Emergency Operations & Rural Healthcare Dispatch Command Center

**Intelligent Routing. Faster Care. Stronger Communities.**

A real-time, AI-augmented rural healthcare dispatch platform that fuses a **3D geospatial command center**, **A\* / Dijkstra routing**, **priority-based emergency dispatch**, **ambulance & hospital allocation**, and **live medicine inventory tracking** — built on Supabase/PostgreSQL with realtime updates and an AI operations assistant.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Hackathon%20%2F%20Educational-lightgrey)](#-license)

</div>

---

## 📌 Overview

Rural healthcare dispatch is **not** a simple "find the nearest location" problem. A patient may need a specific specialist, an available hospital bed, a particular medicine, a compatible ambulance, and a route that stays inside the emergency SLA — all decided in seconds.

**VAHAK** answers exactly that:

> *Which ambulance should respond, which hospital should receive the patient, and which route minimizes operational cost while satisfying every clinical and emergency constraint?*

```
Emergency → Priority Queue → Clinical/Resource Validation → Hospital Filtering
   → Ambulance Filtering → A*/Dijkstra Routing → Dispatch Score
   → Resource Reservation → Realtime Update → 3D Command Center → AI Explanation
```

---

## ✨ Key Features

| Module | Capability |
|---|---|
| 🌍 **3D Command Center** | Live digital twin of villages, hospitals, pharmacies, junctions, ambulances, active/blocked roads, and animated routes |
| 🚨 **Emergency Prioritization** | Binary-heap priority queue ranked by `CRITICAL → HIGH → MEDIUM → LOW`, tie-broken by SLA remaining |
| 🏥 **Intelligent Hospital Allocation** | Filters on specialist availability, doctor-on-duty, bed capacity, medicine stock, route feasibility & SLA |
| 🚑 **Smart Ambulance Allocation** | Matches ambulance type (`BLS`, `ALS`, `TRAUMA`, `NEONATAL`, `CRITICAL_CARE`), equipment, ETA, fuel & status |
| 🛣️ **Dynamic Road Network** | A\* / Dijkstra weighted-graph routing with live road closures (flood, landslide, accident, construction, traffic) and instant re-routing |
| 💊 **Medicine Inventory** | Real-time hospital-wise stock tracking with reorder-level alerts |
| 🤖 **AI Operations Intelligence** | Gemini-powered dispatch explanations, hospital comparisons, risk analysis, forecasting & natural-language queries |
| 🗄️ **Table & SQL Editor** | Built-in Supabase-style data browser with row CRUD, filtering, pagination, CSV export & a live SQL console |
| 📊 **Analytics Dashboard** | Response-time trends, SLA compliance, route recalculation stats, and A\* performance telemetry |
| 🔐 **Auth & RBAC** | Supabase Auth with role-based access (`dispatcher`, `doctor`, `hospital_admin`, `database_admin`, `system_admin`) |

---

## 🧠 Tech Stack

**Frontend** — React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · shadcn/ui · Lucide Icons · Three.js · React Three Fiber · Drei · Framer Motion (Motion) · Recharts · Leaflet

**Backend / Data** — Supabase (PostgreSQL, Auth, Realtime, Edge/server functions) · Express + tsx server

**Algorithms** — A\* · Dijkstra · Binary Heap Priority Queue · Adjacency-list Graph Engine · Route Caching · Dynamic Graph Updates

**AI** — Google Gemini API (server-side integration, secrets never exposed to the browser)

**State** — Zustand

---

## 🏗️ Architecture

```
                    ┌──────────────────────────┐
                    │   React + Three.js       │
                    │   3D Command Center       │
                    └────────────┬──────────────┘
                                 │  REST + Supabase Realtime
                    ┌────────────▼──────────────┐
                    │        Supabase            │
                    │  Auth + PostgreSQL + RT    │
                    └────────────┬──────────────┘
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
┌───────────────┐        ┌──────────────┐        ┌─────────────────┐
│ Dispatch      │        │ Routing      │        │ AI Intelligence │
│ Engine        │        │ Engine       │        │ Layer           │
├───────────────┤        ├──────────────┤        ├─────────────────┤
│ Priority Queue│        │ A* / Dijkstra│        │ Gemini API      │
│ Hospital Match│        │ Graph Cache  │        │ Explanations    │
│ Ambulance Match│        │ Road Closures│        │ Forecasting     │
│ Reservation   │        │ Re-routing   │        │ Risk Analysis   │
└───────┬───────┘        └──────┬───────┘        └────────┬────────┘
        └───────────────────────┼────────────────────────┘
                                 ▼
                     ┌──────────────────────┐
                     │  Local Simulation     │
                     │  50 Villages          │
                     │  10 Hospitals         │
                     │  50 Ambulances        │
                     └──────────────────────┘
```

---

## 📊 Demo Dataset Scale

| Entity | Count | Entity | Count |
|---|---|---|---|
| Villages | 50 | Road nodes | 80 |
| Hospitals | 10 | Road edges | 100+ |
| Ambulances | 50 | Doctors | 200 |
| Medicines | 20 | Patients | 100 |
| Hospital beds | 300+ | Demo emergencies | 20 |

> Architecture designed to scale toward **5,000+ villages, 50,000+ graph nodes, and 200,000+ weighted road edges.**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project
- A Google Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/<org>/VAHAK-AlgorithmX.git
cd VAHAK-AlgorithmX
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key

AI_PROVIDER=gemini
AI_API_KEY=your_secret_key
AI_MODEL=your_model
```
> ⚠️ Never commit secret keys or `SUPABASE_SERVICE_ROLE_KEY` — keep them server-side only.

### 3. Set Up the Database
- Open the Supabase SQL Editor
- Run `src/services/supabaseSchema.sql`
- Enable **Realtime** for: `emergencies`, `ambulances`, `hospitals`, `medicine_inventory`, `road_edges`, `dispatches`

### 4. Run the App
```bash
npm run dev      # start local dev server
npm run build    # production build
npm start        # run production server
```

---

## 🗂️ Project Structure

```
src/
├── components/       # dashboard, emergency, ambulance, hospital, 3d, map, modals, layout
├── pages/            # AiAssistant, Ambulances, Emergencies, Hospitals, Doctors, Roads,
│                      Medicines, Analytics, Simulation, Logs, Auth, Settings
├── services/         # dispatchEngine, routingAlgorithm, graphEngine, intelligentRoutingEngine,
│                      priorityQueue, aiService, geminiService, authService, seedDataGenerator...
├── store/            # useHealthcareStore (Zustand)
├── lib/              # supabaseClient
└── types.ts          # shared domain types
```

---

## 👥 Team — Algorithm X

<div align="center">

| Name | Role | Contribution | GitHub |
|---|---|---|---|
| 🧠 **Aditya Gupta** | Team Lead · AI & Algorithm Engineering | Dispatch logic, priority queue, A\*/Dijkstra routing engine, Gemini AI integration | — |
| 🎨 **Abhishek Gupta** | Frontend Engineering | React/TypeScript UI, 3D Command Center, dashboards & data visualization | [@MrAbhishekA279784](https://github.com/MrAbhishekA279784) |
| ⚙️ **Parth Angare** | Backend Engineering | Services layer, dispatch/routing engines, API integration | [@arceus6667-art](https://github.com/arceus6667-art) |
| 🔐 **Raj Barai** | Auth & Database | Supabase Auth, PostgreSQL schema, Row-Level Security, Realtime pipelines | [@lavender-0523](https://github.com/lavender-0523) |

</div>

---

## 🎯 Engineering Principle

VAHAK deliberately separates **deterministic operational logic** from **AI intelligence**:

```
GRAPH ALGORITHMS + PRIORITY QUEUES + RESOURCE ALLOCATION
    + REAL-TIME DATA + 3D VISUALIZATION + AI OPERATIONS INTELLIGENCE
```

Deterministic algorithms own operational truth (dispatch & routing decisions). AI is layered on top purely for **explanation, analysis, forecasting, and decision support** — the system remains fully operational even if the AI provider is unavailable.

---

## 🗺️ Roadmap

- [x] Phase 1 — Hackathon Demo: 50 villages · 10 hospitals · 50 ambulances
- [ ] Phase 2 — Expanded Simulation: 500 villages · 50 hospitals · 500 ambulances
- [ ] Phase 3 — Challenge Benchmark: 5,000+ villages · 50,000+ nodes · 200,000+ edges

---

## 📄 License

This project is a hackathon and educational prototype built by **Team Algorithm X**. Add an institution/competition-specific license before any public production deployment.

---

<div align="center">

**VAHAK** — *Optimizing emergency healthcare routing and resource allocation with real-time, explainable operational intelligence.*

Built with ❤️ by **Team Algorithm X**

</div>
