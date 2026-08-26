import React, { useState } from 'react';
import {
  Flame,
  Search,
  Filter,
  Clock,
  MapPin,
  Stethoscope,
  Truck,
  Building2,
  PhoneCall,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Plane,
  Heart,
  Activity,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { Emergency, SeverityLevel } from '../types';

export const EmergenciesPage: React.FC = () => {
  const {
    emergencies,
    ambulances,
    hospitals,
    doctors,
    openDispatchModal,
    updateEmergencyStatus,
    startTelemedicineSession,
    navigate,
    routeParamId,
    setCameraFocus,
  } = useHealthcareStore();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEmergencyId, setActiveEmergencyId] = useState<string>(
    routeParamId || emergencies[0]?.id || ''
  );

  const filteredEmergencies = emergencies.filter((e) => {
    if (selectedSeverity !== 'ALL' && e.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && e.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.patientName.toLowerCase().includes(q) ||
        e.condition.toLowerCase().includes(q) ||
        e.villageName.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeEmergency =
    emergencies.find((e) => e.id === activeEmergencyId) || filteredEmergencies[0] || emergencies[0];
  const assignedAmb = ambulances.find((a) => a.id === activeEmergency?.assignedAmbulanceId);
  const targetHosp = hospitals.find((h) => h.id === activeEmergency?.targetHospitalId);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#050B14] select-none">
      {/* Left List Column */}
      <div className="w-96 border-r border-cyan-500/20 bg-[#08111F]/80 flex flex-col justify-between">
        {/* Header & Filters */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Emergency Incidents
              </h1>
            </div>
            <button
              onClick={() => useHealthcareStore.setState({ createEmergencyModalOpen: true })}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log SOS
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search emergency records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`flex-1 py-1 rounded-lg border transition-all ${
                  selectedSeverity === sev
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency List */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto pr-2">
          {filteredEmergencies.map((emg) => {
            const isSelected = activeEmergency?.id === emg.id;
            return (
              <div
                key={emg.id}
                onClick={() => setActiveEmergencyId(emg.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-cyan-400 font-bold">{emg.id}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                      emg.severity === 'Critical'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : emg.severity === 'High'
                        ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {emg.severity}
                  </span>
                </div>
                <div className="font-bold text-xs text-white">{emg.patientName}</div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{emg.condition}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 border-t border-slate-800/80 pt-1.5">
                  <span>{emg.villageName}</span>
                  <span className="text-cyan-400 font-bold">{emg.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detailed Incident Console */}
      {activeEmergency ? (
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="glass-panel-elevated p-5 rounded-2xl border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeEmergency.patientName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-500/40 font-mono text-xs font-bold">
                    {activeEmergency.severity} URGENCY
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold">
                    STATUS: {activeEmergency.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Incident ID: {activeEmergency.id} • Reported at {activeEmergency.reportedAt} • Location:{' '}
                  {activeEmergency.villageName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCameraFocus(activeEmergency.position, activeEmergency.position, 14);
                  navigate('dashboard');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-cyan-400" /> View in 3D Map
              </button>

              {activeEmergency.status === 'PENDING_TRIAGE' && (
                <button
                  onClick={() => openDispatchModal(activeEmergency)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> DISPATCH UNIT
                </button>
              )}
            </div>
          </div>

          {/* 3 Columns: Patient Vitals, Assigned Logistics, Telemedicine Uplink */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Patient Vitals & Clinical Data */}
            <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 space-y-4">
              <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Live Vitals & Symptoms</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">HEART RATE</div>
                  <div className="text-base font-bold text-red-400 mt-1">
                    {activeEmergency.vitals?.heartRate || 105}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">BPM</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">BLOOD PRESS.</div>
                  <div className="text-base font-bold text-yellow-400 mt-1">
                    {activeEmergency.vitals?.bloodPressure || '135/90'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">SPO2</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {activeEmergency.vitals?.spO2 || 94}%
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                <div className="font-bold text-white">Reported Clinical Condition:</div>
                <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 leading-relaxed text-slate-200">
                  {activeEmergency.condition}
                </p>
              </div>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>
                  Required Specialist:{' '}
                  <strong className="text-purple-300">{activeEmergency.requiredSpecialist}</strong>
                </div>
                <div>
                  Caller Contact: <strong className="text-white">{activeEmergency.callerPhone}</strong>
                </div>
              </div>
            </div>

            {/* Assigned Logistics & Routing */}
            <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 space-y-4">
              <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Dispatch & SLA Telemetry</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500">ASSIGNED AMBULANCE</div>
                    <div className="font-bold text-white mt-0.5">
                      {assignedAmb ? assignedAmb.callsign : 'Not Yet Assigned'}
                    </div>
                  </div>
                  {assignedAmb && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                      {assignedAmb.type}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500">TARGET HOSPITAL</div>
                    <div className="font-bold text-emerald-300 mt-0.5">
                      {targetHosp ? targetHosp.name : 'Regional Trauma Center'}
                    </div>
                  </div>
                  {targetHosp && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {targetHosp.icuAvailable} ICU Avail
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ETA TO SCENE</div>
                    <div className="text-base font-bold text-cyan-400 mt-1">
                      {activeEmergency.etaMinutes} MIN
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">SLA TARGET</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {activeEmergency.slaTargetMinutes} MIN
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Update Emergency Operational Phase:
                </label>
                <select
                  value={activeEmergency.status}
                  onChange={(e: any) => updateEmergencyStatus(activeEmergency.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-200"
                >
                  <option value="PENDING_TRIAGE">PENDING_TRIAGE</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="AT_SCENE">AT_SCENE</option>
                  <option value="EN_ROUTE_HOSPITAL">EN_ROUTE_HOSPITAL</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                </select>
              </div>
            </div>

            {/* Telemedicine & Specialist Uplink */}
            <div className="glass-panel p-5 rounded-2xl border-purple-500/30 space-y-4">
              <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-purple-400" />
                  <span>Encrypted Telemedicine Uplink</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                  WEBRTC ACTIVE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-2">
                <div className="text-slate-300 font-sans leading-relaxed">
                  Remote specialist video assistance can be initiated directly with the field
                  paramedic or village health worker.
                </div>
                <div className="font-mono text-[11px] text-purple-200">
                  On-Call Specialists Available:
                </div>
                <div className="space-y-1">
                  {doctors.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-white">{doc.name}</div>
                          <div className="text-slate-400">{doc.specialization || doc.specialty}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => startTelemedicineSession(doc.id, activeEmergency.id)}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
                      >
                        CONNECT
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
          Select an emergency incident to view telemetry console.
        </div>
      )}
    </div>
  );
};
