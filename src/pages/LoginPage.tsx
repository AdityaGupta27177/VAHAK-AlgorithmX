import React, { useState } from 'react';
import {
  Radio,
  Shield,
  Fingerprint,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Activity,
  Truck,
  Building2,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { User as UserType } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useHealthcareStore();
  const [selectedRole, setSelectedRole] = useState<'COMMAND_DIRECTOR' | 'FLEET_DISPATCHER' | 'HOSPITAL_CHIEF'>('COMMAND_DIRECTOR');
  const [isScanning, setIsScanning] = useState(false);

  const roleProfiles: Record<string, UserType> = {
    COMMAND_DIRECTOR: {
      id: 'usr-01',
      name: 'Dr. Evelyn Vasquez',
      email: 'e.vasquez@ruralhealth.ops.gov',
      role: 'COMMAND_DIRECTOR',
      badgeNumber: 'CMD-9941',
      department: 'Central Emergency Command Directorate',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
    FLEET_DISPATCHER: {
      id: 'usr-02',
      name: 'Liam Ross',
      email: 'l.ross@ruralhealth.dispatch.gov',
      role: 'FLEET_DISPATCHER',
      badgeNumber: 'DSP-4410',
      department: 'Tactical Fleet & Drone Medivac Wing',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    },
    HOSPITAL_CHIEF: {
      id: 'usr-03',
      name: 'Dr. Aris Thorne',
      email: 'a.thorne@apollo.trauma.org',
      role: 'HOSPITAL_CHIEF',
      badgeNumber: 'MED-1102',
      department: 'Regional Trauma Surgery Consortium',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
  };

  const handleAuthenticate = () => {
    setIsScanning(true);
    setTimeout(() => {
      login(roleProfiles[selectedRole]);
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#03070E] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Holographic Hex Grid */}
      <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -top-48 -left-48" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none -bottom-48 -right-48" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border-cyan-500/30 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight uppercase font-mono mt-2">
            Rural Healthcare 3D Command
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            "Intelligent Routing. Faster Care. Stronger Communities."
          </p>
        </div>

        {/* Tactical Profile Preset Switcher */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
            Select Operation Clearance:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'COMMAND_DIRECTOR', label: 'Director', icon: Shield },
              { id: 'FLEET_DISPATCHER', label: 'Dispatcher', icon: Truck },
              { id: 'HOSPITAL_CHIEF', label: 'Trauma Chief', icon: Building2 },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedRole(item.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                  <div className="text-[11px] font-mono font-bold">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Profile Preview */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <img
            src={roleProfiles[selectedRole].avatarUrl}
            alt={roleProfiles[selectedRole].name}
            className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
          />
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white">{roleProfiles[selectedRole].name}</div>
            <div className="text-[10px] text-cyan-400">
              {roleProfiles[selectedRole].badgeNumber} • {roleProfiles[selectedRole].role}
            </div>
          </div>
        </div>

        {/* Authenticate Action */}
        <button
          onClick={handleAuthenticate}
          disabled={isScanning}
          className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isScanning ? (
            <>
              <Fingerprint className="w-5 h-5 animate-pulse text-cyan-200" />
              <span>Verifying Biometric Key...</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-5 h-5" />
              <span>Authenticate & Enter Command Mesh</span>
            </>
          )}
        </button>

        {/* Footer info */}
        <div className="text-center text-[10px] font-mono text-slate-500">
          Encrypted AES-256 Protocol • Low-Earth Orbit Satellite Mesh Gateway
        </div>
      </div>
    </div>
  );
};
