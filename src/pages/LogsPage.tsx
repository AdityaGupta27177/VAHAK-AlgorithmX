import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Terminal,
  Activity,
  AlertTriangle,
  Cpu,
  Sparkles,
  Info,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';

export const LogsPage: React.FC = () => {
  const { logs } = useHealthcareStore();
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.component.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-500/50';
      case 'WARN':
        return 'bg-yellow-950 text-yellow-300 border-yellow-500/50';
      case 'A_STAR':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
      case 'AI_TRIAGE':
        return 'bg-purple-950 text-purple-300 border-purple-500/50';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rural_health_telemetry_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              System Audit Trail & Telemetry Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              {logs.length} EVENTS RECORDED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Immutable telemetry stream tracking A* execution cycles, Gemini clinical triage decisions, and SOS transmissions.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Export JSON Audit
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search telemetry messages, algorithm logs, components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-1.5 font-mono text-xs w-full sm:w-auto">
          {['ALL', 'CRITICAL', 'A_STAR', 'AI_TRIAGE', 'WARN', 'INFO'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg border transition-all text-[10px] ${
                filterLevel === lvl
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Log Console View */}
      <div className="rounded-2xl bg-[#03070E] border border-slate-800 p-4 font-mono text-xs space-y-2 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[10px] text-slate-500">
          <span>TIMESTAMP | SEVERITY | COMPONENT | TELEMETRY RECORD</span>
          <span>OUTPUT: STREAMING (WS 12ms)</span>
        </div>

        <div className="space-y-1 max-h-[520px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No logs found matching filter.</div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 flex items-start gap-3 transition-colors"
              >
                <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{log.timestamp}</span>

                <span
                  className={`px-2 py-0.2 rounded text-[9px] font-bold border shrink-0 ${getLevelBadge(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

                <span className="text-cyan-400 font-bold text-[10px] shrink-0">[{log.component}]</span>

                <span className="text-slate-200 leading-relaxed font-sans text-xs flex-1">
                  {log.message}
                </span>

                {log.meta && (
                  <span className="text-[10px] text-slate-500 font-mono hidden md:inline shrink-0">
                    {JSON.stringify(log.meta)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
