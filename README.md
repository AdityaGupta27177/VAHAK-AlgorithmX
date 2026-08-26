🚑 VAHAK AlgorithmX

<div align="center">

VAHAK 3D Command Center

Intelligent Rural Healthcare Dispatch, Routing & Resource Optimization

A real-time algorithmic healthcare logistics platform for emergency routing, ambulance dispatch, hospital allocation, and medicine-aware decision making.







</div>

1. Project Overview

The Problem

Rural healthcare networks operate with limited ambulances, specialists, hospital beds, medicines, and reliable transportation infrastructure.

During simultaneous emergencies, the nearest hospital is not always the correct destination.

For example:

Village A
   │
   │ Critical Cardiology Emergency
   ▼
Hospital B ── 10 km ── ❌ Cardiologist unavailable

Hospital C ── 25 km ── ✅ Cardiologist available
                         ✅ Bed available
                         ✅ Medicine available

VAHAK AlgorithmX evaluates the complete operational state before dispatching an ambulance.

The system considers:

Emergency urgency

Patient wait time

Specialist availability

Hospital capacity

Medicine inventory

Ambulance availability

Actual road connectivity

Dynamic road closures

Travel time

SLA constraints

Primary objective

Minimize:

Travel Time
+
Patient Wait Time
+
Resource / Constraint Penalty

while preserving emergency priority and medical eligibility.

2. Project Context

Demo Network

DHARNAI RURAL HEALTH NETWORK • JEHANABAD, BIHAR (NH-83)

The current prototype uses this location as the geographic context for the simulation.

The demo network is designed around:

50 Rural Villages
10 Hospitals
50 Ambulances

The architecture is designed toward the larger challenge benchmark of:

50,000+ Graph Nodes
200,000+ Weighted Road Edges
5,000+ Villages / Health Points
Thousands of Concurrent Emergency Requests
Dynamic Road Closures
Strict Urgency and SLA Constraints

3. Key Features

🗺️ Real Road-Based Routing

VAHAK does not intentionally draw optimistic straight-line routes across farms, fields, buildings, rivers, or inaccessible terrain.

Routes are calculated over a connected road network.

Emergency Location
       ↓
Nearest Valid Road
       ↓
Road Segment
       ↓
Junction
       ↓
Road Segment
       ↓
Bridge / Connected Road
       ↓
Hospital

The route shown to the operator should correspond to the actual available road path.

If no valid connected road route exists:

NO VALID ROAD ROUTE AVAILABLE

The system must not invent a straight-line fallback.

⭐ A* Routing

A* is the primary shortest-path algorithm.

f(n) = g(n) + h(n)

Where:

g(n) = accumulated travel cost

h(n) = geographic heuristic

f(n) = estimated total route cost

A* operates on a road graph represented using adjacency lists.

🔎 Dijkstra

Dijkstra operates on the same road graph and is used for:

shortest-path comparison

deterministic routing

algorithm benchmarking

validating A* results

Blocked road edges are excluded from traversal.

⚡ Priority Queue

Emergency requests are managed through a priority queue.

Priority order:

CRITICAL
   ↓
HIGH
   ↓
MEDIUM
   ↓
LOW

For requests with equal urgency, the system can consider:

SLA remaining

Deadline

Waiting time

Target queue complexity:

Push → O(log n)
Pop  → O(log n)
Peek → O(1)

🚑 Ambulance Allocation

The dispatch engine evaluates available ambulances based on:

Current location

Road travel time

ETA

Availability

Vehicle type

Required equipment

Current workload

A representative dispatch score is:

Ambulance Cost =
ETA to Patient
+
ETA to Hospital
+
Availability Penalty

Emergency urgency remains the highest-level constraint.

🏥 Hospital Selection

Hospitals are filtered before route optimization.

Possible eligibility conditions:

Required Specialist Available
        +
Specialist On Duty
        +
Bed Available
        +
Required Medicine Available
        +
Hospital Operational
        +
Valid Road Route
        +
SLA Feasible

This prevents the system from selecting a nearby but medically unsuitable facility.

💊 Medicine & 🛏️ Bed Allocation

A successful dispatch can reserve:

Ambulance
+
Hospital Bed
+
Required Medicine

Resource reservation should be transaction-safe so that simultaneous emergency requests cannot reserve the same unavailable resource.

🚧 Dynamic Road Closures

When a road becomes blocked:

ROAD OPEN
   ↓
ROAD BLOCKED
   ↓
Affected Route Invalidated
   ↓
Road Graph Updated
   ↓
A* Recalculation
   ↓
Alternative Valid Route
   ↓
ETA Updated
   ↓
Ambulance Route Updated

This allows the command center to react to changing road conditions.

4. System Architecture

                         ┌─────────────────────┐
                         │    EXISTING UI      │
                         │ React / Vite / 3D   │
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
          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
          │  Priority   │   │ Eligibility │   │  Resource   │
          │    Queue    │   │   Engine    │   │ Allocation  │
          └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │   ROUTING ENGINE    │
                         │     A* / Dijkstra   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   REAL ROAD GRAPH   │
                         │ Nodes + Road Edges  │
                         │ Traffic + Closures  │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
          │ Google Maps │   │  Supabase   │   │  Realtime   │
          │ / Geometry  │   │ PostgreSQL  │   │   Events    │
          └─────────────┘   └─────────────┘   └─────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  CANONICAL ROUTE    │
                         │ Map + 3D + Dispatch │
                         └─────────────────────┘

5. Technology Stack

Layer

Technology

Purpose

Frontend

React

Interactive command-center interface

Build Tool

Vite

Fast development and production builds

Styling

Existing project UI system

Command-center visual interface

Database

Supabase PostgreSQL

Persistent operational data

Realtime

Supabase Realtime

Live emergency, ambulance and resource updates

Maps

Google Maps Platform

Geographic visualization and road-aware mapping

Routing

A*

Primary graph shortest-path algorithm

Routing

Dijkstra

Shortest-path comparison and benchmarking

Data Structure

Priority Queue / Binary Heap

Emergency scheduling

AI Layer

AI API / configured provider

Decision explanation and operational intelligence

Language

Project source language / TypeScript where configured

Application and algorithm implementation

6. Algorithm and Approach

Emergency Dispatch Pipeline

1. Receive Emergency
        ↓
2. Assign Urgency
        ↓
3. Insert into Priority Queue
        ↓
4. Find Eligible Hospitals
        ↓
5. Filter by Specialist / Bed / Medicine
        ↓
6. Find Compatible Ambulances
        ↓
7. Build / Query Road Graph
        ↓
8. Run A* / Dijkstra
        ↓
9. Compare Feasible Dispatch Options
        ↓
10. Reserve Resources
        ↓
11. Dispatch Ambulance
        ↓
12. Stream State Updates
        ↓
13. Reroute if Road Conditions Change

Road Graph

The graph uses an adjacency-list representation.

Node

nodeId
latitude
longitude
nodeType

Edge

edgeId
fromNode
toNode
distance
travelTime
traffic
roadCondition
blocked
geometry

This prevents the routing engine from treating geographic distance as if it were a drivable road.

A* Heuristic

For geographically distributed nodes, the heuristic estimates remaining travel cost between the current node and destination.

The heuristic must remain consistent with the selected edge cost model.

For a time-based route:

g(n) = accumulated travel time
h(n) = estimated remaining travel time

For a distance-based route:

g(n) = accumulated distance
h(n) = estimated remaining distance

7. Testing & Test Cases

The project must validate both normal and failure scenarios.

Test Case 01 — Specialist Unavailable

Input:
Nearest hospital has no required specialist.

Expected:
Hospital rejected.
Next medically eligible hospital evaluated.

Test Case 02 — Hospital Bed Full

Input:
Hospital has the required specialist but no available bed.

Expected:
Hospital rejected.
Another eligible facility evaluated.

Test Case 03 — Medicine Depleted

Input:
Required medicine inventory is zero.

Expected:
Hospital rejected or medicine replenishment workflow triggered,
depending on the configured business rule.

Test Case 04 — All Ambulances Occupied

Input:
No compatible ambulance is currently available.

Expected:
Emergency remains queued with high priority.
System monitors fleet state.
Dispatch occurs when a compatible ambulance becomes available.

Test Case 05 — Road Closure

Input:
Active route contains a newly blocked road edge.

Expected:
Current route invalidated.
A* recalculates.
Alternative connected road route selected.

Test Case 06 — No Valid Route

Input:
No connected road path exists between source and destination.

Expected:
NO VALID ROAD ROUTE AVAILABLE

No straight-line route should be generated.

Test Case 07 — Simultaneous Critical Emergencies

Input:
Multiple CRITICAL requests arrive together.

Expected:
Priority queue processes them according to urgency and
secondary SLA/deadline/wait-time rules.
Resource reservations remain consistent.

Test Case 08 — A* vs Dijkstra

Input:
Same source, destination and road graph.

Expected:
Both algorithms return a valid shortest path under
the same edge-cost model.

Benchmark:
Execution time
Visited nodes
Path cost
Path length

8. Database Architecture

Supabase PostgreSQL stores operational entities such as:

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
audit_logs

Important indexed fields should include:

emergencies.status
emergencies.urgency
emergencies.village_id

ambulances.status

hospitals.status

doctors.specialization

medicine_inventory.hospital_id

road_edges.from_node
road_edges.to_node
road_edges.blocked

dispatches.emergency_id
dispatches.ambulance_id

9. Supabase Configuration

Create a local .env file:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

Security

Do not commit .env.

Do not expose:

SUPABASE_SERVICE_ROLE_KEY

in client-side code.

Use Supabase Row Level Security for protected database operations.

10. Realtime Architecture

Supabase Realtime can synchronize:

Emergencies
Ambulances
Hospitals
Medicine Inventory
Road Closures
Dispatches
Routes

Ambulance State

AVAILABLE
   ↓
ASSIGNED
   ↓
EN_ROUTE
   ↓
ARRIVED
   ↓
TRANSPORTING
   ↓
AVAILABLE

Emergency State

QUEUED
   ↓
DISPATCHING
   ↓
DISPATCHED
   ↓
EN_ROUTE
   ↓
ARRIVED
   ↓
COMPLETED

11. AI Integration

The AI layer is designed as an assistance and explanation layer.

AI responsibilities

Explain why a hospital was selected

Explain why a hospital was rejected

Summarize route decisions

Identify operational risks

Generate human-readable dispatch reasoning

Summarize simulation outcomes

Deterministic responsibilities

The AI must not be the source of truth for:

A* path calculation

Dijkstra calculation

Emergency priority

Specialist eligibility

Bed availability

Medicine availability

Ambulance availability

Transactional resource reservation

If the AI service is unavailable, the core routing and dispatch engine must continue operating.

12. Third-Party APIs & AI Tools

Tool / API

One-line Purpose

Google Maps Platform

Provides geographic mapping, road-aware visualization and route geometry used by the command center.

Supabase

Provides PostgreSQL database storage, authentication/backend services and realtime synchronization.

Configured AI API

Provides decision explanations, operational summaries and AI-assisted interpretation of deterministic dispatch results.

Keep API keys in environment variables and configure provider-specific restrictions before deployment.

13. Setup / Run Instructions

Clone Repository

git clone https://github.com/AdityaGupta27177/VAHAK-AlgorithmX.git
cd VAHAK-AlgorithmX

Install Dependencies

npm install

Configure Environment

Create:

.env

Example:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_MAPS_API_KEY=

Start Development Server

npm run dev

Production Build

npm run build

Preview Production Build

npm run preview

14. Suggested Project Structure

VAHAK-AlgorithmX/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── algorithms/
│   │   ├── astar/
│   │   ├── dijkstra/
│   │   └── priorityQueue/
│   ├── routing/
│   ├── dispatch/
│   └── types/
│
├── supabase/
│   ├── migrations/
│   └── seed/
│
├── public/
│
├── .env.example
├── package.json
├── vite.config.*
└── README.md

15. Demo Workflow

Critical Cardiology Request

Village A
   ↓
CRITICAL
   ↓
Cardiology Required
   ↓
Hospital B
10 km
❌ Specialist unavailable
   ↓
Hospital C
25 km
✅ Specialist available
✅ Bed available
✅ Medicine available
   ↓
Find Available Ambulances
   ↓
Calculate Real Road ETA
   ↓
A*
   ↓
Reserve Resources
   ↓
Dispatch

If a road closure occurs:

ACTIVE ROUTE
    ↓
ROAD CLOSED
    ↓
A* RE-ROUTING
    ↓
NEW ROAD PATH
    ↓
UPDATED ETA
    ↓
AMBULANCE CONTINUES

16. Performance Considerations

The architecture targets efficient operation through:

Adjacency-list graph representation

Binary-heap priority queues

Indexed database queries

Candidate hospital filtering

Route caching where safe

Graph versioning

Incremental route recalculation

Realtime state updates

Separation of deterministic algorithms from AI services

Complexity targets

Priority Queue Insert  → O(log n)
Priority Queue Remove  → O(log n)
Priority Queue Peek    → O(1)

A* and Dijkstra complexity depends on graph representation and priority-queue implementation.

17. Hackathon Edge Cases

The system addresses the challenge's critical edge cases:

Edge Case

Expected Behavior

No direct road route

Search alternate connected road path

Specialist unavailable

Reject medically unsuitable hospital

Ambulances occupied

Keep emergency prioritized until compatible resource becomes available

Hospital bed full

Reject or defer facility

Medicine depleted

Reject/defer facility or trigger configured inventory workflow

Road blocked

Invalidate route and recalculate

Multiple critical emergencies

Priority queue + resource-safe allocation

No valid route

Explicitly report no route rather than drawing an imaginary path

18. Submission Checklist

Based on the required submission protocol:

GitHub Repository

Repository name follows the Team Name requirement

Continue using the project's original repository

Add required collaborators:

Twentrix

AyushRBuilds

InvictusMF

Complete source code is pushed

Repository is accessible to judges

README Requirements

Project overview

Technologies used

Setup / run instructions

Algorithm / approach

Testing / test cases

Third-party APIs with one-line purpose

AI tools with one-line purpose

Verify deployed project link before final submission

Final Verification

README is properly formatted

Algorithm / approach is documented

Testing / test cases are included

Third-party APIs are documented

AI tools are documented

Deployed project link works

Repository link is correct and accessible

All required collaborators are added

Complete source code is pushed

19. Repository

VAHAK AlgorithmX

https://github.com/AdityaGupta27177/VAHAK-AlgorithmX

20. Team / Submission Information

Project

VAHAK AlgorithmX

Platform

VAHAK 3D Command Center

Demo Network

Dharnai Rural Health Network • Jehanabad, Bihar (NH-83)

Core Technologies

React
Vite
Supabase
PostgreSQL
Google Maps Platform
A*
Dijkstra
Priority Queue
AI API
Realtime Data
3D Visualization

Required Collaborators

Twentrix
AyushRBuilds
InvictusMF

<div align="center">

🚑 VAHAK 3D COMMAND CENTER

Intelligent Rural Healthcare Dispatch & Routing

Urgency • Algorithms • Real Roads • Resources • Realtime Intelligence

DHARNAI RURAL HEALTH NETWORK • JEHANABAD, BIHAR (NH-83)

</div>
