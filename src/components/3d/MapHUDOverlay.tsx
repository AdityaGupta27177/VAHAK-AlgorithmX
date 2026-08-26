import React, { useState, useEffect } from 'react';
import {
  Layers,
  Compass,
  RotateCcw,
  Sun,
  Moon,
  CloudRain,
  Eye,
  Crosshair,
  Navigation,
  Activity,
  Radio,
  Truck,
  Building2,
  MapPin,
  Flame,
  Award,
  Play,
  Zap,
  Cpu,
  Sparkles,
  Command,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';
import { soundEffects } from '../../services/soundEffects';

export const MapHUDOverlay: React.FC = () => {
  const [layersOpen, setLayersOpen] = useState(false);
  const [quickFocusOpen, setQuickFocusOpen] = useState(false);
  const [algoSelectorOpen, setAlgoSelectorOpen] = useState(false);

  const {
    layers,
    toggleLayer,
    setDayNightMode,
    resetCameraView,
    setCameraFocus,
    emergencies,
    ambulances,
    hospitals,
    villages,
    activeRouteResult,
    selectedEntity,
    clearSelection,
    selectedRoutingAlgorithm,
    setRoutingAlgorithm,
    toggleRoadBlockage,
    roadSegments,
    executeIntelligentDispatch,
  } = useHealthcareStore();

  const activeEmergencies = emergencies.filter((e) => e.status !== 'RESOLVED');

  // Keyboard shortcuts (E: emergency, R: recalculate, C: close road, D: demo, Space: pause/toggle, ESC: reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'd' || e.key === 'D') {
        soundEffects.playClick();
        useHealthcareStore.setState({ judgeDemoModalOpen: true });
      } else if (e.key === 'e' || e.key === 'E') {
        soundEffects.playClick();
        useHealthcareStore.setState({ createEmergencyModalOpen: true });
      } else if (e.key === 'r' || e.key === 'R') {
        soundEffects.playRecalculateSweep();
        const pending = emergencies.find((emg) => emg.status !== 'RESOLVED');
        if (pending) {
          executeIntelligentDispatch(pending.id);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        soundEffects.playWarning();
        const targetRoad = roadSegments[1] || roadSegments[0];
        if (targetRoad) {
          toggleRoadBlockage(targetRoad.id);
        }
      } else if (e.key === 'Escape') {
        clearSelection();
        resetCameraView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emergencies, roadSegments, executeIntelligentDispatch, toggleRoadBlockage, clearSelection, resetCameraView]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
      {/* Top Left: 3D Geo-Coordinates & Judge Demo Launch Button */}
      <div className="pointer-events-auto flex items-start gap-3 flex-wrap">
        {/* RUN JUDGE DEMO PROMINENT BUTTON */}
        <button
          onClick={() => {
            soundEffects.playClick();
            useHealthcareStore.setState({ judgeDemoModalOpen: true });
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-white/20 animate-pulse"
        >
          <Award className="w-4 h-4 text-white" />
          <span>RUN JUDGE DEMO [D]</span>
        </button>

        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-3 border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-bold uppercase tracking-wider">3D Tactical Mesh</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">LAT: 23.412°N</span>
          <span className="text-slate-400">LON: 85.321°E</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-semibold">ELEV: 620-1680m</span>
        </div>

        {/* Selected Entity Mini Inspector if selected */}
        {selectedEntity && (
          <div className="glass-panel-elevated px-3.5 py-2 rounded-xl text-xs flex items-center gap-3 border-cyan-400 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                {selectedEntity.type}:
              </span>
              <span className="font-bold text-white">
                {selectedEntity.data?.name ||
                  selectedEntity.data?.patientName ||
                  selectedEntity.data?.callsign ||
                  selectedEntity.id}
              </span>
            </div>
            <button
              onClick={clearSelection}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono ml-2 transition-colors cursor-pointer"
            >
              ESC
            </button>
          </div>
        )}
      </div>

      {/* Top Right: 3D Scene Controls & Layer Switcher */}
      <div className="pointer-events-auto flex items-center gap-2 self-end">
        {/* Algorithm Switcher & Exploration Tree Toggle */}
        <div className="glass-panel p-1 rounded-xl flex items-center gap-1 border-cyan-500/30">
          <button
            onClick={() => {
              setRoutingAlgorithm('A_STAR');
              soundEffects.playClick();
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
              selectedRoutingAlgorithm === 'A_STAR'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A* Directed Tree
          </button>
          <button
            onClick={() => {
              setRoutingAlgorithm('DIJKSTRA');
              soundEffects.playClick();
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
              selectedRoutingAlgorithm === 'DIJKSTRA'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dijkstra Search
          </button>
        </div>

        {/* Quick Focus Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setQuickFocusOpen(!quickFocusOpen);
              setLayersOpen(false);
            }}
            className={`glass-panel px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              quickFocusOpen ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span>Target Focus</span>
          </button>

          {quickFocusOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel-elevated rounded-xl p-3 space-y-2 text-xs font-mono shadow-2xl border-cyan-500/30">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Active Emergencies
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {activeEmergencies.map((emg) => (
                  <button
                    key={emg.id}
                    onClick={() => {
                      setCameraFocus(emg.position, emg.position, 12);
                      setQuickFocusOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-red-950/80 hover:border-red-500/40 border border-slate-800 transition-colors flex items-center justify-between text-slate-200 cursor-pointer"
                  >
                    <span className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {emg.patientName}
                    </span>
                    <span className="text-[9px] text-red-400 font-bold">{emg.severity}</span>
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold pt-1 border-t border-slate-800">
                Key Facilities
              </div>
              <div className="grid grid-cols-2 gap-1">
                {hospitals.map((hosp) => (
                  <button
                    key={hosp.id}
                    onClick={() => {
                      setCameraFocus(hosp.position, hosp.position, 14);
                      setQuickFocusOpen(false);
                    }}
                    className="text-left px-2 py-1 rounded bg-slate-900/80 hover:bg-emerald-950/80 text-[10px] text-slate-300 truncate cursor-pointer"
                  >
                    🏥 {hosp.shortName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Layer Visibility Toggle Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setLayersOpen(!layersOpen);
              setQuickFocusOpen(false);
            }}
            className={`glass-panel px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              layersOpen ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>GIS Layers</span>
          </button>

          {layersOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-xl p-3 space-y-2 text-xs shadow-2xl border-cyan-500/30">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Map Feature Filters
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Villages
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.showVillages}
                    onChange={() => toggleLayer('showVillages')}
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Hospitals
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.showHospitals}
                    onChange={() => toggleLayer('showHospitals')}
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-400" /> Ambulances
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.showAmbulances}
                    onChange={() => toggleLayer('showAmbulances')}
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" /> Road Network
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.showRoadNetwork}
                    onChange={() => toggleLayer('showRoadNetwork')}
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-red-400" /> SOS Beacons
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.showEmergencyBeacons}
                    onChange={() => toggleLayer('showEmergencyBeacons')}
                    className="accent-cyan-400"
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                  Atmospheric Mode
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <button
                    onClick={() => setDayNightMode('NIGHT_TACTICAL')}
                    className={`py-1 rounded font-mono cursor-pointer ${
                      layers.dayNightMode === 'NIGHT_TACTICAL'
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Tactical
                  </button>
                  <button
                    onClick={() => setDayNightMode('DUSK_SURVEILLANCE')}
                    className={`py-1 rounded font-mono cursor-pointer ${
                      layers.dayNightMode === 'DUSK_SURVEILLANCE'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Dusk
                  </button>
                  <button
                    onClick={() => setDayNightMode('DAY_SATELLITE')}
                    className={`py-1 rounded font-mono cursor-pointer ${
                      layers.dayNightMode === 'DAY_SATELLITE'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Camera View Button */}
        <button
          onClick={resetCameraView}
          title="Reset 3D Camera to Global Overview [ESC]"
          className="glass-panel p-2 rounded-xl text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Navigation HUD / Route A* Telemetry Card */}
      <div className="pointer-events-auto flex items-end justify-between flex-wrap gap-2">
        {/* Active Route Algorithm Bar */}
        {activeRouteResult ? (
          <div className="glass-panel-elevated px-4 py-2.5 rounded-xl text-xs font-mono border-cyan-400/50 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-bold uppercase">Active Dispatch Path:</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <span>
                Distance: <strong className="text-white">{activeRouteResult.totalDistanceKm} km</strong>
              </span>
              <span>•</span>
              <span>
                ETA:{' '}
                <strong className="text-emerald-400">{activeRouteResult.estimatedTimeMinutes} min</strong>
              </span>
              <span>•</span>
              <span className="text-purple-300 font-semibold">{activeRouteResult.algorithmUsed}</span>
            </div>
          </div>
        ) : (
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Command className="w-3.5 h-3.5 text-cyan-400" /> Hotkeys:
            </span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">D</kbd> Judge Demo</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">E</kbd> Emergency</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">R</kbd> Recalculate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">C</kbd> Close Road</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">ESC</kbd> Reset</span>
          </div>
        )}

        {/* Quick Legend Indicator */}
        <div className="glass-panel px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Village
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Hospital
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Emergency SOS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Landslide Hazard
          </span>
        </div>
      </div>
    </div>
  );
};

