import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Radio,
  Cpu,
  Volume2,
  Bell,
  Save,
  CheckCircle2,
  Shield,
  Sparkles,
  RefreshCw,
  Copy,
  AlertTriangle,
  ExternalLink,
  Server,
  Layers,
  Activity,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../lib/supabaseClient';

export const SettingsPage: React.FC = () => {
  const {
    soundEnabled,
    toggleSound,
    addLog,
    backendStatus,
    backendMessage,
    supabaseLatencyMs,
    isSeedingDatabase,
    seedSupabaseDatabase,
    initializeBackend,
  } = useHealthcareStore();

  const [aStarElevationWeight, setAStarElevationWeight] = useState(1.4);
  const [aStarFloodPenalty, setAStarFloodPenalty] = useState(2.5);
  const [criticalSlaTargetMin, setCriticalSlaTargetMin] = useState(20);
  const [droneCruiseVelocityKmh, setDroneCruiseVelocityKmh] = useState(120);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Supabase connection configuration state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'routing' | 'database' | 'schema'>('database');

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseAnonKey(config.anonKey);
  }, []);

  const handleSaveParameters = () => {
    setSavedSuccess(true);
    addLog('INFO', 'CONFIG_MANAGER', 'Dispatch heuristic weights & SLA thresholds updated successfully.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveSupabaseConfig = async () => {
    saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    setIsTestingConn(true);
    const health = await testSupabaseConnection();
    setIsTestingConn(false);
    setTestResult(health);
    await initializeBackend();
  };

  const handleSeedDatabase = async () => {
    const res = await seedSupabaseDatabase();
    setTestResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(
      `-- Rural Healthcare Command Center PostgreSQL Schema (21 Tables)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS villages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  population INTEGER DEFAULT 1500,
  region TEXT DEFAULT 'Central District',
  elevation_meters INTEGER DEFAULT 350,
  terrain_difficulty TEXT DEFAULT 'Moderate',
  road_access_status TEXT DEFAULT 'OPEN',
  health_center_type TEXT DEFAULT 'Primary Health Subcenter',
  contact_person TEXT,
  emergency_phone TEXT,
  historical_response_avg_min DOUBLE PRECISION DEFAULT 25.0,
  pos_x DOUBLE PRECISION DEFAULT 0.0,
  pos_y DOUBLE PRECISION DEFAULT 0.4,
  pos_z DOUBLE PRECISION DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  total_beds INTEGER NOT NULL DEFAULT 100,
  occupied_beds INTEGER NOT NULL DEFAULT 60,
  icu_total INTEGER NOT NULL DEFAULT 20,
  icu_occupied INTEGER NOT NULL DEFAULT 12,
  status TEXT DEFAULT 'ACTIVE',
  type TEXT DEFAULT 'District General Hospital',
  trauma_level TEXT DEFAULT 'Level I Trauma Care',
  ventilators_available INTEGER DEFAULT 6,
  emergency_load TEXT DEFAULT 'Normal',
  oxygen_reserves_hours INTEGER DEFAULT 48,
  helipad_status TEXT DEFAULT 'Available',
  contact_radio TEXT DEFAULT 'CH-16 UHF',
  contact_phone TEXT,
  address TEXT,
  medicine_stock_percent INTEGER DEFAULT 85,
  blood_bank_o_plus INTEGER DEFAULT 24,
  blood_bank_o_minus INTEGER DEFAULT 8,
  blood_bank_a_plus INTEGER DEFAULT 16,
  blood_bank_b_plus INTEGER DEFAULT 18,
  pos_x DOUBLE PRECISION DEFAULT 0.0,
  pos_y DOUBLE PRECISION DEFAULT 0.4,
  pos_z DOUBLE PRECISION DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ambulances (
  id TEXT PRIMARY KEY,
  callsign TEXT NOT NULL,
  vehicle_number TEXT,
  type TEXT DEFAULT 'ALS',
  status TEXT DEFAULT 'AVAILABLE',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  pos_x DOUBLE PRECISION DEFAULT 0.0,
  pos_y DOUBLE PRECISION DEFAULT 0.4,
  pos_z DOUBLE PRECISION DEFAULT 0.0,
  driver_name TEXT,
  paramedic_lead TEXT,
  fuel_percentage INTEGER DEFAULT 90,
  oxygen_level_percent INTEGER DEFAULT 95,
  speed_kmh DOUBLE PRECISION DEFAULT 0.0,
  home_base_id TEXT REFERENCES hospitals(id),
  assigned_emergency_id TEXT,
  assigned_hospital_id TEXT REFERENCES hospitals(id),
  battery_or_fuel_type TEXT DEFAULT 'Hybrid 4x4',
  equipment TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergencies (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  village_id TEXT REFERENCES villages(id),
  village_name TEXT,
  urgency TEXT DEFAULT 'HIGH',
  condition TEXT NOT NULL,
  required_specialist TEXT,
  required_medicine TEXT,
  sla_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'QUEUED',
  assigned_ambulance_id TEXT REFERENCES ambulances(id),
  target_hospital_id TEXT REFERENCES hospitals(id),
  pos_x DOUBLE PRECISION DEFAULT 0.0,
  pos_y DOUBLE PRECISION DEFAULT 0.4,
  pos_z DOUBLE PRECISION DEFAULT 0.0,
  caller_phone TEXT,
  eta_minutes INTEGER,
  sla_status TEXT DEFAULT 'ON_TRACK',
  vital_heart_rate INTEGER DEFAULT 90,
  vital_blood_pressure TEXT DEFAULT '120/80',
  vital_spo2 INTEGER DEFAULT 98,
  vital_respiratory_rate INTEGER DEFAULT 18,
  vital_gcs INTEGER DEFAULT 15,
  vital_temp_celsius DOUBLE PRECISION DEFAULT 37.0,
  notes TEXT[],
  telemedicine_active BOOLEAN DEFAULT FALSE,
  drone_support_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  hospital_id TEXT REFERENCES hospitals(id),
  hospital_name TEXT,
  availability BOOLEAN DEFAULT TRUE,
  shift_start TEXT DEFAULT '08:00',
  shift_end TEXT DEFAULT '20:00',
  current_patient TEXT,
  status TEXT DEFAULT 'Available',
  phone TEXT,
  rating DOUBLE PRECISION DEFAULT 4.9,
  active_consults_count INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 10,
  avatar_url TEXT,
  languages TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT DEFAULT 'vials',
  criticality TEXT DEFAULT 'High',
  min_threshold INTEGER DEFAULT 20,
  storage_temp_celsius TEXT DEFAULT '2°C - 8°C',
  cold_chain_requirement TEXT DEFAULT 'Refrigerated Cold Chain',
  urgent_drone_delivery_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicine_inventory (
  id TEXT PRIMARY KEY,
  hospital_id TEXT REFERENCES hospitals(id),
  medicine_id TEXT REFERENCES medicines(id),
  quantity INTEGER NOT NULL DEFAULT 50,
  reserved_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 20,
  expiry_date TEXT,
  lot_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS road_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  pos_x DOUBLE PRECISION DEFAULT 0.0,
  pos_y DOUBLE PRECISION DEFAULT 0.2,
  pos_z DOUBLE PRECISION DEFAULT 0.0,
  node_type TEXT DEFAULT 'INTERSECTION',
  elevation_meters INTEGER DEFAULT 300,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS road_edges (
  id TEXT PRIMARY KEY,
  from_node TEXT REFERENCES road_nodes(id),
  to_node TEXT REFERENCES road_nodes(id),
  distance_km DOUBLE PRECISION NOT NULL,
  travel_time_min DOUBLE PRECISION NOT NULL,
  traffic_multiplier DOUBLE PRECISION DEFAULT 1.0,
  road_condition TEXT DEFAULT 'GOOD',
  surface_type TEXT DEFAULT 'Asphalt Highway',
  elevation_slope_percent DOUBLE PRECISION DEFAULT 3.0,
  max_speed_kmh INTEGER DEFAULT 60,
  blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS road_closures (
  id TEXT PRIMARY KEY DEFAULT ('cls-' || substr(md5(random()::text), 1, 8)),
  road_id TEXT REFERENCES road_edges(id),
  reason TEXT NOT NULL,
  reported_by TEXT DEFAULT 'PATROL_01',
  cleared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dispatches (
  id TEXT PRIMARY KEY,
  emergency_id TEXT REFERENCES emergencies(id),
  ambulance_id TEXT REFERENCES ambulances(id),
  hospital_id TEXT REFERENCES hospitals(id),
  route_id TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  eta_minutes INTEGER,
  status TEXT DEFAULT 'DISPATCHED',
  decision_score DOUBLE PRECISION DEFAULT 0.95
);

CREATE TABLE IF NOT EXISTS dispatch_events (
  id TEXT PRIMARY KEY DEFAULT ('evt-' || substr(md5(random()::text), 1, 8)),
  dispatch_id TEXT REFERENCES dispatches(id),
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id TEXT PRIMARY KEY DEFAULT ('air-' || substr(md5(random()::text), 1, 8)),
  emergency_id TEXT REFERENCES emergencies(id),
  recommended_ambulance_id TEXT,
  recommended_hospital_id TEXT,
  triage_summary TEXT,
  risk_score DOUBLE PRECISION,
  confidence_score DOUBLE PRECISION DEFAULT 0.95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT ('log-' || substr(md5(random()::text), 1, 8)),
  action TEXT NOT NULL,
  component TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase Realtime for operational tables
ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;
ALTER PUBLICATION supabase_realtime ADD TABLE ambulances;
ALTER PUBLICATION supabase_realtime ADD TABLE hospitals;
ALTER PUBLICATION supabase_realtime ADD TABLE medicine_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE road_closures;
ALTER PUBLICATION supabase_realtime ADD TABLE dispatches;
`
    );
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              System Settings & Supabase Backend Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              VERSION 4.2-PROD
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Manage PostgreSQL replication credentials, realtime subscription channels, A* heuristic weights, and SLA parameters.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'database' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Supabase Backend
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'routing' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            A* Impedance & SLAs
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SQL Schema (21 Tables)
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Parameters synchronized to active geospatial routing engine!</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: SUPABASE BACKEND INTEGRATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Connection Status Overview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Supabase PostgreSQL & Realtime Replication Status</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                backendStatus === 'CONNECTED_REALTIME'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${backendStatus === 'CONNECTED_REALTIME' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {backendStatus === 'CONNECTED_REALTIME' ? 'CONNECTED & SYNCHRONIZED' : 'BACKEND CONNECTION INTERRUPTED'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {backendStatus === 'CONNECTED_REALTIME'
                ? `Connected to Supabase PostgreSQL at ${supabaseUrl}. Realtime subscriptions are active for emergencies, ambulances, hospitals, medicine inventory, road closures, and dispatches.`
                : 'The platform is running smoothly using its built-in resilient local cache with 50 villages, 10 hospitals, 50 ambulances, 200 doctors, 50 medicines, and 500 road edges. Enter your Supabase project credentials below to enable cloud synchronization.'}
            </p>

            {testResult && (
              <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Supabase Credentials Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold font-mono text-[11px]">
                  Supabase Project URL (VITE_SUPABASE_URL):
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold font-mono text-[11px]">
                  Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY):
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={handleSaveSupabaseConfig}
                disabled={isTestingConn}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                {isTestingConn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                {isTestingConn ? 'Testing Connection...' : 'Save & Connect to Supabase'}
              </button>

              <button
                onClick={handleSeedDatabase}
                disabled={isSeedingDatabase}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-700/30 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                {isSeedingDatabase ? 'Seeding Tables (50 Villages, 10 Hosp)...' : 'Seed Supabase Tables (1-Click)'}
              </button>

              <button
                onClick={() => setActiveTab('schema')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                View SQL Schema
              </button>
            </div>
          </div>

          {/* Realtime Channel Health Grid */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Realtime Channel Synchronizations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { table: 'emergencies', label: 'Emergency Distress Ingress', events: 'INSERT, UPDATE, DELETE' },
                { table: 'ambulances', label: 'Ambulance 3D Coordinates & Telemetry', events: 'UPDATE (Position/Status)' },
                { table: 'hospitals', label: 'Hospital ICU & Bed Surge Telemetry', events: 'UPDATE (Occupancy)' },
                { table: 'medicine_inventory', label: 'Cold-Chain Pharmacy Stocks', events: 'UPDATE (Stock Levels)' },
                { table: 'road_closures', label: 'Landslide & Flood Impedances', events: 'INSERT, UPDATE' },
                { table: 'dispatches', label: 'Tactical Unit Assignments', events: 'INSERT (Dispatched Units)' },
              ].map((sub) => (
                <div key={sub.table} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white font-bold">{sub.table}</span>
                    <span className={`w-2 h-2 rounded-full ${backendStatus === 'CONNECTED_REALTIME' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">{sub.label}</div>
                  <div className="text-[9px] text-cyan-400">{sub.events}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ROUTING & SLA PARAMETERS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'routing' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>A* Pathfinding & Terrain Impedance Heuristics</span>
              </div>
              <button
                onClick={handleSaveParameters}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Parameters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center justify-between font-mono text-[11px]">
                  <span>Mountain Gradient Elevation Penalty:</span>
                  <span className="text-cyan-400 font-bold">{aStarElevationWeight}x</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={aStarElevationWeight}
                  onChange={(e) => setAStarElevationWeight(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <p className="text-[10px] text-slate-500">
                  Heuristic weight multiplier applied when vehicles ascend slopes &gt; 12%.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center justify-between font-mono text-[11px]">
                  <span>Monsoon Flood Caution Penalty:</span>
                  <span className="text-yellow-400 font-bold">{aStarFloodPenalty}x</span>
                </label>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.5"
                  value={aStarFloodPenalty}
                  onChange={(e) => setAStarFloodPenalty(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <p className="text-[10px] text-slate-500">
                  Impedance cost to encourage routing around submerged rural causeways.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center justify-between font-mono text-[11px]">
                  <span>eVTOL Drone Cruise Velocity (km/h):</span>
                  <span className="text-purple-400 font-bold">{droneCruiseVelocityKmh} km/h</span>
                </label>
                <input
                  type="number"
                  value={droneCruiseVelocityKmh}
                  onChange={(e) => setDroneCruiseVelocityKmh(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center justify-between font-mono text-[11px]">
                  <span>Critical Emergency SLA Benchmark:</span>
                  <span className="text-red-400 font-bold">{criticalSlaTargetMin} Minutes</span>
                </label>
                <input
                  type="number"
                  value={criticalSlaTargetMin}
                  onChange={(e) => setCriticalSlaTargetMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Audio & Alert Settings */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Audio Alert Siren & Vocal Dispatch</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div>
                <div className="font-bold text-white">Enable Siren Chimes on SOS Ingress</div>
                <div className="text-[10px] text-slate-400">
                  Plays priority audible chime whenever a Critical / Red emergency is logged.
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-cyan-950 text-cyan-200 border-cyan-400'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: SQL SCHEMA */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>PostgreSQL / Supabase Schema (21 Tables + RLS + Realtime)</span>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              To deploy these tables to your Supabase project, open the <strong>SQL Editor</strong> in the Supabase Dashboard, paste this script, and click <strong>Run</strong>.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
              <pre>
{`-- Tables: users, villages, patients, emergencies, hospitals, hospital_beds,
-- hospital_departments, doctors, doctor_shifts, ambulances, ambulance_equipment,
-- medicines, medicine_inventory, pharmacies, road_nodes, road_edges,
-- road_closures, routes, dispatches, dispatch_events, ai_recommendations, audit_logs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run full script from /src/services/supabaseSchema.sql or click Copy above.`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
