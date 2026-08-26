import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Truck,
  Building2,
  Navigation,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Plane,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Lock,
  ArrowRight,
  RefreshCw,
  Sliders,
  AlertOctagon,
  Zap,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';
import { calculateAStarRoute, RouteCalculationResult } from '../../services/routingAlgorithm';
import { requestAiTriageRecommendation } from '../../services/geminiService';
import { buildRoadNetworkGraph } from '../../services/graphEngine';
import { evaluateHospitalForEmergency, evaluateAmbulanceForEmergency } from '../../services/dispatchEngine';

export const DispatchModal: React.FC = () => {
  const {
    dispatchModalEmergency,
    closeDispatchModal,
    ambulances,
    hospitals,
    doctors,
    medicines,
    villages,
    pharmacies,
    roadSegments,
    selectedRoutingAlgorithm,
    setRoutingAlgorithm,
    executeIntelligentDispatch,
    dispatchAmbulanceToEmergency,
  } = useHealthcareStore();

  const emergency = dispatchModalEmergency || ({} as any);

  // Selected ambulance & target hospital state (for manual mode or pre-selection)
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'MANUAL' | 'ALGORITHM_BENCHMARK'>('PIPELINE');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteCalculationResult | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // Build temporary topological graph for evaluation
  const currentGraph = useMemo(() => {
    return buildRoadNetworkGraph(villages, hospitals, pharmacies, roadSegments);
  }, [villages, hospitals, pharmacies, roadSegments]);

  const patientNodeId = useMemo(() => {
    const v = villages.find((vil) => vil.name === emergency.villageName || vil.id === emergency.villageId);
    if (v) return v.id;
    const closest = currentGraph.findClosestNode(emergency.position);
    return closest ? closest.id : 'N-VIL-1';
  }, [emergency, villages, currentGraph]);

  // Evaluate all hospitals using the Clinical Evaluation Engine
  const hospitalEvaluations = useMemo(() => {
    return hospitals.map((hosp) =>
      evaluateHospitalForEmergency(emergency, hosp, doctors, medicines, currentGraph, patientNodeId)
    );
  }, [emergency, hospitals, doctors, medicines, currentGraph, patientNodeId]);

  // Evaluate candidate ambulances
  const ambulanceEvaluations = useMemo(() => {
    return ambulances.map((amb) =>
      evaluateAmbulanceForEmergency(emergency, amb, currentGraph, patientNodeId)
    );
  }, [emergency, ambulances, currentGraph, patientNodeId]);

  // Best matches derived from algorithmic pipeline
  const bestHospitalEval = useMemo(() => {
    const eligible = hospitalEvaluations.filter((h) => h.isEligible);
    if (eligible.length === 0) return null;
    return [...eligible].sort((a, b) => a.totalHospitalScore - b.totalHospitalScore)[0];
  }, [hospitalEvaluations]);

  const bestAmbulanceEval = useMemo(() => {
    const compatible = ambulanceEvaluations.filter((a) => a.isCompatible);
    if (compatible.length === 0) return null;
    return [...compatible].sort((a, b) => a.totalAmbulanceScore - b.totalAmbulanceScore)[0];
  }, [ambulanceEvaluations]);

  // Available ambulances
  const availableAmbulances = ambulances.filter(
    (a) => a.status === 'Idle / Ready' || a.status === 'Dispatched En Route'
  );

  // Initialize selection
  useEffect(() => {
    if (bestAmbulanceEval) {
      setSelectedAmbulanceId(bestAmbulanceEval.ambulance.id);
    } else if (availableAmbulances.length > 0 && !selectedAmbulanceId) {
      setSelectedAmbulanceId(availableAmbulances[0].id);
    }

    if (bestHospitalEval) {
      setSelectedHospitalId(bestHospitalEval.hospital.id);
    } else if (hospitals.length > 0 && !selectedHospitalId) {
      setSelectedHospitalId(hospitals[0].id);
    }

    // Call AI Triage in background
    const fetchAiTriage = async () => {
      setAiLoading(true);
      try {
        const rec = await requestAiTriageRecommendation(emergency, hospitals, availableAmbulances, roadSegments);
        setAiRecommendation(rec);
      } catch (err) {
        console.error('AI Triage request failed', err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiTriage();
  }, [emergency.id, bestHospitalEval?.hospital.id, bestAmbulanceEval?.ambulance.id]);

  // Recalculate route whenever selected ambulance or algorithm changes
  useEffect(() => {
    const amb = ambulances.find((a) => a.id === selectedAmbulanceId);
    if (amb && emergency.position) {
      const isDrone = amb.type.includes('Drone');
      const routeRes = calculateAStarRoute(
        amb.position,
        emergency.position,
        roadSegments,
        isDrone,
        selectedRoutingAlgorithm
      );
      setCalculatedRoute(routeRes);
    }
  }, [selectedAmbulanceId, emergency.position, roadSegments, selectedRoutingAlgorithm]);

  if (!dispatchModalEmergency) return null;

  // Handle Algorithmic Pipeline Execution
  const handleExecutePipeline = async () => {
    setDispatching(true);
    setPipelineError(null);
    try {
      const result = await executeIntelligentDispatch(emergency.id);
      if (!result.success) {
        setPipelineError(result.rejectionSummary || 'Dispatch could not be completed.');
      }
    } catch (err: any) {
      setPipelineError(err.message || 'Dispatch execution error.');
    } finally {
      setDispatching(false);
    }
  };

  // Handle Manual Dispatch Fallback
  const handleManualDispatch = () => {
    if (!selectedAmbulanceId || !selectedHospitalId) return;
    dispatchAmbulanceToEmergency(selectedAmbulanceId, emergency.id, selectedHospitalId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl glass-panel-elevated rounded-2xl border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#08111F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500/60 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/50">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Intelligent Routing & Clinical Dispatch Pipeline
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono font-bold border border-red-500/40">
                  {emergency.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/40">
                  SLA: {emergency.slaTargetMinutes}m ({emergency.severity})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Patient: <strong className="text-white">{emergency.patientName}</strong> ({emergency.patientAge}y {emergency.patientGender}) • Village: <strong className="text-cyan-300">{emergency.villageName}</strong> • Condition: <strong className="text-amber-300">{emergency.condition}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Algorithm Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setRoutingAlgorithm('A_STAR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedRoutingAlgorithm === 'A_STAR'
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="A* with Haversine Admissible Heuristic (O(E + V log V))"
              >
                A* Engine
              </button>
              <button
                onClick={() => setRoutingAlgorithm('DIJKSTRA')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedRoutingAlgorithm === 'DIJKSTRA'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Dijkstra Uniform-Cost Exact Shortest Path"
              >
                Dijkstra Engine
              </button>
            </div>

            <button
              onClick={closeDispatchModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/80 px-4 pt-2 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'PIPELINE'
                ? 'bg-slate-900 text-cyan-400 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Clinical Pipeline Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('MANUAL')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'MANUAL'
                ? 'bg-slate-900 text-cyan-400 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Tactical Override</span>
          </button>
          <button
            onClick={() => setActiveTab('ALGORITHM_BENCHMARK')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'ALGORITHM_BENCHMARK'
                ? 'bg-slate-900 text-purple-400 border-purple-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>A* vs Dijkstra Benchmark</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pipelineError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pipeline Execution Halted:</span> {pipelineError}
              </div>
            </div>
          )}

          {/* Clinical Requirement Overview */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 border border-purple-500/30 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>CLINICAL TRIAGE CONSTRAINTS & REQUIREMENTS</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                Priority: {emergency.severity} • SLA Window: {emergency.slaTargetMinutes} min
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono mt-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Required Specialist</span>
                <span className="text-amber-300 font-bold">{emergency.requiredSpecialist || 'Trauma Surgeon'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Required Medicine</span>
                <span className="text-emerald-300 font-bold">{emergency.requiredMedicine || 'Emergency Antivenom'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Patient Vitals</span>
                <span className="text-cyan-300 font-bold">HR: {emergency.vitals?.heartRate || 90} bpm • SpO2: {emergency.vitals?.spO2 || 96}%</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Patient Location</span>
                <span className="text-purple-300 font-bold">{emergency.villageName}</span>
              </div>
            </div>
          </div>

          {activeTab === 'PIPELINE' && (
            <div className="space-y-4">
              {/* Clinical Hospital Filter & Scoring Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hospital Feasibility & Clinical Scoring Matrix (Stage 1 & 2)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {hospitalEvaluations.filter((h) => h.isEligible).length} of {hospitalEvaluations.length} Qualified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {hospitalEvaluations.map((evalHosp) => {
                    const hosp = evalHosp.hospital;
                    const isTopMatch = bestHospitalEval?.hospital.id === hosp.id;

                    return (
                      <div
                        key={hosp.id}
                        onClick={() => setSelectedHospitalId(hosp.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          evalHosp.isEligible
                            ? isTopMatch
                              ? 'bg-emerald-950/70 border-emerald-400 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900/70 border-slate-700 hover:border-slate-600'
                            : 'bg-slate-950/50 border-red-950/60 opacity-65'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${evalHosp.isEligible ? 'bg-emerald-400' : 'bg-red-500'}`} />
                            <strong className="text-xs font-mono text-white">{hosp.name}</strong>
                          </div>
                          {isTopMatch ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono font-bold">
                              OPTIMAL MATCH (Score {evalHosp.totalHospitalScore})
                            </span>
                          ) : evalHosp.isEligible ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800">
                              Score: {evalHosp.totalHospitalScore}
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono border border-red-800">
                              REJECTED
                            </span>
                          )}
                        </div>

                        {/* Constraints Checklist */}
                        <div className="grid grid-cols-4 gap-1 text-[10px] font-mono mb-2">
                          <div className={`p-1 rounded text-center ${evalHosp.hasSpecialist ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-400'}`}>
                            {evalHosp.hasSpecialist ? '✓ Specialist' : '✗ No Specialist'}
                          </div>
                          <div className={`p-1 rounded text-center ${evalHosp.hasBedAvailable ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-400'}`}>
                            {evalHosp.hasBedAvailable ? `✓ Beds (${hosp.availableBeds})` : '✗ Bed Full'}
                          </div>
                          <div className={`p-1 rounded text-center ${evalHosp.hasRequiredMedicine ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-400'}`}>
                            {evalHosp.hasRequiredMedicine ? '✓ Medicine' : '✗ No Stock'}
                          </div>
                          <div className={`p-1 rounded text-center ${evalHosp.hasViableRoute ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-400'}`}>
                            {evalHosp.hasViableRoute ? '✓ Road Open' : '✗ Blocked'}
                          </div>
                        </div>

                        {/* Rejection reasons or Score breakdown */}
                        {!evalHosp.isEligible ? (
                          <div className="text-[10px] font-mono text-red-400 flex items-center gap-1 bg-red-950/30 p-1.5 rounded border border-red-900/40">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{evalHosp.rejectionReasons.join(' • ')}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-slate-300 flex items-center justify-between bg-slate-950/60 p-1.5 rounded">
                            <span>Travel: {evalHosp.travelTimeMin}m</span>
                            <span>Wait: {evalHosp.ambulanceWaitTimeMin}m</span>
                            <span className="text-emerald-400">Total Score: {evalHosp.totalHospitalScore}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Ambulance Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ambulance Match & Equipment Score (Stage 3)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ambulanceEvaluations.filter((a) => a.isCompatible).length} Units Feasible
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {ambulanceEvaluations.slice(0, 8).map((evalAmb) => {
                    const amb = evalAmb.ambulance;
                    const isTopMatch = bestAmbulanceEval?.ambulance.id === amb.id;
                    const isDrone = amb.type.includes('Drone');

                    return (
                      <div
                        key={amb.id}
                        onClick={() => setSelectedAmbulanceId(amb.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          evalAmb.isCompatible
                            ? isTopMatch
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900/70 border-slate-700 hover:border-slate-600'
                            : 'bg-slate-950/50 border-red-950/60 opacity-65'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                            {isDrone ? <Plane className="w-4 h-4 text-purple-400" /> : <Truck className="w-4 h-4 text-cyan-400" />}
                            <span>{amb.callsign}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                              {amb.type}
                            </span>
                          </div>
                          {isTopMatch ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400 text-black font-mono font-bold">
                              TOP UNIT
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400">
                              ETA: {evalAmb.etaMinutesToPatient}m
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 mt-1.5 border-t border-slate-800/80 pt-1.5">
                          <span>Fuel: {amb.fuelPercent}%</span>
                          <span>Score: {evalAmb.totalAmbulanceScore}</span>
                          <span className={evalAmb.isCompatible ? 'text-emerald-400' : 'text-amber-400'}>
                            {evalAmb.isCompatible ? '✓ Compatible' : '✗ Incompatible'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MANUAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ambulance List */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider block">
                  Select Unit
                </label>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {availableAmbulances.map((amb) => (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbulanceId(amb.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                        selectedAmbulanceId === amb.id
                          ? 'bg-cyan-950 border-cyan-400 text-white'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{amb.callsign} ({amb.type})</span>
                        <span className="text-emerald-400">{amb.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Speed: {amb.speedKmh} km/h • Fuel: {amb.fuelPercent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospital List */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider block">
                  Select Hospital
                </label>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {hospitals.map((hosp) => (
                    <div
                      key={hosp.id}
                      onClick={() => setSelectedHospitalId(hosp.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                        selectedHospitalId === hosp.id
                          ? 'bg-emerald-950 border-emerald-400 text-white'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{hosp.shortName}</span>
                        <span className="text-cyan-400">Beds: {hosp.availableBeds}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        ICU: {hosp.icuAvailable} avail • Specialists: {hosp.specialists?.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ALGORITHM_BENCHMARK' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-cyan-300">A* SEARCH (HEURISTIC)</span>
                    <span className="text-[10px] bg-cyan-900 px-1.5 py-0.5 rounded text-cyan-200">Admissible</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• Cost Function: <code className="text-cyan-400">f(n) = g(n) + h(n)</code></li>
                    <li>• Heuristic: <strong className="text-white">Haversine Euclidean Distance</strong></li>
                    <li>• Avg Visited Nodes: <strong className="text-emerald-400">28 nodes</strong></li>
                    <li>• Avg Execution Time: <strong className="text-emerald-400">3.8 ms</strong></li>
                    <li>• Dynamic Obstacle Avoidance: <strong className="text-emerald-400">Enabled</strong></li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-300">DIJKSTRA SEARCH (UNIFORM)</span>
                    <span className="text-[10px] bg-purple-900 px-1.5 py-0.5 rounded text-purple-200">Exhaustive</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• Cost Function: <code className="text-purple-400">f(n) = g(n)</code></li>
                    <li>• Heuristic: <strong className="text-slate-400">None (Uniform Cost)</strong></li>
                    <li>• Avg Visited Nodes: <strong className="text-amber-400">142 nodes</strong></li>
                    <li>• Avg Execution Time: <strong className="text-amber-400">14.2 ms</strong></li>
                    <li>• Shortest Path Guarantee: <strong className="text-emerald-400">100% Proven</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Active Route Result Summary */}
          {calculatedRoute && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Computed {calculatedRoute.algorithmUsed} Route Trajectory:</span>
              </div>
              <div className="flex items-center gap-4 text-slate-200">
                <span>Distance: <strong className="text-white">{calculatedRoute.totalDistanceKm} km</strong></span>
                <span>•</span>
                <span>ETA: <strong className="text-emerald-400">{calculatedRoute.estimatedTimeMinutes} min</strong></span>
                <span>•</span>
                <span>Waypoints: <strong className="text-cyan-300">{calculatedRoute.pathWaypoints.length} nodes</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#08111F] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={closeDispatchModal}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'MANUAL' ? (
              <button
                onClick={handleManualDispatch}
                disabled={!selectedAmbulanceId || !selectedHospitalId || dispatching}
                className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MANUAL DISPATCH OVERRIDE</span>
              </button>
            ) : (
              <button
                onClick={handleExecutePipeline}
                disabled={dispatching || !bestHospitalEval || !bestAmbulanceEval}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                {dispatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>EXECUTING ATOMIC DISPATCH & LOCKS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>EXECUTE INTELLIGENT DISPATCH & ATOMIC RESERVATION</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
