import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bell,
  Radio,
  PlusCircle,
  Clock,
  Sparkles,
  Shield,
  Volume2,
  VolumeX,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';

export const TopBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const {
    user,
    metrics,
    soundEnabled,
    toggleSound,
    logout,
    notificationsUnreadCount,
    logs,
    backendStatus,
    backendMessage,
    supabaseLatencyMs,
    isSeedingDatabase,
    seedSupabaseDatabase,
    initializeBackend,
    navigate,
  } = useHealthcareStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC+05:30'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalLogs = logs.filter((l) => l.level === 'CRITICAL' || l.level === 'AI_TRIAGE').slice(0, 6);

  const handleSeed = async () => {
    const res = await seedSupabaseDatabase();
    alert(res.message);
  };

  return (
    <header className="h-16 bg-[#08111F]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Brand & Online Beacon */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Rural Healthcare</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                3D COMMAND CENTER
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'CONNECTED_REALTIME' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <button
                onClick={() => setDbModalOpen(true)}
                className={`font-semibold hover:underline flex items-center gap-1 ${
                  backendStatus === 'CONNECTED_REALTIME' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {backendStatus === 'CONNECTED_REALTIME' ? (
                  <>● SUPABASE REALTIME ({supabaseLatencyMs}ms)</>
                ) : (
                  <>▲ BACKEND CONNECTION INTERRUPTED</>
                )}
              </button>
              <span className="text-slate-600">|</span>
              <span>50 VILLAGES / 500 EDGES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Real-time Telemetry KPI Indicators */}
      <div className="hidden lg:flex items-center gap-5 px-4 py-1.5 rounded-xl bg-[#050B14]/80 border border-slate-800/80 font-mono text-xs">
        {/* Ambulances */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">AMBULANCES</span>
          <span className="text-cyan-400 font-bold text-sm">
            {metrics.availableAmbulances} <span className="text-slate-500 text-xs">/ {metrics.totalAmbulances}</span>
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />

        {/* Hospitals */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">HOSPITALS</span>
          <span className="text-emerald-400 font-bold text-sm">
            {metrics.availableHospitals} <span className="text-slate-500 text-xs">/ {metrics.totalHospitals}</span>
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />

        {/* Active Emergencies */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-red-400 font-semibold uppercase tracking-wider">ACTIVE SOS</span>
          <span className="text-red-400 font-bold text-sm animate-pulse">
            0{metrics.activeEmergenciesCount}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />

        {/* Average Response */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">AVG RESPONSE</span>
          <span className="text-purple-400 font-bold text-sm">
            {metrics.avgResponseTimeMinutes} <span className="text-slate-500 text-[10px]">MIN</span>
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />

        {/* Database & Realtime Status */}
        <div
          onClick={() => setDbModalOpen(true)}
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">SUPABASE DB</span>
          <span className={`font-bold text-xs flex items-center gap-1 ${
            backendStatus === 'CONNECTED_REALTIME' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <Database className="w-3 h-3" />
            {backendStatus === 'CONNECTED_REALTIME' ? 'SYNCED' : 'LOCAL CACHE'}
          </span>
        </div>
      </div>

      {/* Right: Clock, SOS Trigger, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr}</span>
        </div>

        {/* RUN JUDGE DEMO PROMINENT BUTTON */}
        <button
          onClick={() => {
            useHealthcareStore.setState({ judgeDemoModalOpen: true });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 cursor-pointer font-mono border border-white/20"
        >
          <Award className="w-4 h-4" />
          <span className="hidden md:inline">Judge Demo</span>
        </button>

        {/* Trigger Instant Emergency Distress SOS Button */}
        <button
          onClick={() => {
            useHealthcareStore.setState({ createEmergencyModalOpen: true });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New Emergency</span>
        </button>

        {/* Audio Alerts Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Dispatch Siren Chimes' : 'Enable Audio Chimes'}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {notificationsUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-ping-slow">
                {notificationsUnreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-xl p-3 shadow-2xl border-cyan-500/30 z-50 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Emergency Alerts Stream
                </span>
                <span className="text-[10px] text-cyan-400">{criticalLogs.length} Active</span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {criticalLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-slate-900/90 border border-red-500/30 hover:border-red-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-red-400 font-bold">
                      <span>[{log.level}] {log.component}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-1 font-sans text-[11px] leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-xs cursor-pointer"
          >
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
            />
            <div className="text-left hidden md:block">
              <div className="font-bold text-white leading-tight text-[11px]">{user?.name}</div>
              <div className="text-[9px] text-cyan-400 font-mono">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel-elevated rounded-xl p-3 shadow-2xl border-cyan-500/30 z-50 text-xs font-sans space-y-2.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <img
                  src={user?.avatarUrl}
                  alt={user?.name}
                  className="w-10 h-10 rounded-lg object-cover border border-cyan-500/40"
                />
                <div>
                  <div className="font-bold text-white">{user?.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400">{user?.badgeNumber}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{user?.email}</div>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">
                  Command Staff Roles
                </div>
                {[
                  { role: 'COMMAND_DIRECTOR', name: 'Dr. Evelyn Vasquez', badge: 'CMD-9941' },
                  { role: 'FLEET_DISPATCHER', name: 'Dispatcher Liam Ross', badge: 'DSP-4410' },
                  { role: 'HOSPITAL_CHIEF', name: 'Dr. Aris Thorne', badge: 'MED-1102' },
                ].map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      if (user) {
                        useHealthcareStore.setState({
                          user: {
                            ...user,
                            role: r.role as any,
                            name: r.name,
                            badgeNumber: r.badge,
                          },
                        });
                      }
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      user?.role === r.role
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r.role}</span>
                    <span className="text-[10px] text-slate-500">{r.badge}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    navigate('settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Database & Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full px-2 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 font-mono text-xs flex items-center justify-center gap-2 border border-red-500/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backend & Realtime Modal */}
      {dbModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel-elevated rounded-2xl p-6 border-cyan-500/30 shadow-2xl font-sans space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Supabase Realtime Command Mesh</h3>
                  <p className="text-xs text-slate-400 font-mono">PostgreSQL Database & Replication Engine</p>
                </div>
              </div>
              <button
                onClick={() => setDbModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1 rounded-md hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Connection Status Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              backendStatus === 'CONNECTED_REALTIME'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}>
              {backendStatus === 'CONNECTED_REALTIME' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <div className="font-bold uppercase tracking-wider">
                  {backendStatus === 'CONNECTED_REALTIME' ? 'SUPABASE REALTIME ACTIVE' : 'BACKEND CONNECTION INTERRUPTED'}
                </div>
                <div className="text-slate-300">{backendMessage}</div>
                {backendStatus === 'FALLBACK_LOCAL' && (
                  <div className="text-[11px] text-amber-200 mt-1">
                    The platform is operating continuously in Resilient High-Scale Mode with 50 villages, 10 hospitals, 50 ambulances, 200 doctors, 500 road edges, and A* pathfinding.
                  </div>
                )}
              </div>
            </div>

            {/* Database Seeding & Schema execution */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Database Sync & Seeding Controls</span>
                <span className="font-mono text-[10px] text-cyan-400">SCHEMA: V2.4-SUPABASE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can seed all 20+ Supabase tables with high-fidelity realistic data: 50 villages, 10 hospitals, 50 ambulances, 200 doctors, 50 medicines, 200 road nodes, 500 road edges, and 100 emergencies.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleSeed}
                  disabled={isSeedingDatabase}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  {isSeedingDatabase ? 'Seeding Tables...' : 'Seed Supabase Tables'}
                </button>
                <button
                  onClick={async () => {
                    await initializeBackend();
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  Re-test Connection
                </button>
                <button
                  onClick={() => {
                    setDbModalOpen(false);
                    navigate('settings');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Configure Credentials
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span>PostgreSQL Tables: 21 Registered</span>
              <span>Realtime Channels: emergencies, ambulances, hospitals, roads</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
