import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Lock,
  Mail,
  User as UserIcon,
  Fingerprint,
  KeyRound,
  Database,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Activity,
  Globe,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { User } from '../types';
import { setCustomSupabaseConfig, testSupabaseConnection } from '../lib/supabaseClient';

export const AuthPage: React.FC = () => {
  const { login } = useHealthcareStore();
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'sso' | 'supabase'>('signin');

  // Sign In Form State
  const [selectedRole, setSelectedRole] = useState<'COMMAND_DIRECTOR' | 'FLEET_DISPATCHER' | 'HOSPITAL_CHIEF'>('COMMAND_DIRECTOR');
  const [email, setEmail] = useState('e.vasquez@ruralhealth.ops.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'COMMAND_DIRECTOR' | 'FLEET_DISPATCHER' | 'HOSPITAL_CHIEF'>('COMMAND_DIRECTOR');
  const [regBadge, setRegBadge] = useState('CMD-8832');

  // Supabase Config State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [configTesting, setConfigTesting] = useState(false);
  const [configResult, setConfigResult] = useState<string | null>(null);

  const roleProfiles: Record<string, User> = {
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

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsAuthenticating(false);
      login(roleProfiles[selectedRole]);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please provide valid operator name and email address.');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const newUser: User = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: regName,
        email: regEmail,
        role: regRole,
        badgeNumber: regBadge,
        department: 'Independent Regional Medical Dispatch Unit',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      login(newUser);
    }, 900);
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigTesting(true);
    setConfigResult(null);
    try {
      setCustomSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
      const res = await testSupabaseConnection();
      if (res.success) {
        setConfigResult(res.message || 'Successfully connected to Supabase PostgreSQL cluster!');
      } else {
        setConfigResult(res.message || 'Connection failed. Please check URL and Anon Key.');
      }
    } catch (err: any) {
      setConfigResult(`Error: ${err?.message || 'Connection failed'}`);
    } finally {
      setConfigTesting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#03070E] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background Holographic Glows & Grid */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -top-48 -left-48" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none -bottom-48 -right-48" />

      {/* Auth Main Container Card */}
      <div className="w-full max-w-xl glass-panel-elevated rounded-3xl border-cyan-500/30 shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header Brand */}
        <div className="p-6 pb-4 bg-gradient-to-b from-slate-900/90 to-slate-950/60 border-b border-slate-800 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20 mb-3">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
            Rural Healthcare 3D Command Mesh
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure Authentication & Autonomous Tactical Dispatch Portal
          </p>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 mt-5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'signin', label: 'Sign In', icon: Lock },
              { id: 'register', label: 'Register', icon: UserIcon },
              { id: 'sso', label: 'Govt SSO', icon: Globe },
              { id: 'supabase', label: 'Supabase DB', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setErrorMsg(null);
                  }}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider block">
                  Select Clearance Profile:
                </label>
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
                        type="button"
                        key={item.id}
                        onClick={() => {
                          setSelectedRole(item.id as any);
                          setEmail(roleProfiles[item.id].email);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-102'
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

              {/* Profile Preview Box */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <img
                  src={roleProfiles[selectedRole].avatarUrl}
                  alt={roleProfiles[selectedRole].name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                />
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white">{roleProfiles[selectedRole].name}</div>
                  <div className="text-[10px] text-cyan-400">
                    Badge: {roleProfiles[selectedRole].badgeNumber} • {roleProfiles[selectedRole].department}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Secure Operator Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Passkey / Encrypted Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <Fingerprint className="w-5 h-5 animate-pulse text-cyan-200" />
                    <span>Establishing Secure Handshake...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    <span>Sign In to Command Mesh</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. REGISTER NEW OPERATOR TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Operator Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Jordan Vance"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Official Government / Medical Email</label>
                <input
                  type="email"
                  placeholder="j.vance@ruralhealth.gov"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Assigned Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="COMMAND_DIRECTOR">Command Director</option>
                    <option value="FLEET_DISPATCHER">Fleet Dispatcher</option>
                    <option value="HOSPITAL_CHIEF">Hospital Trauma Chief</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Badge ID</label>
                  <input
                    type="text"
                    value={regBadge}
                    onChange={(e) => setRegBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isAuthenticating ? (
                  <span>Registering Credentials...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Operator Profile & Launch</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. GOVT SSO TAB */}
          {activeTab === 'sso' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400 mx-auto shadow-lg shadow-purple-500/20">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-sm font-mono font-bold text-white">
                Federated Government & Health Ministry SSO
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Authenticate securely using national healthcare identity federation providers (SAML 2.0 / OAuth2 OpenID Connect).
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => login(roleProfiles.COMMAND_DIRECTOR)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Authenticate via National Health ID (NHID)</span>
                </button>
                <button
                  onClick={() => login(roleProfiles.FLEET_DISPATCHER)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Authenticate via Emergency Services Network (ESN)</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. SUPABASE DB & AUTH CONFIG TAB */}
          {activeTab === 'supabase' && (
            <form onSubmit={handleSaveSupabase} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzproject.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Supabase Anon / Service Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {configResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    configResult.includes('Successfully')
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                      : 'bg-red-950/80 border border-red-500/50 text-red-200'
                  }`}
                >
                  {configResult}
                </div>
              )}

              <button
                type="submit"
                disabled={configTesting}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {configTesting ? <span>Connecting...</span> : <span>Save & Test Connection</span>}
              </button>
            </form>
          )}

          {/* Quick Demo Access Footer */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => login(roleProfiles.COMMAND_DIRECTOR)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              ⚡ Instant Bypass: Enter Command Center as Dr. Evelyn Vasquez
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
