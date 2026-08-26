Rural Healthcare 3D Dispatch & Routing Command Center

Intelligent Routing. Faster Care. Stronger Communities.

A hackathon-ready, real-time rural healthcare operations platform combining a 3D geospatial command center, A / Dijkstra routing*, priority-based emergency dispatch, ambulance and hospital allocation, medicine inventory management, Supabase/PostgreSQL, Realtime updates, and an AI operations assistant.

Dataset

The current local demo is designed around:

50 villages

10 hospitals

50 ambulances

200 doctors

20 medicines

100 patients

80 road nodes

100+ weighted road edges

20 demo emergencies

The architecture can later scale toward the challenge benchmark of 5,000+ villages, 50,000+ graph nodes, and 200,000+ weighted road edges.

1. What the System Solves

Rural healthcare dispatch is not simply a nearest-location problem. A patient may require a specific specialist, an available hospital bed, a particular medicine, a compatible ambulance, and a route that remains inside the emergency SLA.

The platform therefore answers:

Which ambulance should respond, which hospital should receive the patient, and which route minimizes operational cost while satisfying clinical and emergency constraints?

The core decision pipeline is:

Emergency
   ↓
Priority Queue
   ↓
Clinical / Resource Validation
   ↓
Hospital Candidate Filtering
   ↓
Ambulance Candidate Filtering
   ↓
A* / Dijkstra Routing
   ↓
Dispatch Score
   ↓
Resource Reservation
   ↓
Realtime Update
   ↓
3D Command Center
   ↓
AI Explanation

2. Main Features

3D Command Center

The main dashboard visualizes a live digital twin containing:

villages

hospitals

pharmacies

junctions

ambulances

emergency locations

roads

blocked roads

active routes

hospital capacity

medicine status

Active routes are displayed as animated paths and ambulance state changes are reflected in realtime.

Emergency Prioritization

Emergency requests are handled through a binary-heap priority queue.

Priority order:

CRITICAL
HIGH
MEDIUM
LOW

Within the same urgency, the system can prioritize by SLA remaining and waiting time.

Intelligent Hospital Allocation

The system does not automatically select the closest hospital.

A hospital must satisfy:

required specialist available

doctor on duty

hospital operational

bed available

required medicine available

route available

SLA feasibility

Ambulance Allocation

Ambulances are evaluated using:

status

current location

ambulance type

medical equipment

ETA

fuel

current assignment

Supported types:

BLS
ALS
TRAUMA
NEONATAL
CRITICAL_CARE

Dynamic Road Closures

Road conditions can change because of:

flood

landslide

accident

construction

traffic

When a road is closed, active routes are recalculated and updated through realtime events.

AI Operations Intelligence

AI can provide:

dispatch explanations

route explanations

hospital comparisons

operational recommendations

risk analysis

system summaries

forecasting

natural-language queries

simulation planning

The AI is not the source of truth for safety-critical routing or resource reservation.

3. Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide Icons

Three.js

React Three Fiber

Drei

Framer Motion

Recharts

Backend / Data

Supabase

PostgreSQL

Supabase Realtime

Supabase Auth

Supabase Edge Functions / secure server-side functions

Algorithms

A*

Dijkstra

Binary Heap / Priority Queue

Adjacency-list graph

Route caching

Dynamic graph updates

AI

Use a server-side AI provider integration. Keep AI secrets out of the browser.

4. Architecture

                    ┌──────────────────────────┐
                    │      React / Lovable     │
                    │     3D Command Center    │
                    └────────────┬─────────────┘
                                 │
                    REST + Supabase Realtime
                                 │
                    ┌────────────▼─────────────┐
                    │        Supabase          │
                    │ Auth + PostgreSQL + RT   │
                    └────────────┬─────────────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       │                         │                         │
       ▼                         ▼                         ▼
┌───────────────┐        ┌──────────────┐        ┌─────────────────┐
│ Dispatch      │        │ Routing      │        │ AI Intelligence│
│ Engine        │        │ Engine       │        │ Layer           │
└───────┬───────┘        └──────┬───────┘        └────────┬────────┘
        │                       │                         │
        ▼                       ▼                         ▼
Priority Queue          A* / Dijkstra                LLM API
Hospital Selection      Graph Cache                  Explanation
Ambulance Selection     Road Closures                Analysis
Resource Reservation    Re-routing                   Forecasting
        │                       │                         │
        └───────────────────────┼─────────────────────────┘
                                ▼
                     ┌──────────────────────┐
                     │ Local Simulation     │
                     │ 50 Villages          │
                     │ 10 Hospitals         │
                     │ 50 Ambulances        │
                     └──────────────────────┘

5. Database Schema

Core Supabase tables:

villages
patients
hospitals
hospital_departments
hospital_beds
doctors
doctor_shifts
ambulances
ambulance_equipment
medicines
medicine_inventory
emergencies
road_nodes
road_edges
road_closures
routes
dispatches
dispatch_events
ai_recommendations

Relationship overview:

Village
   ↓
Emergency
   ↓
Dispatch
   ├── Ambulance
   ├── Hospital
   └── Route

Hospital
   ├── Doctors
   ├── Beds
   └── Medicine Inventory

Road Nodes
   ↓
Road Edges
   ↓
A* / Dijkstra

6. Current Demo Dataset

Entity

Count

Villages

50

Hospitals

10

Ambulances

50

Doctors

200

Patients

100

Medicines

20

Medicine inventory records

200

Hospital departments

70

Hospital beds

300+

Road nodes

80

Road edges

100+

Emergency requests

20

7. Supabase Setup

Create the project

Create a Supabase project.

Open SQL Editor.

Run the project database SQL script.

Confirm that the tables and demo rows were created.

Get the API values

Open:

Supabase Dashboard
→ Project Settings
→ API

Copy:

Project URL

Publishable key / anon key, depending on the dashboard version

8. Environment Variables

Create a local .env file for Vite:

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key

For server-side AI:

AI_PROVIDER=openai
AI_API_KEY=your_secret_key
AI_MODEL=your_model
AI_BASE_URL=your_provider_base_url

Security rule

Never place these in frontend code:

SUPABASE_SERVICE_ROLE_KEY=

Never commit secret API keys to Git.

After changing .env, restart the Vite development server.

9. Supabase Realtime

Realtime should cover the operational tables:

emergencies
ambulances
hospitals
medicine_inventory
road_edges
dispatches

Example:

Ambulance A-07
AVAILABLE
     ↓
EN_ROUTE
     ↓
Supabase UPDATE
     ↓
Realtime Event
     ↓
Frontend Store
     ↓
3D Ambulance
     ↓
Updated State

The same pattern applies to emergencies, hospitals, medicines, roads, and dispatches.

10. Local Simulation Engine

The local engine operates the hackathon demo environment with:

50 Villages
10 Hospitals
50 Ambulances
200 Doctors
20 Medicines

It can generate:

emergency requests

ambulance movement

hospital utilization changes

medicine consumption

road closures

dispatch assignments

route recalculations

completed emergencies

Data flow:

Local Simulation
       ↓
Supabase state
       ↓
Realtime event
       ↓
Frontend state
       ↓
3D Command Center

11. Routing Engine

The road network uses a weighted graph.

Nodes

VILLAGE
HOSPITAL
PHARMACY
JUNCTION

Edges

distance_km
travel_time_min
traffic_multiplier
road_condition
blocked
bidirectional

A*

The A* implementation uses:

f(n) = g(n) + h(n)

where:

g(n) = accumulated travel cost

h(n) = geographic heuristic

The router should return:

{
  "route": ["V-01", "J-04", "J-12", "H-05"],
  "distanceKm": 24.8,
  "travelTimeMin": 31.4,
  "visitedNodes": 2184,
  "executionTimeMs": 7.2
}

Dijkstra is included for comparison and cases where a heuristic is not desirable.

12. Dispatch Scoring

A simplified operational score is:

Dispatch Score =
    Ambulance ETA
  + Hospital Travel Time
  + Capacity Penalty
  + Traffic Penalty
  + SLA Risk

A hospital is eligible only when:

Specialist available
AND
Bed available
AND
Medicine available
AND
Hospital operational
AND
Route exists

This prevents the system from selecting a nearby hospital that cannot actually treat the patient.

13. Main Demo Scenario

Request

Village A generates an urgent cardiac emergency.

Required:

Specialist: Cardiology
Medicine: Cardiac medicine
Urgency: CRITICAL
SLA: 20 minutes

Hospital B

Distance: ~10 km
Cardiologist: UNAVAILABLE

Result:

HOSPITAL B REJECTED

Hospital C

Distance: ~25 km
Cardiologist: AVAILABLE
Bed: AVAILABLE
Medicine: AVAILABLE

Result:

HOSPITAL C SELECTED

The system then:

prioritizes the emergency

finds compatible ambulances

selects the lowest-cost feasible ambulance

calculates an A* route

reserves resources

dispatches the ambulance

animates the route in 3D

updates state through Supabase Realtime

14. Dynamic Road Closure

During the demo, close an active route.

Example:

ROAD R-102 BLOCKED

The expected sequence is:

Current Route Invalid
       ↓
A* Recalculation
       ↓
New Route Found
       ↓
ETA Updated
       ↓
3D Path Updated
       ↓
AI Explanation

The dashboard should show both the original and recalculated decision state.

15. AI Operations Layer

AI is an operational assistant, not the safety-critical decision engine.

Useful questions:

Why was Hospital C selected?

Why was Hospital B rejected?

Which ambulance should respond next?

What happens if Road R-102 closes?

Which hospitals are nearing capacity?

Which medicines are at risk?

Summarize today's emergency performance.

Simulate 50 critical emergencies.

Example structured response:

{
  "summary": "Hospital C was selected because it satisfies all clinical and operational constraints.",
  "reasons": [
    "Cardiologist available",
    "Bed available",
    "Required medicine available",
    "Route feasible within SLA"
  ],
  "risks": [
    "Traffic may increase ETA"
  ],
  "alternatives": [
    "Hospital D had a higher projected travel cost"
  ],
  "confidence": 94
}

AI must never invent operational facts such as:

ambulance locations

hospital capacity

doctor availability

medicine stock

route distance

ETA

Use verified backend data as the source of truth.

16. AI Safety Architecture

Correct pattern:

User
 ↓
AI
 ↓
Recommendation
 ↓
Backend Validation
 ↓
Deterministic Engine
 ↓
Database Mutation

Do not allow:

User
 ↓
AI
 ↓
Direct Database Mutation

The following remain deterministic:

emergency priority

hospital eligibility

ambulance eligibility

A* routing

Dijkstra routing

bed reservation

medicine reservation

ambulance reservation

17. Table Editor / SQL Editor

A Supabase-style database operations area can be included in the application.

Table Editor

Support:

table browsing

row search

filtering

sorting

row insertion

row editing

row deletion

pagination

JSON inspection

CSV export

SQL Editor

Support:

SQL syntax highlighting

SELECT execution

INSERT / UPDATE / DELETE

query results

execution time

row count

query history

saved queries

error messages

Raw SQL execution should be restricted to authorized database administrators in a production environment.

18. Recommended Project Structure

src/
├── components/
│   ├── dashboard/
│   ├── emergency/
│   ├── ambulance/
│   ├── hospital/
│   ├── database/
│   ├── ai/
│   └── shared/
│
├── components/3d/
│   ├── HealthcareWorld.tsx
│   ├── VillageNode.tsx
│   ├── HospitalNode.tsx
│   ├── Ambulance3D.tsx
│   ├── RoutePath.tsx
│   └── CameraController.tsx
│
├── pages/
├── services/
│   ├── supabase.ts
│   ├── emergencyService.ts
│   ├── ambulanceService.ts
│   ├── hospitalService.ts
│   ├── routingService.ts
│   ├── medicineService.ts
│   └── aiService.ts
│
├── algorithms/
│   ├── AStar.ts
│   ├── Dijkstra.ts
│   ├── PriorityQueue.ts
│   └── Graph.ts
│
├── store/
├── types/
└── utils/

19. Performance Strategy

The hackathon demo uses a compact dataset, but the architecture should support the larger benchmark.

Target scale:

5,000+ villages
50,000+ graph nodes
200,000+ graph edges
Thousands of emergency requests

Recommended strategies:

adjacency lists

binary heap priority queues

graph indexing

route caching

incremental route invalidation

typed / compact graph storage when scale requires it

worker-based heavy simulations

database indexes

pagination / virtualization in table views

Do not repeatedly scan the entire graph or all hospitals when indexed candidate filtering can be used.

20. Security

For production deployment:

use Supabase Auth

enable Row Level Security

use role-based access control

keep service-role credentials server-side

keep AI API keys server-side

validate user input

audit administrative mutations

rate-limit AI endpoints

avoid exposing sensitive patient information

Recommended roles:

dispatcher
doctor
hospital_admin
database_admin
system_admin

21. Testing

Test the following before final presentation:

Algorithms

A*

Dijkstra

priority queue

graph construction

route caching

Dispatch

ambulance selection

hospital selection

specialist validation

bed validation

medicine validation

Resilience

no available ambulance

no compatible ambulance

no specialist

hospital full

medicine unavailable

no route

all candidate roads blocked

simultaneous emergencies

concurrent resource reservations

AI

structured response validation

AI provider failure

insufficient operational data

invalid recommendation

22. Judge Demo Flow

A recommended three-minute presentation:

00:00–00:20

Open the 3D Command Center.

Show:

50 Villages
10 Hospitals
50 Ambulances

00:20–00:45

Create:

CRITICAL CARDIAC EMERGENCY

00:45–01:15

Show hospital evaluation:

Hospital B
REJECTED
No Cardiologist

Then:

Hospital C
SELECTED

01:15–01:40

Show A* telemetry:

A* ROUTING
Distance
ETA
Nodes Visited
Execution Time

Animate the ambulance.

01:40–02:00

Close the active road.

Show dynamic route recalculation.

02:00–02:25

Ask the AI:

Why was Hospital C selected?

Show the structured explanation.

02:25–03:00

Show final results:

EMERGENCY RESOLVED

Response Time
SLA Compliance
Route Recalculations
A* Performance
AI Confidence

23. Useful SQL Queries

All ambulances

SELECT
    id,
    vehicle_number,
    type,
    status,
    driver_name,
    fuel_percentage
FROM public.ambulances
ORDER BY id;

Critical emergencies

SELECT
    id,
    urgency,
    condition,
    required_specialist,
    status,
    created_at
FROM public.emergencies
WHERE urgency = 'CRITICAL'
ORDER BY created_at DESC;

Hospitals near capacity

SELECT
    name,
    total_beds,
    occupied_beds,
    ROUND(
        occupied_beds::NUMERIC
        / NULLIF(total_beds, 0) * 100,
        1
    ) AS occupancy_percent
FROM public.hospitals
ORDER BY occupancy_percent DESC;

Low medicine stock

SELECT
    m.name AS medicine,
    h.name AS hospital,
    mi.quantity,
    mi.reorder_level
FROM public.medicine_inventory mi
JOIN public.medicines m
    ON m.id = mi.medicine_id
JOIN public.hospitals h
    ON h.id = mi.hospital_id
WHERE mi.quantity <= mi.reorder_level
ORDER BY mi.quantity ASC;

Blocked roads

SELECT
    re.id,
    re.distance_km,
    re.travel_time_min,
    re.road_condition
FROM public.road_edges re
WHERE re.blocked = TRUE
ORDER BY re.id;

24. Development Workflow

1. Create Supabase project
2. Run database SQL
3. Add environment variables
4. Connect Supabase client
5. Verify database tables
6. Seed demo data
7. Enable Realtime
8. Start local simulation
9. Connect dashboard
10. Connect A* routing
11. Connect AI API
12. Run judge demo

25. Troubleshooting

Supabase connection fails

Verify:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Restart the development server after changing .env.

Realtime does not update

Check:

the table is enabled for Realtime

the frontend is subscribed to the correct schema/table

authentication/RLS allows the operation

the database mutation commits successfully

A* cannot find a route

Check:

source node exists

destination node exists

the graph is connected

required edges are not blocked

node IDs match between Supabase and the routing engine

AI is unavailable

The basic system must continue operating with:

Priority Queue
+
Hospital Allocation
+
Ambulance Allocation
+
A* / Dijkstra

AI is an enhancement, not a hard dependency for emergency routing.

26. Scaling Roadmap

Phase 1 — Hackathon Demo

50 villages
10 hospitals
50 ambulances

Phase 2 — Expanded Simulation

500 villages
50 hospitals
500 ambulances

Phase 3 — Challenge Benchmark

5,000+ villages
50,000+ graph nodes
200,000+ graph edges
Thousands of concurrent emergencies

For production-scale deployments, consider:

Redis

background workers

graph partitioning

distributed job queues

geospatial indexing

route caching

connection pooling

observability

horizontal scaling

27. Final Checklist

Before the hackathon presentation:

Supabase connected

50 villages loaded

10 hospitals loaded

50 ambulances loaded

200 doctors loaded

medicine inventory populated

road network loaded

Realtime working

emergency creation working

priority queue working

hospital allocation working

ambulance allocation working

A* working

Dijkstra working

road closure working

dynamic rerouting working

3D route animation working

AI explanation working

SQL Editor working

Table Editor working

analytics working

judge demo working

28. Engineering Principle

The core architecture intentionally separates deterministic operational logic from AI intelligence.

GRAPH ALGORITHMS
        +
PRIORITY QUEUES
        +
RESOURCE ALLOCATION
        +
REAL-TIME DATA
        +
3D VISUALIZATION
        +
AI OPERATIONS INTELLIGENCE

Use deterministic algorithms for operational truth and AI for intelligence, explanation, analysis, and decision support.

29. License

This project is intended as a hackathon and educational prototype.

Add your institution, team, competition, or organization-specific license before public production deployment.

Project Identity

Rural Healthcare 3D Dispatch & Routing Command Center

Core technologies: React • Three.js • Supabase • PostgreSQL • A* • Dijkstra • Priority Queue • Realtime • AI

Primary objective: Optimize emergency healthcare routing and resource allocation while providing real-time, explainable operational visibility.
