import React, { useState } from 'react';
import {
  Pill,
  Plane,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Building2,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';

export const MedicinesPage: React.FC = () => {
  const {
    medicines,
    pharmacies,
    villages,
    emergencies,
    requestDroneMedicineDelivery,
    updateMedicineStock,
    navigate,
  } = useHealthcareStore();

  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [selectedVillageId, setSelectedVillageId] = useState<string>(villages[0]?.id || 'vil-01');

  const handleLaunchDrone = (medId: string) => {
    const targetVillage = villages.find((v) => v.id === selectedVillageId) || villages[0];
    const relatedEmg = emergencies.find((e) => e.villageId === targetVillage.id);

    requestDroneMedicineDelivery(medId, targetVillage.position, relatedEmg?.id);
    navigate('dashboard');
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              Emergency Pharmacy & Drone Logistics Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              COLD-CHAIN VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Autonomous eVTOL drone delivery of critical antivenoms, whole blood units, and anti-hemorrhage vials to cut isolated rural transit times from 3 hours to 18 minutes.
          </p>
        </div>
      </div>

      {/* Cold Chain Status Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">COLD STORAGE TEMP</div>
            <div className="text-base font-bold text-cyan-300 font-mono">3.8°C (Optimal 2-8°C)</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">AIRDROP READY DRONES</div>
            <div className="text-base font-bold text-purple-300 font-mono">03 eVTOL Available</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">CRITICAL SERUMS</div>
            <div className="text-base font-bold text-emerald-300 font-mono">
              {medicines.filter((m) => m.criticality === 'Critical').length} Vital Stock Lines
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-yellow-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-950 text-yellow-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">DEPOT HUBS</div>
            <div className="text-base font-bold text-yellow-300 font-mono">
              {pharmacies.length} Regional Depots
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {medicines.map((med) => {
          const threshold = med.minThreshold || med.minimumThreshold || 10;
          const isLowStock = med.currentStock <= threshold;
          const stockPercent = Math.min(100, Math.round((med.currentStock / (threshold * 2)) * 100));

          return (
            <div
              key={med.id}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
                isLowStock
                  ? 'border-yellow-500/40 bg-gradient-to-b from-yellow-950/20 to-slate-900'
                  : 'border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              {/* Header: Name, Category, Stock Pill */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{med.name}</h3>
                  <div className="text-xs text-slate-400 font-mono">{med.category}</div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    med.urgentDroneDeliveryRequired || med.criticality === 'Critical'
                      ? 'bg-red-950 text-red-300 border-red-500/40'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {med.urgentDroneDeliveryRequired ? 'CRITICAL DRONE' : med.criticality || 'Essential'}
                </span>
              </div>

              {/* Stock Level Progress */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Available In Stock:</span>
                  <span className={`font-bold ${isLowStock ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {med.currentStock} {med.unit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isLowStock ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stockPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
                  <span>Threshold: {threshold} {med.unit}</span>
                  <span>Lot: {med.lotNumber}</span>
                </div>
              </div>

              {/* Specs: Cold Chain & Expiry */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500">COLD CHAIN</div>
                  <div className="text-cyan-300 font-bold mt-0.5">{med.storageTempCelsius || med.coldChainRequirement || '2°C - 8°C'}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500">EXPIRY DATE</div>
                  <div className="text-white font-bold mt-0.5">{med.expiryDate}</div>
                </div>
              </div>

              {/* Drone Airdrop Launch Action */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedVillageId}
                    onChange={(e) => setSelectedVillageId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleLaunchDrone(med.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/30"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>LAUNCH eVTOL</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
