import React from 'react';
import {
  Navigation,
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Mountain,
  Zap,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { RoadStatus } from '../types';

export const RoadsPage: React.FC = () => {
  const { roadSegments, toggleRoadBlockage, setCameraFocus, navigate } = useHealthcareStore();

  const openRoads = roadSegments.filter((r) => r.status === 'OPEN').length;
  const blockedRoads = roadSegments.filter((r) => r.status === 'BLOCKED_LANDSLIDE').length;
  const floodRoads = roadSegments.filter((r) => r.status === 'WARNING_FLOOD').length;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              Rural Road Network & Terrain Obstacles
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              {roadSegments.length} TOPOLOGY EDGES
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Dynamic terrain routing mesh: Landslides, monsoon floods, and bridge closures instantly trigger A* path recalculation.
          </p>
        </div>
      </div>

      {/* Network Health Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">CLEAR CORRIDORS</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{openRoads} Segments</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">LANDSLIDE OBSTACLES</div>
            <div className="text-xl font-bold text-red-400 mt-0.5">{blockedRoads} Blocked</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400/60" />
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-yellow-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">MONSOON FLOOD HAZARDS</div>
            <div className="text-xl font-bold text-yellow-400 mt-0.5">{floodRoads} Caution</div>
          </div>
          <CloudRain className="w-8 h-8 text-yellow-400/60" />
        </div>
      </div>

      {/* Road Segment Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roadSegments.map((road) => {
          const isBlocked = road.status === 'BLOCKED_LANDSLIDE';
          const isFlood = road.status === 'WARNING_FLOOD';

          return (
            <div
              key={road.id}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                isBlocked
                  ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-slate-900'
                  : isFlood
                  ? 'border-yellow-500/40 bg-gradient-to-b from-yellow-950/20 to-slate-900'
                  : 'border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              {/* Header: Name & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{road.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Surface: {road.surfaceType} • Limit: {road.maxSpeedKmh} km/h
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    isBlocked
                      ? 'bg-red-950 text-red-300 border-red-500/40 animate-pulse'
                      : isFlood
                      ? 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {road.status}
                </span>
              </div>

              {/* Specs: Distance, Slope, Resistance */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300">
                <div>
                  <div className="text-slate-500">LENGTH</div>
                  <div className="text-white font-bold mt-0.5">{road.lengthKm} KM</div>
                </div>
                <div>
                  <div className="text-slate-500">GRADIENT</div>
                  <div className="text-white font-bold mt-0.5">{road.elevationSlopePercent || 8}%</div>
                </div>
                <div>
                  <div className="text-slate-500">A* PENALTY</div>
                  <div className="text-cyan-400 font-bold mt-0.5">
                    {isBlocked ? '∞ (AVOID)' : isFlood ? '2.5x Cost' : '1.0x Base'}
                  </div>
                </div>
              </div>

              {/* Obstacle Reason Warning */}
              {road.blockedReason && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Hazard: {road.blockedReason}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1 border-t border-slate-800">
                <button
                  onClick={() => toggleRoadBlockage(road.id)}
                  className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40'
                  }`}
                >
                  {isBlocked ? '✓ CLEAR LANDSLIDE & OPEN ROAD' : '⚠ MARK BLOCKED BY LANDSLIDE'}
                </button>

                <button
                  onClick={() => {
                    const midPos: [number, number, number] = [
                      (road.startPos[0] + road.endPos[0]) / 2,
                      (road.startPos[1] + road.endPos[1]) / 2,
                      (road.startPos[2] + road.endPos[2]) / 2,
                    ];
                    setCameraFocus(midPos, midPos, 14);
                    navigate('dashboard');
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors"
                  title="Locate Segment on 3D Map"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
