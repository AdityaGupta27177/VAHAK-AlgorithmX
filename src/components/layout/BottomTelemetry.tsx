import React from 'react';
import {
  Activity,
  Cpu,
  Database,
  Radio,
  Clock,
  CheckCircle2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';

export const BottomTelemetry: React.FC = () => {
  const { metrics } = useHealthcareStore();

  return (
    <footer className="h-12 bg-[#050B14]/95 backdrop-blur-md border-t border-cyan-500/20 px-4 flex items-center justify-between z-30 select-none text-[11px] font-mono overflow-x-auto">
      {/* Telemetry Spark Metrics */}
      <div className="flex items-center gap-6 text-slate-300">
        {/* Ambulance Utilization */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[9px]">AMB UTILIZATION:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${metrics.ambulanceUtilization}%` }}
              />
            </div>
            <span className="font-bold text-cyan-300">{metrics.ambulanceUtilization}%</span>
          </div>
        </div>

        {/* Hospital Capacity */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[9px]">HOSPITAL CAPACITY:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${metrics.hospitalCapacityPercent}%` }}
              />
            </div>
            <span className="font-bold text-emerald-300">{metrics.hospitalCapacityPercent}%</span>
          </div>
        </div>

        {/* Medicine Stock */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[9px]">MEDICINE STOCK:</span>
          <span className="font-bold text-purple-300">{metrics.medicineStockPercent}%</span>
        </div>

        {/* SLA Compliance */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[9px]">SLA COMPLIANCE:</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {metrics.slaComplianceRate}%
          </span>
        </div>

        {/* Avg Response Time */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[9px]">AVG RESPONSE:</span>
          <span className="font-bold text-yellow-400">{metrics.avgResponseTimeMinutes} MIN</span>
        </div>
      </div>

      {/* Engine & Compute Telemetry */}
      <div className="flex items-center gap-5 text-slate-400">
        {/* A* Execution Time */}
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">A* PATHFINDER:</span>
          <span className="font-bold text-cyan-300">{metrics.aStarComputeTimeMs}ms</span>
        </div>

        {/* AI Confidence */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-500">AI CONFIDENCE:</span>
          <span className="font-bold text-purple-300">{metrics.aiConfidence}%</span>
        </div>

        {/* WebSocket Heartbeat */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
          <span className="text-emerald-400 font-semibold">
            WS: CONNECTED ({metrics.webSocketLatencyMs}ms)
          </span>
        </div>
      </div>
    </footer>
  );
};
