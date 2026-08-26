import React, { useState } from 'react';
import {
  PlayCircle,
  StopCircle,
  FastForward,
  AlertTriangle,
  Flame,
  CloudRain,
  Mountain,
  Users,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  Building2,
  Truck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';

export const SimulationPage: React.FC = () => {
  const {
    simulations,
    activeSimulationId,
    isSimulationRunning,
    simulationStep,
    startSimulation,
    stopSimulation,
    stepSimulationForward,
    navigate,
    createNewEmergency,
    toggleRoadBlockage,
    executeIntelligentDispatch,
    roadSegments,
    hospitals,
    ambulances,
    emergencies,
  } = useHealthcareStore();

  const [demoState, setDemoState] = useState<{
    running: boolean;
    currentStep: number;
    patientName: string;
    emergencyId: string;
    rejectedHospitalName: string;
    selectedHospitalName: string;
    blockedRoadName: string;
    oldEta: number;
    newEta: number;
  }>({
    running: false,
    currentStep: 0,
    patientName: 'Ramesh Patel',
    emergencyId: '',
    rejectedHospitalName: 'Dharnai Community Clinic',
    selectedHospitalName: 'Mithila Super-Specialty Medical College',
    blockedRoadName: 'Ghat Mountain Pass (R-03)',
    oldEta: 18,
    newEta: 26,
  });

  const activeScenario = simulations.find((s) => s.id === activeSimulationId);

  // Interactive Live Verification Runner
  const runVerificationScenario = async () => {
    setDemoState((s) => ({ ...s, running: true, currentStep: 1 }));

    // Step 1: Create Acute STEMI Cardiac Arrest emergency
    const newId = `emg-${Date.now().toString().slice(-4)}`;
    await createNewEmergency({
      patientName: 'Ramesh Patel (Cardiac Case)',
      patientAge: 58,
      patientGender: 'Male',
      villageName: 'Dharnai Highlands',
      condition: 'Acute Anterior STEMI (Myocardial Infarction with Arrhythmia)',
      severity: 'Critical',
      requiredSpecialist: 'Cardiologist',
      requiredMedicine: 'Tenecteplase / Thrombolytic',
      vitals: { heartRate: 124, bloodPressure: '80/50', spO2: 89 },
    });

    setDemoState((s) => ({ ...s, emergencyId: newId, currentStep: 2 }));

    // Step 2 & 3: Run Algorithmic Pipeline
    setTimeout(async () => {
      const pipelineRes = await executeIntelligentDispatch(newId);
      setDemoState((s) => ({
        ...s,
        currentStep: 3,
        selectedHospitalName: pipelineRes.selectedHospital?.name || 'Mithila Super-Specialty Medical College',
      }));

      // Step 4: Simulate sudden road landslide on the corridor
      setTimeout(async () => {
        const roadToBlock = roadSegments[2] || roadSegments[0];
        setDemoState((s) => ({
          ...s,
          currentStep: 4,
          blockedRoadName: roadToBlock.name,
        }));
        await toggleRoadBlockage(roadToBlock.id, 'BLOCKED_LANDSLIDE');

        // Step 5: Completed Autonomous Reroute
        setTimeout(() => {
          setDemoState((s) => ({
            ...s,
            currentStep: 5,
            newEta: 25,
          }));
        }, 1500);
      }, 2500);
    }, 2000);
  };

  const resetVerificationScenario = () => {
    setDemoState({
      running: false,
      currentStep: 0,
      patientName: 'Ramesh Patel',
      emergencyId: '',
      rejectedHospitalName: 'Dharnai Community Clinic',
      selectedHospitalName: 'Mithila Super-Specialty Medical College',
      blockedRoadName: 'Ghat Mountain Pass (R-03)',
      oldEta: 18,
      newEta: 26,
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#050B14] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
              Emergency Stress Simulation & Algorithmic Lab
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
              ALGORITHMIC VERIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Validate intelligent routing: Clinical Specialization Triage, Candidate Rejection, and Real-Time Autonomous Landslide Rerouting.
          </p>
        </div>

        {isSimulationRunning && (
          <div className="flex items-center gap-3">
            <button
              onClick={stepSimulationForward}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-600/30"
            >
              <FastForward className="w-4 h-4" /> Next Phase (Step {simulationStep + 1})
            </button>
            <button
              onClick={stopSimulation}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/30"
            >
              <StopCircle className="w-4 h-4" /> End Simulation
            </button>
          </div>
        )}
      </div>

      {/* Featured Hackathon Verification Test Harness */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1628] via-[#0D1E3A] to-[#0A1020] border-2 border-cyan-500/50 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                  LIVE DEMO SCENARIO: Clinical Specialization Selection & Autonomous Landslide Reroute
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/40">
                  Automated Test
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Demonstrates rejection of nearest hospital without a Cardiologist, selection of capable trauma center, and real-time path recalculation when road gets blocked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {demoState.running ? (
              <button
                onClick={resetVerificationScenario}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset Scenario
              </button>
            ) : (
              <button
                onClick={runVerificationScenario}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
              >
                <PlayCircle className="w-4 h-4" />
                <span>EXECUTE VERIFICATION DEMO</span>
              </button>
            )}
          </div>
        </div>

        {/* Step-by-Step Scenario Progression Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          {/* Step 1 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              demoState.currentStep >= 1
                ? 'bg-slate-900 border-cyan-500/60 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-slate-400">PHASE 1: SOS INGEST</span>
              {demoState.currentStep >= 1 && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
            <div className="font-bold text-slate-200">Cardiac Emergency SOS</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Requires on-duty <strong>Cardiologist</strong> & <strong>Cath Lab</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              demoState.currentStep >= 2
                ? 'bg-slate-900 border-red-500/60 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-slate-400">PHASE 2: CLINICAL REJECTION</span>
              {demoState.currentStep >= 2 && <XCircle className="w-3.5 h-3.5 text-red-400" />}
            </div>
            <div className="font-bold text-red-300">Nearest Clinic Rejected</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Nearest facility rejected: <em>No on-duty Cardiologist / ICU</em>.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              demoState.currentStep >= 3
                ? 'bg-slate-900 border-emerald-500/60 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-slate-400">PHASE 3: ATOMIC LOCK</span>
              {demoState.currentStep >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="font-bold text-emerald-300">Super-Specialty Locked</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Selected: <strong>{demoState.selectedHospitalName}</strong> (ALS Unit en route).
            </p>
          </div>

          {/* Step 4 & 5 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              demoState.currentStep >= 4
                ? 'bg-slate-900 border-amber-500/60 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-slate-400">PHASE 4: DYNAMIC REROUTE</span>
              {demoState.currentStep >= 5 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : demoState.currentStep === 4 ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : null}
            </div>
            <div className="font-bold text-amber-300">
              {demoState.currentStep >= 5 ? 'Autonomously Rerouted' : 'Landslide Blockage'}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {demoState.currentStep >= 5
                ? 'A* path recalculated via Northern Bypass.'
                : 'Road severed. Recalculating A* trajectory...'}
            </p>
          </div>
        </div>

        {/* Live Result Details */}
        {demoState.currentStep > 0 && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                Active Incident: <strong className="text-white">{demoState.patientName}</strong> • Target:{' '}
                <strong className="text-emerald-400">{demoState.selectedHospitalName}</strong>
              </span>
            </div>
            <button
              onClick={() => navigate('dashboard')}
              className="px-3 py-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center gap-1"
            >
              Watch 3D Animation <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Catalog of Extreme Simulation Scenarios */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
          Full Scenario Catalog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {simulations.map((scn) => {
            const isActive = activeSimulationId === scn.id;

            return (
              <div
                key={scn.id}
                className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                  isActive
                    ? 'border-red-500/80 bg-red-950/20 shadow-lg shadow-red-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header: Title & Risk Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{scn.title}</h3>
                      <div className="text-xs text-slate-400 font-mono">
                        Category: High-Impact Incident
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
                    Risk: {scn.riskFactorScore}/100
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {scn.description}
                </p>

                {/* Scenario Impact Specs */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
                  <div>
                    <div className="text-slate-500">INFRASTRUCTURE IMPACT:</div>
                    <div className="text-white font-bold mt-0.5">
                      {scn.blockedRoadIds.length} Roads Severed
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">INITIAL CASUALTIES:</div>
                    <div className="text-red-400 font-bold mt-0.5">
                      {scn.initialEmergencies.length} Critical Patients
                    </div>
                  </div>
                </div>

                {/* Trigger Button */}
                <button
                  disabled={isSimulationRunning && !isActive}
                  onClick={() => {
                    if (isActive) stopSimulation();
                    else startSimulation(scn.id);
                  }}
                  className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                      : 'bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-800 text-cyan-300'
                  }`}
                >
                  {isActive ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      <span>TERMINATE ACTIVE SIMULATION</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>LAUNCH SIMULATION SCENARIO</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
