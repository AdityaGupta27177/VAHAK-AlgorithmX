<div align="center">

```
██╗   ██╗ █████╗ ██╗  ██╗ █████╗ ██╗  ██╗
██║   ██║██╔══██╗██║  ██║██╔══██╗██║ ██╔╝
██║   ██║███████║███████║███████║█████╔╝ 
╚██╗ ██╔╝██╔══██║██╔══██║██╔══██║██╔═██╗ 
 ╚████╔╝ ██║  ██║██║  ██║██║  ██║██║  ██╗
  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
    A L G O R I T H M X  ⚡  3 D
```

### 🚑 **VAHAK COMMAND CENTER**
#### *Intelligent Rural Healthcare Dispatch, Routing & Resource Optimization*

**`Real-time`** • **`Intelligent`** • **`Life-saving`**

---

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=for-the-badge&logo=three.js)](https://threejs.org)
[![Google Maps](https://img.shields.io/badge/Google_Maps-Platform-4285F4?style=for-the-badge&logo=googlemaps)](https://developers.google.com/maps)

---

📍 **Demo Network: Dharnai Rural Health Network • Jehanabad, Bihar (NH-83)**

</div>

---

---

## 🧩 The Problem

Rural healthcare networks operate with limited ambulances, specialists, hospital beds, medicines, and reliable transportation infrastructure. During simultaneous emergencies, **the nearest hospital is not always the correct destination**.

```
Village A
    │
    │  Critical Cardiology Emergency
    ▼
Hospital B ── 10 km ── ❌ Cardiologist unavailable
Hospital C ── 25 km ── ✅ Cardiologist available
                        ✅ Bed available
                        ✅ Medicine available
```

**VAHAK AlgorithmX** evaluates the complete operational state before dispatching a single ambulance. Distance is a factor — not the decision.

---

## 🚀 Project Overview

VAHAK AlgorithmX is a **real-time algorithmic healthcare logistics platform** for:

- 🗺️ Emergency routing over a real road graph
- 🚑 Ambulance dispatch with capability matching
- 🏥 Hospital selection with medical eligibility enforcement
- 💊 Medicine & bed resource reservation (transaction-safe)
- 🚧 Dynamic road closure detection & live re-routing
- 📊 Priority queue scheduling by urgency, SLA, and wait-time
- 🤖 Explainable AI layer for decision summaries

### Demo Network Scale

| Resource | Demo | Target Architecture |
|---|---|---|
| Villages | 50 | 5,000+ |
| Hospitals | 10 | — |
| Ambulances | 50 | — |
| Graph Nodes | — | 50,000+ |
| Road Edges | — | 200,000+ |
| Concurrent Emergencies | — | Thousands |

---

## 🏗️ System Architecture

```
              ┌─────────────────────┐
              │    REACT FRONTEND   │
              │  Vite + Three.js 3D │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   SERVICE LAYER     │
              │ Emergency / Dispatch│
              └──────────┬──────────┘
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
┌───────────┐     ┌───────────┐     ┌───────────┐
│  Priority │     │Eligibility│     │ Resource  │
│   Queue   │     │  Engine   │     │Allocation │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      └──────────────────┼──────────────────┘
                         ▼
              ┌─────────────────────┐
              │   ROUTING ENGINE    │
              │   A* / Dijkstra     │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │   REAL ROAD GRAPH   │
              │ Nodes + Road Edges  │
              │ Traffic + Closures  │
              └──────────┬──────────┘
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
┌───────────┐     ┌───────────┐     ┌───────────┐
│Google Maps│     │ Supabase  │     │ Realtime  │
│ Geometry  │     │PostgreSQL │     │  Events   │
└───────────┘     └───────────┘     └───────────┘
                         ▼
              ┌─────────────────────┐
              │  CANONICAL ROUTE    │
              │ Map + 3D + Dispatch │
              └─────────────────────┘
```

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 | Interactive command-center interface |
| **Build Tool** | Vite 6.2 | Fast development and production builds |
| **3D Visualization** | Three.js + React Three Fiber | Live ambulance tracking and 3D terrain |
| **Styling** | Tailwind CSS 4 | Command-center dark UI |
| **State** | Zustand | Global fleet/emergency state management |
| **Animations** | Motion (Framer) | Real-time route and status transitions |
| **Database** | Supabase PostgreSQL | Persistent operational data |
| **Realtime** | Supabase Realtime | Live emergency, ambulance & resource sync |
| **Maps** | Google Maps Platform + Leaflet | Geographic visualization & road routing |
| **Routing** | A* Algorithm | Primary graph shortest-path search |
| **Routing** | Dijkstra | Shortest-path benchmarking & validation |
| **Data Structure** | Priority Queue / Binary Heap | Emergency urgency scheduling |
| **Charting** | Recharts | Analytics and telemetry dashboards |
| **AI** | Google Gemini (`@google/genai`) | Decision explanations & operational intelligence |
| **Backend** | Express + TSX | API server layer |
| **Language** | TypeScript 5.8 | Full-stack type safety |

---

## 🧠 Algorithms & Approach

The implementation follows a strict pipeline:

**Filter → Route → Score → Reserve → Dispatch → Monitor → Re-route**

This prevents expensive routing computations on obviously ineligible destinations and makes every decision explainable to the operator.

### Emergency Dispatch Pipeline

```
Receive Emergency
       ↓
Assign Urgency / SLA
       ↓
Insert into Priority Queue   [O(log n)]
       ↓
Filter Eligible Hospitals
  ├── Specialist on active shift?
  ├── Bed / ICU available?
  ├── Required medicine in stock?
  └── Hospital operational?
       ↓
Find Compatible Ambulances
  ├── Vehicle type match?
  ├── Equipment match?
  └── ETA to patient?
       ↓
Query Road Graph
       ↓
Run A* / Dijkstra
       ↓
Score Feasible Options
  └── ETA to patient + ETA to hospital + penalties
       ↓
Transactional Resource Reservation
  └── Ambulance + Bed + Medicine (atomic)
       ↓
Dispatch
       ↓
Stream Realtime State Updates
       ↓
Road condition change?
  ├── NO  → Continue monitoring
  └── YES → Invalidate route → Re-run A* → Update ETA
```

---

### ⭐ A\* Routing

A* is the primary routing algorithm. The geographic heuristic guides the search toward the destination, avoiding unnecessary full-graph traversal — critical when the network has tens of thousands of nodes.

```
f(n) = g(n) + h(n)

g(n) = accumulated travel cost (time or distance)
h(n) = Haversine-based geographic heuristic to destination
f(n) = estimated total route cost
```

The graph uses an **adjacency-list representation**:

```typescript
export class RoadNetworkGraph {
  nodes: Map<string, GraphNode>        // nodeId → { lat, lon, type }
  adjacencyList: Map<string, GraphEdge[]> // nodeId → [{ to, distance, travelTime, blocked }]
  edges: Map<string, GraphEdge>
}
```

Blocked road edges are excluded from traversal. If no connected path exists, the system reports **NO VALID ROAD ROUTE AVAILABLE** — it never falls back to a straight-line path.

---

### 🔎 Dijkstra

Dijkstra runs on the same road graph and same cost model as A* to:
- Provide a reliable shortest-path baseline
- Benchmark A* search efficiency (visited nodes, execution time)
- Validate A* correctness

---

### ⚡ Priority Queue (Binary Heap)

Emergency requests are managed through a min-heap priority queue.

```
Priority Order:    CRITICAL → HIGH → MEDIUM → LOW
Tie-breaking:      SLA remaining → Deadline → Wait time

Complexity:
  Push → O(log n)
  Pop  → O(log n)
  Peek → O(1)
```

---

### 🏥 Hospital Eligibility Engine (Code Excerpt)

```typescript
// From: src/services/dispatchEngine.ts
export function evaluateHospitalForEmergency(
  emergency: Emergency,
  hospital: Hospital,
  doctors: Doctor[],
  medicines: Medicine[],
  graph: RoadNetworkGraph,
  patientNodeId: string
): HospitalClinicalEvaluation {
  // 1. Operational status check
  // 2. Bed / ICU capacity check
  // 3. Required specialist on active shift
  // 4. Required medicine in stock
  // 5. Valid connected road route via A*
  // Returns: { eligible, rejectionReasons, score }
}
```

Hospital filtering happens **before** route optimization. This prevents the routing engine from spending compute on a medically unsuitable destination.

---

### 🚧 Dynamic Road Closures

```
ROAD OPEN
    ↓
ROAD BLOCKED
    ↓
Affected Route Invalidated
    ↓
Road Graph Updated (edge.blocked = true)
    ↓
A* Recalculation
    ↓
Alternative Valid Route
    ↓
ETA Updated → Ambulance Route Updated
```

---

### 💊 Transaction-Safe Resource Reservation

A successful dispatch atomically reserves:

```
Ambulance  +  Hospital Bed  +  Required Medicine
```

Simultaneous emergency requests cannot reserve the same unavailable resource. Reservations are committed only after all three resources are confirmed available.

---

## 📁 Project Structure

```
VAHAK-AlgorithmX/
│
├── src/
│   ├── components/
│   │   ├── 3d/                    # Three.js / R3F components
│   │   │   ├── Ambulance3D.tsx    # Live ambulance mesh + animation
│   │   │   ├── CommandCenter3D.tsx
│   │   │   ├── EmergencyMarker.tsx
│   │   │   ├── HospitalNode.tsx
│   │   │   ├── MapHUDOverlay.tsx  # In-3D HUD overlays
│   │   │   ├── RoadNetwork.tsx
│   │   │   ├── RoutePath.tsx
│   │   │   └── TerrainEnvironment.tsx
│   │   ├── dashboard/
│   │   │   └── RightIntelligencePanel.tsx
│   │   ├── layout/
│   │   │   ├── BottomTelemetry.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── map/
│   │   │   └── GoogleMapsInteractiveView.tsx
│   │   └── modals/
│   │       ├── CreateEmergencyModal.tsx
│   │       ├── DispatchModal.tsx
│   │       └── JudgeDemoModal.tsx
│   │
│   ├── pages/
│   │   ├── AiAssistantPage.tsx
│   │   ├── AmbulancesPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── DoctorsPage.tsx
│   │   ├── EmergenciesPage.tsx
│   │   ├── HospitalsPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MedicinesPage.tsx
│   │   ├── RoadsPage.tsx
│   │   ├── SimulationPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── services/
│   │   ├── graphEngine.ts          # RoadNetworkGraph + Haversine
│   │   ├── dispatchEngine.ts       # Hospital eligibility + dispatch pipeline
│   │   ├── intelligentRoutingEngine.ts  # A* implementation
│   │   ├── priorityQueue.ts        # Binary heap + SLA scheduling
│   │   ├── ambulanceService.ts
│   │   ├── emergencyService.ts
│   │   ├── hospitalService.ts
│   │   ├── geminiService.ts        # AI decision explanation
│   │   ├── aiService.ts
│   │   └── analyticsService.ts
│   │
│   ├── lib/
│   │   └── supabaseClient.ts
│   │
│   └── types/                      # Full TypeScript type definitions
│
├── supabase/
│   ├── migrations/
│   └── seed/
│
├── server.ts                       # Express backend
├── index.html
├── package.json
├── .env.example
└── README.md
```

---

## 🗄️ Database Architecture

Supabase PostgreSQL stores all operational state:

| Table | Purpose |
|---|---|
| `villages` | 50 rural villages with GPS coordinates |
| `hospitals` | Hospital capacity, status, specialists |
| `hospital_beds` | Bed-level occupancy tracking |
| `doctors` / `doctor_shifts` | Specialist availability & duty status |
| `ambulances` / `ambulance_equipment` | Fleet state & capability |
| `medicines` / `medicine_inventory` | Per-hospital medicine stock |
| `emergencies` | Emergency queue with urgency & SLA |
| `road_nodes` / `road_edges` | Graph nodes and weighted road segments |
| `road_closures` | Active and historical road blocks |
| `routes` | Calculated A* / Dijkstra routes |
| `dispatches` / `dispatch_events` | Dispatch lifecycle events |
| `ai_recommendations` | Gemini AI explanation logs |
| `audit_logs` | Full operational audit trail |

**Key indexes:** `emergencies.status`, `emergencies.urgency`, `road_edges.blocked`, `ambulances.status`, `medicine_inventory.hospital_id`

---

## 🔴 Realtime Architecture

Supabase Realtime keeps the command center synchronized without page refresh:

```
Database Change  →  Supabase Realtime  →  UI State Update

Channels:
  emergencies      → Priority queue refresh
  ambulances       → Fleet position & status
  hospitals        → Bed / resource counters
  medicine_inventory → Stock levels
  road_closures    → Graph edge invalidation → A* re-route
  dispatches       → Route streaming
```

**Ambulance lifecycle:**

```
AVAILABLE → ASSIGNED → EN_ROUTE → ARRIVED → TRANSPORTING → AVAILABLE
```

**Emergency lifecycle:**

```
QUEUED → DISPATCHING → DISPATCHED → EN_ROUTE → ARRIVED → COMPLETED
```

---

## 🤖 AI Integration (Gemini)

The AI layer (`@google/genai`) is an **explanation and assistance layer only**. It does not override deterministic decisions.

| AI Responsibility | Deterministic Responsibility |
|---|---|
| Explain why a hospital was selected | A* path calculation |
| Explain why a hospital was rejected | Emergency priority |
| Summarize route decisions | Specialist eligibility |
| Identify operational risks | Bed / medicine availability |
| Generate human-readable dispatch reasoning | Transactional resource reservation |

If the AI service is unavailable, the core routing and dispatch engine continues operating without interruption.

---

## 🔧 Setup & Run Instructions

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- Google Maps Platform API key
- Google Gemini API key

### 1. Clone Repository

```bash
git clone https://github.com/AdityaGupta27177/VAHAK-AlgorithmX.git
cd VAHAK-AlgorithmX
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit `.env`. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. Use Supabase Row Level Security for protected operations.

### 4. Start Development Server

```bash
npm run dev
```

### 5. Production Build

```bash
npm run build
npm run start
```

### 6. Preview Production Build

```bash
npm run preview
```

---

## 🧪 Test Cases

The test suite validates both algorithm correctness and operational edge cases.

| # | Test Case | Input | Expected Behavior |
|---|---|---|---|
| 01 | **Specialist Unavailable** | Nearest hospital has no required specialist | Hospital rejected. Next medically eligible hospital evaluated |
| 02 | **Hospital Bed Full** | Hospital has specialist but zero available beds | Hospital rejected. Another eligible facility evaluated |
| 03 | **Medicine Depleted** | Required medicine inventory = 0 | Hospital rejected or replenishment workflow triggered |
| 04 | **All Ambulances Occupied** | No compatible ambulance currently available | Emergency stays queued with high priority. Dispatch triggers when a unit becomes available |
| 05 | **Road Closure** | Active route contains a newly blocked edge | Route invalidated. A* recalculates. Alternative connected path selected |
| 06 | **No Valid Route** | No connected road path between source and destination | `NO VALID ROAD ROUTE AVAILABLE` — no straight-line fallback generated |
| 07 | **Simultaneous Critical Emergencies** | Multiple CRITICAL requests arrive together | Priority queue resolves by urgency + SLA/deadline/wait-time. Reservations remain consistent |
| 08 | **A\* vs Dijkstra Benchmark** | Same source, destination & road graph | Both return valid shortest path. Benchmark: execution time, visited nodes, path cost |

---

## 🌐 Third-Party APIs

| Tool / API | One-line Purpose |
|---|---|
| **Google Maps Platform** | Geographic mapping, road-aware visualization, and route geometry for the command center |
| **Supabase** | PostgreSQL database storage, authentication, and realtime synchronization across all operational entities |
| **Leaflet** | Lightweight interactive map layer used alongside Google Maps for road overlay rendering |

---

## 🤖 AI Tools

| Tool | One-line Purpose |
|---|---|
| **Google Gemini (`@google/genai`)** | Generates human-readable dispatch explanations, hospital selection reasoning, and operational risk summaries around deterministic routing decisions |

---

## 🎯 Demo Workflow (Judge Scenario)

The central demonstration scenario: a medically urgent request where the geographically nearest facility is **not** the correct destination.

```
[1] Critical Cardiology Request arrives from Village Dhakai

[2] PRIORITY QUEUE — CRITICAL urgency, SLA timer starts

[3] Hospital B (10 km)
     → Evaluated
     → ❌ No Cardiologist on active shift
     → REJECTED

[4] Hospital C — Trauma Hospital, Jehanabad (25 km)
     → ✅ Cardiologist available
     → ✅ ICU bed available
     → ✅ Required medicine in stock
     → ELIGIBLE

[5] Available Ambulances evaluated by ETA to patient

[6] A* runs on road graph → NH-83 route calculated

[7] Resources reserved transactionally

[8] Ambulance A-17 dispatched — ETA: 04:28

[9] NH-83 Landslide detected → edge blocked

[10] Route invalidated → A* recalculates
     → Alternative road path selected
     → New ETA streamed to command center
```

---

## ⚡ Performance Targets

| Operation | Complexity |
|---|---|
| Priority Queue Insert | O(log n) |
| Priority Queue Remove | O(log n) |
| Priority Queue Peek | O(1) |
| A* (adjacency-list + binary heap) | O((V + E) log V) |
| Dijkstra (adjacency-list + binary heap) | O((V + E) log V) |

Additional optimizations:
- Candidate hospital filtering before route computation
- Route caching where operationally safe
- Graph versioning for incremental re-calculation
- Indexed Supabase queries on hot fields
- Realtime state separated from compute-heavy routing

---

## 👥 Team

| Name | Role |
|---|---|
| **Abhishek Gupta** | UI/UX & Frontend Development |
| **Parth Angare** | Backend Development |
| **Aditya Gupta** | Algorithms & AI/ML |
| **Raj Barai** | Auth, Database & Documentation |

---

## 📋 Submission Checklist

- [x] Repository name follows Team Name requirement
- [x] Complete source code pushed to repository
- [x] `Twenitrix` added as Collaborator
- [x] `AyushRBuilds` added as Collaborator
- [x] `InvictusMF` added as Collaborator
- [x] README.md properly updated and formatted
- [x] Algorithm / approach documented
- [x] Testing / test cases included
- [x] Third-party APIs mentioned with one-line purpose
- [x] AI tools mentioned with one-line purpose
- [x] Deployed project link working
- [x] Repository link correct and accessible

---

## 🔗 Repository

**Source Code:** [https://github.com/AdityaGupta27177/VAHAK-AlgorithmX](https://github.com/AdityaGupta27177/VAHAK-AlgorithmX)

---

<div align="center">

```
REAL ROAD GRAPH  +  A* / DIJKSTRA  +  PRIORITY QUEUE
+  AMBULANCE ALLOCATION  +  SPECIALIST / BED / MEDICINE CONSTRAINTS
+  SUPABASE REALTIME STATE  +  EXPLAINABLE AI
═══════════════════════════════════════
INTELLIGENT RURAL DISPATCH
```

**🚑 VAHAK 3D COMMAND CENTER**

*Urgency • Algorithms • Real Roads • Resources • Realtime Intelligence*

**DHARNAI RURAL HEALTH NETWORK • JEHANABAD, BIHAR (NH-83)**

</div>
