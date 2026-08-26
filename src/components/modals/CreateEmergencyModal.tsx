import React, { useState } from 'react';
import {
  X,
  Flame,
  User,
  Phone,
  MapPin,
  Stethoscope,
  Activity,
  Heart,
  Plane,
  Plus,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';
import { SeverityLevel } from '../../types';

export const CreateEmergencyModal: React.FC = () => {
  const { createEmergencyModalOpen, villages, createNewEmergency } = useHealthcareStore();

  if (!createEmergencyModalOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(42);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [callerPhone, setCallerPhone] = useState('+91 98450 12345');
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'vil-01');
  const [condition, setCondition] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Critical');
  const [requiredSpecialist, setRequiredSpecialist] = useState('Emergency Physician');
  const [droneSupportRequested, setDroneSupportRequested] = useState(false);
  const [heartRate, setHeartRate] = useState(115);
  const [bloodPressure, setBloodPressure] = useState('145/95');
  const [spO2, setSpO2] = useState(91);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVillage = villages.find((v) => v.id === selectedVillageId) || villages[0];

    createNewEmergency({
      patientName: patientName || 'Distress Beacon Caller',
      patientAge: Number(patientAge),
      patientGender,
      callerPhone,
      villageId: selectedVillage.id,
      villageName: selectedVillage.name,
      position: selectedVillage.position,
      condition: condition || 'Acute unclassified distress reported via emergency SOS.',
      severity,
      requiredSpecialist,
      droneSupportRequested,
      vitals: {
        heartRate: Number(heartRate),
        bloodPressure,
        spO2: Number(spO2),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel-elevated rounded-2xl border-red-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#08111F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Log New Rural Medical Emergency (SOS Intake)
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Broadcasting immediate priority beacon to 3D Command Dispatchers
              </p>
            </div>
          </div>

          <button
            onClick={() => useHealthcareStore.setState({ createEmergencyModalOpen: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {/* Patient Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">
                Patient Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">
                Age & Gender
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="115"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-16 px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
                <select
                  value={patientGender}
                  onChange={(e: any) => setPatientGender(e.target.value)}
                  className="flex-1 px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Village & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Incident Village Settlement</span>
              </label>
              <select
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Pop: {v.population})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Caller / ASHA Worker Contact</span>
              </label>
              <input
                type="text"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Symptoms & Condition */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">
              Condition & Reported Symptoms
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Acute severe chest pain radiating to left arm, shortness of breath, diaphoretic..."
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-400 font-sans"
            />
          </div>

          {/* Urgency & Specialist Needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">
                Severity Level
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(['Critical', 'High', 'Medium', 'Low'] as SeverityLevel[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`py-1.5 rounded-lg border font-bold transition-all ${
                      severity === s
                        ? s === 'Critical'
                          ? 'bg-red-950 border-red-500 text-red-200 shadow-md shadow-red-500/20'
                          : s === 'High'
                          ? 'bg-orange-950 border-orange-500 text-orange-200'
                          : s === 'Medium'
                          ? 'bg-yellow-950 border-yellow-500 text-yellow-200'
                          : 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">
                Required Specialist
              </label>
              <select
                value={requiredSpecialist}
                onChange={(e) => setRequiredSpecialist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs"
              >
                <option value="Interventional Cardiologist">Interventional Cardiologist</option>
                <option value="Trauma Surgeon">Trauma Surgeon</option>
                <option value="High-Risk Obstetrician">High-Risk Obstetrician</option>
                <option value="Pediatric Critical Care">Pediatric Critical Care</option>
                <option value="Toxicologist / Antivenom Lead">Toxicologist / Antivenom Lead</option>
                <option value="Emergency Physician">Emergency Physician</option>
              </select>
            </div>
          </div>

          {/* Vitals Telemetry */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Reported Vitals (ASHA Pulse Oximeter / BP Cuff)
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Blood Pressure</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">SpO2 (%)</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* eVTOL Drone Support Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <div className="flex items-center gap-2.5">
              <Plane className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-bold text-white text-xs">Request eVTOL Drone Medical Airdrop</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Auto-dispatches medicine payload (Antivenom, Blood, Oxytocin)
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={droneSupportRequested}
              onChange={(e) => setDroneSupportRequested(e.target.checked)}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => useHealthcareStore.setState({ createEmergencyModalOpen: false })}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>BROADCAST SOS TO COMMAND CENTER</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
