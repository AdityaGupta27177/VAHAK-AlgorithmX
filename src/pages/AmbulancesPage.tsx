import React, { useState } from 'react';
import {
  Truck,
  Plane,
  Battery,
  Fuel,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  Activity,
  Plus,
  Navigation,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';

export const AmbulancesPage: React.FC = () => {
  const { ambulances, emergencies, hospitals, setCameraFocus, navigate } = useHealthcareStore();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredAmbulances = ambulances.filter((a) => {
    if (filterType === 'DRONE') return a.type.includes('Drone');
    if (filterType === 'GROUND') return !a.type.includes('Drone');
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              Emergency Fleet & Drone Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              {ambulances.length} UNITS REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time tracking of Advanced Life Support (ALS) 4x4 ground vehicles & eVTOL emergency medical delivery drones.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === 'ALL'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            All Fleet ({ambulances.length})
          </button>
          <button
            onClick={() => setFilterType('GROUND')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === 'GROUND'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Ground ALS ({ambulances.filter((a) => !a.type.includes('Drone')).length})
          </button>
          <button
            onClick={() => setFilterType('DRONE')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === 'DRONE'
                ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            eVTOL Drones ({ambulances.filter((a) => a.type.includes('Drone')).length})
          </button>
        </div>
      </div>

      {/* Ambulance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAmbulances.map((amb) => {
          const isDrone = amb.type.includes('Drone');
          const isEnRoute =
            amb.status === 'Dispatched En Route' || amb.status === 'Transporting to Hospital';
          const assignedEmg = emergencies.find((e) => e.id === amb.assignedEmergencyId);

          return (
            <div
              key={amb.id}
              className={`glass-panel p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isEnRoute
                  ? 'border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Callsign & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDrone
                        ? 'bg-purple-950 text-purple-400 border border-purple-500/40'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {isDrone ? <Plane className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{amb.callsign}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">{amb.type}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    amb.status === 'Idle / Ready'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : amb.status === 'Dispatched En Route'
                      ? 'bg-red-950 text-red-300 border-red-500/40 animate-pulse'
                      : 'bg-purple-950 text-purple-300 border-purple-500/40'
                  }`}
                >
                  {amb.status}
                </span>
              </div>

              {/* Specs & Hardware */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-[10px] mb-3">
                <div>
                  <div className="text-slate-500 flex items-center gap-1">
                    {isDrone ? <Battery className="w-3 h-3 text-purple-400" /> : <Fuel className="w-3 h-3 text-cyan-400" />}
                    <span>{isDrone ? 'BATTERY' : 'FUEL'}</span>
                  </div>
                  <div className="text-white font-bold mt-0.5">{amb.fuelPercent}%</div>
                </div>

                <div>
                  <div className="text-slate-500">SPEED</div>
                  <div className="text-white font-bold mt-0.5">{amb.speedKmh} km/h</div>
                </div>

                <div>
                  <div className="text-slate-500">PARAMEDIC</div>
                  <div className="text-white font-bold mt-0.5 truncate">{amb.paramedicLead.split(' ')[0]}</div>
                </div>
              </div>

              {/* Assigned Mission Banner if active */}
              {assignedEmg ? (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs font-mono mb-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-red-400 font-bold">
                    <span>ACTIVE MISSION: {assignedEmg.id}</span>
                    <span>{amb.estimatedArrivalMinutes}m ETA</span>
                  </div>
                  <div className="text-white font-sans font-semibold text-[11px]">
                    {assignedEmg.patientName} ({assignedEmg.villageName})
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stationed at base • Available for dispatch</span>
                </div>
              )}

              {/* Equipment Inventory */}
              <div className="text-[10px] text-slate-400 mb-4 font-mono">
                <div className="text-slate-500 uppercase text-[9px] mb-1">Equipment on Board:</div>
                <div className="flex flex-wrap gap-1">
                  {(amb.equipment || ['ALS Defibrillator', 'Cold-Chain Kit', 'Oxygen Tank']).map((eq, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setCameraFocus(amb.position, amb.position, 12);
                  navigate('dashboard');
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-800 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>TRACK IN 3D MESH</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
