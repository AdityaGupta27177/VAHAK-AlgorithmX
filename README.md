# VAHAK — Rural Healthcare 3D Dispatch & Routing Command Center

**Intelligent routing. Faster care. Stronger communities.**

VAHAK is a real-time operations platform for rural emergency healthcare logistics. It combines a 3D geospatial command center, A*/Dijkstra routing, priority-based emergency dispatch, hospital and ambulance allocation, medicine inventory tracking, and an AI operations assistant on top of a Supabase/PostgreSQL backend with live realtime updates.

> Built as a hackathon prototype. Deterministic algorithms own every safety-critical decision — routing, hospital eligibility, and resource reservation. AI is layered on top purely for explanation, analysis, and decision support.

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Decision Pipeline](#decision-pipeline)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Routing Engine](#routing-engine)
- [Dispatch Scoring](#dispatch-scoring)
- [AI Operations Layer](#ai-operations-layer)
- [Demo Dataset](#demo-dataset)
- [Scaling Roadmap](#scaling-roadmap)
- [Security](#security)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Why This Exists

Rural healthcare dispatch isn't a nearest-location problem. A patient may need a specific specialist, an available bed, a particular medicine, a compatible ambulance, and a route that stays inside the emergency SLA — all at once.

VAHAK answers one question, correctly, every time:

> **Which ambulance should respond, which hospital should receive the patient, and which route minimizes operational cost while satisfying every clinical and emergency constraint?**

## Decision Pipeline

```
Emergency → Priority Queue → Clinical / Resource Validation
   → Hospital Candidate Filtering → Ambulance Candidate Filtering
   → A* / Dijkstra Routing → Dispatch Score → Resource Reservation
   → Realtime Update → 3D Command Center → AI Explanation
```

## Features

### 3D Command Center
A live digital twin of the operating region — villages, hospitals, pharmacies, junctions, ambulances, active emergencies, roads (including blocked segments), animated routes, hospital capacity, and medicine status, all updating in real time.

### Emergency Prioritization
A binary-heap priority queue orders emergencies by urgency (`CRITICAL` → `HIGH` → `MEDIUM` → `LOW`), then by SLA remaining and wait time within the same tier.

### Intelligent Hospital Allocation
The nearest hospital is never assumed to be the right one. A hospital is only eligible if it has:
- The required specialist available
- A doctor on duty
- An available bed
- The required medicine in stock
- A feasible route within the SLA window
- Operational status

### Ambulance Allocation
Ambulances are scored on status, location, type, medical equipment, ETA, fuel, and current assignment. Supported types: `BLS`, `ALS`, `TRAUMA`, `NEONATAL`, `CRITICAL_CARE`.

### Dynamic Road Closures
Roads can go down from floods, landslides, accidents, construction, or traffic. Active routes are recalculated automatically and pushed to every client through realtime events.

### AI Operations Intelligence
The AI layer provides dispatch and route explanations, hospital comparisons, operational recommendations, risk analysis, system summaries, forecasting, natural-language queries, and simulation planning — but it never touches safety-critical routing or resource reservation directly.

## Tech Stack

**Frontend**
React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Lucide Icons · Three.js · React Three Fiber · Drei · Framer Motion (Motion) · Recharts · Leaflet

**Backend / Data**
Supabase (Auth, Realtime, Edge Functions) · PostgreSQL · Express (dev/prod server) · Vite middleware

**Algorithms**
A* · Dijkstra · Binary heap priority queue · Adjacency-list graph · Route caching · Dynamic graph updates

**AI**
Server-side Gemini integration (`@google/genai`) — API keys never reach the browser.

## Architecture

```
                    ┌──────────────────────────┐
                    │   React 3D Command Center │
                    └────────────┬─────────────┘
                                 │
                    REST + Supabase Realtime
                                 │
                    ┌────────────▼─────────────┐
                    │         Supabase          │
                    │  Auth + PostgreSQL + RT   │
                    └────────────┬─────────────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
┌───────────────┐        ┌──────────────┐        ┌─────────────────┐
│ Dispatch      │        │ Routing      │        │ AI Intelligence │
│ Engine        │        │ Engine       │        │ Layer           │
├───────────────┤        ├──────────────┤        ├─────────────────┤
│ Priority Queue│        │ A* / Dijkstra│        │ LLM API         │
│ Hospital Sel. │        │ Graph Cache  │        │ Explanation     │
│ Ambulance Sel.│        │ Road Closures│        │ Analysis        │
│ Reservation   │        │ Re-routing   │        │ Forecasting     │
└───────┬───────┘        └──────┬───────┘        └────────┬────────┘
        └───────────────────────┼─────────────────────────┘
                                 ▼
                     ┌──────────────────────┐
                     │  Local Simulation     │
                     │  50 Villages          │
                     │  10 Hospitals         │
                     │  50 Ambulances        │
                     └──────────────────────┘
```

## Project Structure

```
src/
├── components/
│   ├── 3d/            # Three.js / R3F scene: villages, hospitals, ambulances, routes
│   ├── dashboard/      # Command center panels and widgets
│   ├── layout/         # Top bar, navigation, shell
│   ├── map/            # Leaflet-based map views
│   └── modals/         # Dialogs and forms
│
├── pages/               # Route-level screens
│   ├── AiAssistantPage.tsx
│   ├── AmbulancesPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── AuthPage.tsx / LoginPage.tsx
│   ├── DoctorsPage.tsx
│   ├── EmergenciesPage.tsx
│   ├── HospitalsPage.tsx
│   ├── LogsPage.tsx
│   ├── MedicinesPage.tsx
│   ├── RoadsPage.tsx
│   ├── SettingsPage.tsx
│   └── SimulationPage.tsx
│
├── services/
│   ├── dispatchEngine.ts          # Core dispatch decisioning
│   ├── graphEngine.ts             # Road network graph
│   ├── routingAlgorithm.ts        # A* / Dijkstra implementation
│   ├── intelligentRoutingEngine.ts
│   ├── priorityQueue.ts           # Binary-heap emergency queue
│   ├── ambulanceService.ts
│   ├── hospitalService.ts
│   ├── doctorService.ts
│   ├── medicineService.ts
│   ├── emergencyService.ts
│   ├── roadService.ts / realRoadData.ts / realRoadRouter.ts
│   ├── routeService.ts
│   ├── analyticsService.ts
│   ├── authService.ts
│   ├── aiService.ts / geminiService.ts
│   ├── SatelliteTileService.ts
│   └── seedDataGenerator.ts       # Demo dataset generation
│
├── store/                # Zustand state stores
├── lib/supabaseClient.ts # Supabase client with local-cache fallback
├── data/mockData.ts      # Local fallback dataset
└── types.ts               # Shared TypeScript types

server.ts    # Express server: Vite middleware (dev) + AI API routes
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or bun — a `bun.lock` is included)

### Install & Run

```bash
git clone https://github.com/AdityaGupta27177/VAHAK-AlgorithmX.git
cd VAHAK-AlgorithmX
npm install
cp .env.example .env
npm run dev
```

The app runs at **http://localhost:3000**.

> **No Supabase or AI key required to run the demo.** Without `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`, the app falls back to a resilient local dataset. Without `GEMINI_API_KEY`, the AI endpoints return realistic canned responses so the UI and demo flow remain fully functional.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Vite + Express) on port 3000 |
| `npm run build` | Build the frontend and bundle the production server |
| `npm run start` | Run the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove build output |

## Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Server-side AI (Gemini)
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"

# Supabase (optional — omit to use the local demo dataset)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your_publishable_or_anon_key"
```

**Security rule:** never place `SUPABASE_SERVICE_ROLE_KEY` or any secret key in frontend code, and never commit real keys to Git. Restart the dev server after changing `.env`.

### Connecting Supabase (optional)

1. Create a Supabase project and open the SQL Editor.
2. Run the project's database schema script to create tables and seed demo rows.
3. Copy the **Project URL** and **anon/publishable key** from *Project Settings → API*.
4. Add them to `.env` as shown above.
5. Enable Realtime on: `emergencies`, `ambulances`, `hospitals`, `medicine_inventory`, `road_edges`, `dispatches`.

## Database Schema

Core Supabase tables:

```
villages, patients, hospitals, hospital_departments, hospital_beds,
doctors, doctor_shifts, ambulances, ambulance_equipment,
medicines, medicine_inventory, emergencies, road_nodes, road_edges,
road_closures, routes, dispatches, dispatch_events, ai_recommendations
```

Relationships:

```
Village → Emergency → Dispatch → { Ambulance, Hospital, Route }
Hospital → { Doctors, Beds, Medicine Inventory }
Road Nodes → Road Edges → A* / Dijkstra
```

## Routing Engine

The road network is a weighted graph.

- **Nodes:** `VILLAGE`, `HOSPITAL`, `PHARMACY`, `JUNCTION`
- **Edges:** `distance_km`, `travel_time_min`, `traffic_multiplier`, `road_condition`, `blocked`, `bidirectional`

**A\*** uses `f(n) = g(n) + h(n)`, where `g(n)` is accumulated travel cost and `h(n)` is a geographic heuristic. Example response:

```json
{
  "route": ["V-01", "J-04", "J-12", "H-05"],
  "distanceKm": 24.8,
  "travelTimeMin": 31.4,
  "visitedNodes": 2184,
  "executionTimeMs": 7.2
}
```

**Dijkstra** is included for comparison and for cases where a heuristic isn't appropriate.

When a road closes mid-route, the pipeline is:

```
Current Route Invalid → A* Recalculation → New Route Found
   → ETA Updated → 3D Path Updated → AI Explanation
```

## Dispatch Scoring

```
Dispatch Score = Ambulance ETA
                + Hospital Travel Time
                + Capacity Penalty
                + Traffic Penalty
                + SLA Risk
```

A hospital is only eligible when **all** of the following hold: specialist available, bed available, medicine available, hospital operational, and route exists. This guarantees the system never routes a patient to a hospital that looks close but can't actually treat them.

## AI Operations Layer

The AI assistant answers operational questions like *"Why was Hospital C selected?"* or *"Simulate 50 critical emergencies"* with structured, grounded responses:

```json
{
  "summary": "Hospital C was selected because it satisfies all clinical and operational constraints.",
  "reasons": ["Cardiologist available", "Bed available", "Required medicine available", "Route feasible within SLA"],
  "risks": ["Traffic may increase ETA"],
  "alternatives": ["Hospital D had a higher projected travel cost"],
  "confidence": 94
}
```

The AI must never invent operational facts (ambulance locations, bed counts, doctor availability, medicine stock, ETAs) — those always come from verified backend data.

**Safety architecture** — the only path AI recommendations can take:

```
User → AI → Recommendation → Backend Validation → Deterministic Engine → Database Mutation
```

AI never mutates the database directly. Emergency priority, hospital/ambulance eligibility, A*/Dijkstra routing, and bed/medicine reservation remain fully deterministic — if the AI provider is unavailable, dispatch keeps operating normally.

## Demo Dataset

| Entity | Count |
|---|---|
| Villages | 50 |
| Hospitals | 10 |
| Ambulances | 50 |
| Doctors | 200 |
| Patients | 100 |
| Medicines | 20 |
| Medicine inventory records | 200 |
| Hospital departments | 70 |
| Hospital beds | 300+ |
| Road nodes | 80 |
| Road edges | 100+ |
| Emergency requests | 20 |

## Scaling Roadmap

| Phase | Villages | Hospitals | Ambulances | Notes |
|---|---|---|---|---|
| 1 — Hackathon Demo | 50 | 10 | 50 | Current state |
| 2 — Expanded Simulation | 500 | 50 | 500 | — |
| 3 — Challenge Benchmark | 5,000+ | — | — | 50,000+ graph nodes, 200,000+ edges, thousands of concurrent emergencies |

For production scale: Redis, background workers, graph partitioning, distributed job queues, geospatial indexing, route caching, connection pooling, observability, and horizontal scaling.

## Security

For production deployment:

- Use Supabase Auth with Row Level Security and role-based access control
- Keep service-role credentials and AI API keys server-side only
- Validate all user input and audit administrative mutations
- Rate-limit AI endpoints and avoid exposing sensitive patient information

**Recommended roles:** `dispatcher`, `doctor`, `hospital_admin`, `database_admin`, `system_admin`

## Testing Checklist

- **Algorithms:** A*, Dijkstra, priority queue, graph construction, route caching
- **Dispatch:** ambulance selection, hospital selection, specialist/bed/medicine validation
- **Resilience:** no available ambulance, no compatible ambulance, no specialist, hospital full, medicine unavailable, no route, all candidate roads blocked, simultaneous emergencies, concurrent resource reservations
- **AI:** structured response validation, provider failure handling, insufficient data handling, invalid recommendation handling

## Troubleshooting

**Supabase connection fails** — verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart the dev server.

**Realtime doesn't update** — confirm the table is enabled for Realtime, the frontend is subscribed to the correct schema/table, RLS allows the operation, and the mutation actually commits.

**A\* can't find a route** — confirm the source and destination nodes exist, the graph is connected, required edges aren't blocked, and node IDs match between Supabase and the routing engine.

**AI is unavailable** — this is expected to be non-fatal. Priority Queue + Hospital Allocation + Ambulance Allocation + A*/Dijkstra keep the system fully operational; AI is an enhancement, not a dependency.

## License

This project is a hackathon and educational prototype. Add your institution, team, competition, or organization-specific license before any public production deployment.

---

**Project Identity:** Rural Healthcare 3D Dispatch & Routing Command Center
**Core technologies:** React · Three.js · Supabase · PostgreSQL · A* · Dijkstra · Priority Queue · Realtime · AI
**Primary objective:** Optimize emergency healthcare routing and resource allocation while providing real-time, explainable operational visibility.
