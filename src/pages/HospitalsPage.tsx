import React from 'react';
import {
  Building2,
  Bed,
  Activity,
  Heart,
  Wind,
  ShieldCheck,
  Plane,
  Phone,
  MapPin,
  Navigation,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';

export const HospitalsPage: React.FC = () => {
  const { hospitals, setCameraFocus, navigate } = useHealthcareStore();

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              Hospital Capacity & Trauma Facilities
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              {hospitals.length} TRAUMA CENTERS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time tracking of ICU beds, surgical theater readiness, oxygen reserves, and specialist coverage.
          </p>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hospitals.map((hosp) => {
          const bedPercent = Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100);
          const icuPercent = Math.round(((hosp.icuTotal - hosp.icuAvailable) / hosp.icuTotal) * 100);
          const isCriticalLoad = hosp.emergencyLoad === 'Critical' || hosp.emergencyLoad === 'Surge Capacity';

          return (
            <div
              key={hosp.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4"
            >
              {/* Header: Name, Trauma Level, Load */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{hosp.name}</h3>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span>{hosp.traumaLevel}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <MapPin className="w-3 h-3" /> LAT: {hosp.position[0]}, LON: {hosp.position[2]}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                    isCriticalLoad
                      ? 'bg-red-950 text-red-300 border-red-500/40 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {hosp.emergencyLoad}
                </span>
              </div>

              {/* Capacity Meters */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
                {/* General Beds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-cyan-400" /> General Beds
                    </span>
                    <span className="text-cyan-300 font-bold">
                      {hosp.availableBeds} <span className="text-slate-500 text-[10px]">/ {hosp.totalBeds} avail</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        bedPercent > 85 ? 'bg-red-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${bedPercent}%` }}
                    />
                  </div>
                </div>

                {/* ICU Beds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> ICU Capacity
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {hosp.icuAvailable} <span className="text-slate-500 text-[10px]">/ {hosp.icuTotal} avail</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        icuPercent > 85 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${icuPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Logistics: Oxygen, Helipad, Phone */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>O2: <strong>{hosp.oxygenReservesHours}h reserves</strong></span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-purple-400" />
                  <span>Helipad: <strong>{hosp.helipadReady ? 'ACTIVE' : 'N/A'}</strong></span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{hosp.contactNumber.slice(0, 10)}</span>
                </div>
              </div>

              {/* Specialties Tag Cloud */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Trauma & Medical Specialties:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(hosp.specialists || hosp.specialties || []).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setCameraFocus(hosp.position, hosp.position, 14);
                  navigate('dashboard');
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-950 hover:border-emerald-400 border border-slate-800 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>INSPECT FACILITY IN 3D MESH</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
