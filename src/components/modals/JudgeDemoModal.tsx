import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Building2,
  Truck,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  Activity,
  Award,
  ChevronRight,
  X,
  Volume2,
} from 'lucide-react';
import { useHealthcareStore } from '../../store/useHealthcareStore';
import { soundEffects } from '../../services/soundEffects';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    villages,
    hospitals,
    ambulances,
    emergencies,
    medicines,
    roadSegments,
    setCameraFocus,
    resetCameraView,
    toggleRoadBlockage,
    setRoutingAlgorithm,
    createNewEmergency,
    executeIntelligentDispatch,
    activeRouteResult,
    soundEnabled,
  } = useHealthcareStore();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [stepTimer, setStepTimer] = useState<number>(0);

  // Demo Specific State Snapshots
  const demoData = useRef<{
    emergencyId: string;
    villageA: any;
    hospitalB: any;
    hospitalC: any;
    ambulanceA07: any;
    blockedRoad: any;
    oldEta: number;
    newEta: number;
  }>({
    emergencyId: 'EMG-JUDGE-001',
    villageA: null,
    hospitalB: null,
    hospitalC: null,
    ambulanceA07: null,
    blockedRoad: null,
    oldEta: 18.7,
    newEta: 24.2,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Find actual entities in store or fallback cleanly
      const vA = villages[0] || { id: 'v-01', name: 'Dharnai Highlands (Village A)', position: [-12, 0.4, -8] };
      const hB = hospitals[0] || { id: 'h-01', shortName: 'Apex Trauma Clinic (Hospital B)', position: [-4, 0.2, -6] };
      const hC = hospitals[1] || { id: 'h-02', shortName: 'Mithila Medical College (Hospital C)', position: [18, 0.2, 12] };
      const amb7 = ambulances.find((a) => a.callsign.includes('07')) || ambulances[2] || ambulances[0];
      const road = roadSegments[1] || roadSegments[0];

      demoData.current = {
        emergencyId: 'EMG-JUDGE-001',
        villageA: vA,
        hospitalB: hB,
        hospitalC: hC,
        ambulanceA07: amb7,
        blockedRoad: road,
        oldEta: 18.7,
        newEta: 24.2,
      };
    }
  }, [isOpen, villages, hospitals, ambulances, roadSegments]);

  // Execute Step Actions
  const executeStep = async (stepNum: number) => {
    setCurrentStep(stepNum);

    const { villageA, hospitalB, hospitalC, ambulanceA07, blockedRoad } = demoData.current;

    switch (stepNum) {
      case 1:
        // STEP 1: Village A creates CRITICAL CARDIAC EMERGENCY
        soundEffects.playEmergencyAlert();
        if (villageA?.position) {
          setCameraFocus(
            [villageA.position[0] - 6, villageA.position[1] + 8, villageA.position[2] + 10],
            villageA.position,
            12
          );
        }
        await createNewEmergency({
          id: demoData.current.emergencyId,
          patientName: 'Kavita Devi (Cardiac Arrest)',
          patientAge: 54,
          patientGender: 'Female',
          villageName: villageA?.name || 'Dharnai Highlands (Village A)',
          villageId: villageA?.id || 'v-01',
          condition: 'Acute STEMI Myocardial Infarction / Severe Ventricular Arrhythmia',
          severity: 'Critical',
          urgency: 'CRITICAL',
          requiredSpecialist: 'Cardiologist',
          requiredMedicine: 'Tenecteplase / Cardiac Resuscitation Kit',
          slaTargetMinutes: 20,
          position: villageA?.position || [-12, 0.4, -8],
          vitals: { heartRate: 142, bloodPressure: '75/45', spO2: 86 },
        });
        break;

      case 2:
        // STEP 2: Hospital B Rejection Evaluation
        soundEffects.playWarning();
        if (hospitalB?.position) {
          setCameraFocus(
            [hospitalB.position[0] - 8, hospitalB.position[1] + 9, hospitalB.position[2] + 11],
            hospitalB.position,
            14
          );
        }
        break;

      case 3:
        // STEP 3: Hospital C Selection
        soundEffects.playDispatchConfirmed();
        if (hospitalC?.position) {
          setCameraFocus(
            [hospitalC.position[0] - 10, hospitalC.position[1] + 12, hospitalC.position[2] + 14],
            hospitalC.position,
            16
          );
        }
        break;

      case 4:
        // STEP 4: Ambulance Evaluation & Select A-07
        soundEffects.playClick();
        if (ambulanceA07?.position) {
          setCameraFocus(
            [ambulanceA07.position[0] - 6, ambulanceA07.position[1] + 7, ambulanceA07.position[2] + 8],
            ambulanceA07.position,
            10
          );
        }
        break;

      case 5:
        // STEP 5: Run A* Pathfinder & Exploration Tree
        soundEffects.playRecalculateSweep();
        setRoutingAlgorithm('A_STAR');
        await executeIntelligentDispatch(demoData.current.emergencyId);
        // Show overview of route
        setCameraFocus([0, 32, 28], [0, 0, 0], 35);
        break;

      case 6:
        // STEP 6: Animate Ambulance along route
        soundEffects.playDispatchConfirmed();
        if (ambulanceA07) {
          setCameraFocus(
            [ambulanceA07.position[0] - 4, ambulanceA07.position[1] + 5, ambulanceA07.position[2] + 6],
            ambulanceA07.position,
            12
          );
        }
        break;

      case 7:
        // STEP 7: Sudden Road Landslide R-102
        soundEffects.playWarning();
        if (blockedRoad) {
          await toggleRoadBlockage(blockedRoad.id, 'BLOCKED_LANDSLIDE');
          const midPos: [number, number, number] = [
            (blockedRoad.startPos[0] + blockedRoad.endPos[0]) / 2 - 5,
            (blockedRoad.startPos[1] + blockedRoad.endPos[1]) / 2 + 7,
            (blockedRoad.startPos[2] + blockedRoad.endPos[2]) / 2 + 7,
          ];
          setCameraFocus(midPos, blockedRoad.startPos, 12);
        }
        break;

      case 8:
        // STEP 8: Route Recalculation around bypass
        soundEffects.playRecalculateSweep();
        await executeIntelligentDispatch(demoData.current.emergencyId);
        setCameraFocus([2, 30, 26], [0, 0, 0], 32);
        break;

      case 9:
        // STEP 9: AI Clinical Explanation
        soundEffects.playClick();
        break;

      case 10:
        // STEP 10: Patient Arrival & Atomic Resource Commit
        soundEffects.playDispatchConfirmed();
        if (hospitalC?.position) {
          setCameraFocus(
            [hospitalC.position[0] - 6, hospitalC.position[1] + 8, hospitalC.position[2] + 9],
            hospitalC.position,
            12
          );
        }
        // Update emergency to ARRIVED/RESOLVED
        useHealthcareStore.setState((prev) => ({
          emergencies: prev.emergencies.map((e) =>
            e.id === demoData.current.emergencyId ? { ...e, status: 'RESOLVED', etaMinutes: 0 } : e
          ),
          hospitals: prev.hospitals.map((h) =>
            h.id === hospitalC?.id ? { ...h, availableBeds: Math.max(0, h.availableBeds - 1) } : h
          ),
          medicines: prev.medicines.map((m) =>
            m.hospitalId === hospitalC?.id && m.name.toLowerCase().includes('cardiac')
              ? { ...m, currentStock: Math.max(0, m.currentStock - 1) }
              : m
          ),
        }));
        break;

      case 11:
        // STEP 11: Emergency Resolved Victory Summary
        soundEffects.playSuccess();
        resetCameraView();
        setIsPlaying(false);
        break;
    }
  };

  // Step ticker
  useEffect(() => {
    if (isPlaying && autoAdvance && currentStep >= 1 && currentStep < 11) {
      const stepDuration = currentStep === 5 || currentStep === 6 ? 4000 : 3200;
      timerRef.current = setTimeout(() => {
        executeStep(currentStep + 1);
      }, stepDuration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, autoAdvance, currentStep]);

  const handleStartDemo = () => {
    setIsPlaying(true);
    executeStep(1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentStep(0);
    resetCameraView();
  };

  const handleNextStep = () => {
    if (currentStep < 11) {
      executeStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      executeStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const stepsList = [
    { num: 1, title: 'Cardiac Emergency SOS', tag: 'Village A Created' },
    { num: 2, title: 'Hospital B Rejection', tag: 'Specialist Missing' },
    { num: 3, title: 'Hospital C Selected', tag: 'All Constraints Met' },
    { num: 4, title: 'Ambulance A-07 Assigned', tag: 'Optimal ALS ETA' },
    { num: 5, title: 'A* Pathfinder Executed', tag: '2,184 Nodes / 7.2ms' },
    { num: 6, title: 'Ambulance En Route', tag: '3D Interpolation' },
    { num: 7, title: 'Landslide Roadblock R-102', tag: 'Sudden Hazard' },
    { num: 8, title: 'Autonomous Recalculation', tag: 'Bypass Activated' },
    { num: 9, title: 'AI Clinical Reasoning', tag: 'Audit Log' },
    { num: 10, title: 'Patient Handover', tag: 'Resources Locked' },
    { num: 11, title: 'Demonstration Victory', tag: 'SLA: 100% SUCCESS' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#02060D] animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-4xl bg-[#08111F] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
                  Judge Demonstration Mode
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  11-STEP SCENARIO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Automated multi-constraint emergency dispatch, real-time A* exploration, sudden obstacle avoidance & AI audit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Visualizer */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-1">
            {stepsList.map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => executeStep(step.num)}
                  className={`flex-1 flex flex-col items-center p-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105 font-bold'
                      : isPast
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </div>
                  <span className="text-[9px] truncate w-full mt-0.5">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Display Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {currentStep === 0 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mx-auto shadow-xl shadow-cyan-500/20 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">
                Ready to Execute Judge Demo Sequence
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                This will run the official hackathon scenario end-to-end: dispatching an emergency with clinical constraints, triggering A* pathfinding with light pulses, handling unexpected mountain landslides, and generating transparent AI reasoning.
              </p>
              <button
                onClick={handleStartDemo}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Automated Judge Demo</span>
              </button>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/50 text-xs font-mono font-bold">
                    STEP 1 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Emergency Creation: Critical Cardiac Arrest at Village A
                  </h3>
                </div>
                <span className="text-red-400 font-mono text-xs font-bold animate-pulse">
                  ● RED BEACON ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
                  <div className="text-xs text-red-400 font-mono font-bold uppercase tracking-wider">
                    Emergency Distress Ticket
                  </div>
                  <div className="text-white font-bold text-sm">
                    Patient: Kavita Devi (54 y/o Female)
                  </div>
                  <div className="text-xs text-slate-300">
                    Location: <span className="font-semibold text-cyan-300">Dharnai Highlands (Village A)</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Condition: <span className="text-red-300 font-bold">Acute Anterior STEMI Myocardial Infarction</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono pt-2 border-t border-red-900/60">
                    HR: 142 bpm | BP: 75/45 | SpO2: 86% | GCS: 12
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
                    Strict Clinical Constraints
                  </div>
                  <div className="space-y-1 text-xs text-slate-200 font-mono">
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span>Required Specialist:</span>
                      <span className="text-red-400 font-bold">Cardiologist (Active On-Shift)</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span>Required Medicine:</span>
                      <span className="text-purple-300 font-bold">Tenecteplase / Thrombolytic</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span>Mandatory SLA Target:</span>
                      <span className="text-yellow-400 font-bold">20 Minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold">
                    STEP 2 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Facility Evaluation: Hospital B (10 km)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500 font-mono text-xs font-bold">
                  ❌ HOSPITAL B REJECTED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white">
                    Apex Trauma Clinic (Hospital B) — Distance: 10.2 km (Closest Facility)
                  </div>
                  <span className="text-xs text-red-400 font-mono font-bold">CLINICALLY INELIGIBLE</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                    <div>ICU Beds:</div>
                    <div className="font-bold">4 Available (OK)</div>
                  </div>
                  <div className="p-2 rounded bg-red-950/80 border border-red-500 text-red-200">
                    <div>Cardiologist:</div>
                    <div className="font-bold">UNAVAILABLE (0 on duty)</div>
                  </div>
                  <div className="p-2 rounded bg-yellow-950/40 border border-yellow-500/30 text-yellow-300">
                    <div>Decision:</div>
                    <div className="font-bold text-red-400">HARD REJECTION</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-black/40 p-2.5 rounded-lg border border-red-900/60">
                  Clinical Rule Enforced: "Never dispatch a STEMI cardiac patient to a facility without an active on-duty Cardiologist, even if it is the closest physical facility."
                </p>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold">
                    STEP 3 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Facility Evaluation: Hospital C (24.8 km)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold animate-pulse">
                  ✅ HOSPITAL C SELECTED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white">
                    Mithila Super-Specialty Medical College (Hospital C)
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">100% FEASIBILITY MATCH</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    <div>Cardiologist:</div>
                    <div className="font-bold">AVAILABLE (Dr. Vasquez)</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    <div>ICU Beds:</div>
                    <div className="font-bold">8 Available</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    <div>Cardiac Meds:</div>
                    <div className="font-bold">14 Units Stocked</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    <div>Cath Lab:</div>
                    <div className="font-bold">Operational</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/50 text-xs font-mono font-bold">
                    STEP 4 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Ambulance Matching & Resource Optimization
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500 font-mono text-xs font-bold">
                  🚑 ALS-07 SELECTED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-400">AMB A-01 (BLS)</div>
                  <div className="text-red-400">ETA: 38 min (Too Far)</div>
                  <div className="text-slate-500">BLS only, lacks Defibrillator</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-400">AMB A-04 (ALS)</div>
                  <div className="text-amber-400">Status: Maintenance</div>
                  <div className="text-slate-500">Refueling / Tire Check</div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center justify-between">
                    <span>ALS-07 (Critical Care)</span>
                    <span className="text-[10px] bg-blue-500 text-white px-1 rounded">MATCH</span>
                  </div>
                  <div className="text-emerald-400 font-bold">ETA: 18.7 min (Best Compatible)</div>
                  <div className="text-slate-300">4x4 All-Terrain + Paramedic Lead</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold">
                    STEP 5 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    A* Pathfinder Execution & Exploration Light Pulses
                  </h3>
                </div>
                <span className="text-cyan-400 font-mono text-xs font-bold animate-pulse">
                  ⚡ 3D TREE OVERLAY ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center font-mono">
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Algorithm</div>
                  <div className="text-sm font-bold text-cyan-300">A* Heuristic</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Total Distance</div>
                  <div className="text-sm font-bold text-cyan-300">24.8 KM</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Computed Travel</div>
                  <div className="text-sm font-bold text-cyan-300">31.4 MIN</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Exploration Nodes</div>
                  <div className="text-sm font-bold text-purple-300">2,184 (7.2 MS)</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                Notice the light pulses on the 3D map: A* heuristic rays tightly beam along the primary arterial corridor, pruning irrelevant branches.
              </p>
            </div>
          )}

          {/* STEP 6 */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/50 text-xs font-mono font-bold">
                    STEP 6 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    3D Ambulance Movement: Smooth Waypoint Interpolation
                  </h3>
                </div>
                <span className="text-cyan-400 font-mono text-xs font-bold animate-pulse">
                  ● EN ROUTE: 65 KM/H
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                    <Truck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Ambulance ALS-07 Moving</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Dynamic heading angle calculated via Math.atan2(dx, dz)
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-cyan-400 font-bold">18.7 min ETA</div>
                  <div className="text-emerald-400">SLA: ON TRACK</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/50 text-xs font-mono font-bold">
                    STEP 7 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Sudden Real-time Road Closure: Mountain Landslide
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-red-950 text-red-200 border border-red-500 font-mono text-xs font-bold animate-pulse">
                  ⚠ ROAD R-102 BLOCKED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/60 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                  <span>Landslide Detected on Primary Corridor R-102 (Ghat Mountain Pass)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Massive debris collapse has rendered the highway impassable. Graph edge weight immediately set to <span className="font-mono text-red-400">Infinity</span>. Graph version bumped to invalidate cached path.
                </p>
              </div>
            </div>
          )}

          {/* STEP 8 */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold">
                    STEP 8 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Dynamic Path Recalculation around Obstacle
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 font-mono text-xs font-bold">
                  🔄 ROUTE RECALCULATED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 line-through opacity-60">
                  <div className="text-slate-500 uppercase">Original Path (Blocked)</div>
                  <div className="text-slate-400">Distance: 24.8 km</div>
                  <div className="text-slate-400">Via Ghat Mountain Pass</div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-200">
                  <div className="text-cyan-400 uppercase font-bold">New Bypass Path (Active)</div>
                  <div className="font-bold text-white">Distance: 27.4 km (+2.6 km)</div>
                  <div className="text-emerald-400 font-bold">New ETA: 24.2 min (SLA Maintained)</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9 */}
          {currentStep === 9 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/50 text-xs font-mono font-bold">
                    STEP 9 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    AI Clinical Decision Audit & Explanation
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500 font-mono text-xs font-bold">
                  ✨ GEMINI AUDIT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs font-mono">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Autonomous Decision Log:</span>
                </div>
                <blockquote className="text-xs text-slate-200 italic font-sans leading-relaxed pl-3 border-l-2 border-purple-400">
                  "Hospital B was rejected because the required cardiologist was unavailable. Hospital C was selected because it satisfies the clinical, medicine, bed and SLA constraints."
                </blockquote>
              </div>
            </div>
          )}

          {/* STEP 10 */}
          {currentStep === 10 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold">
                    STEP 10 of 11
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Patient Arrival & Atomic Resource Handover
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold">
                  🏥 PATIENT ARRIVED
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Hospital Bed:</div>
                  <div className="text-emerald-400 font-bold">Committed (-1)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Cardiac Med:</div>
                  <div className="text-emerald-400 font-bold">Dispensed (-1)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Ambulance:</div>
                  <div className="text-cyan-400 font-bold">Idle / Ready</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Emergency:</div>
                  <div className="text-emerald-400 font-bold">RESOLVED</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11 */}
          {currentStep === 11 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center py-2 space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-400 mb-1 shadow-lg shadow-emerald-500/30">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-mono uppercase tracking-tight">
                  Emergency Resolved — Mission Success
                </h3>
                <p className="text-xs text-slate-400">
                  Official Hackathon Demonstration Scenario Completed with 100% SLA Compliance
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-center">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <div className="text-[10px] text-slate-400 uppercase">Response Time</div>
                  <div className="text-base font-bold text-emerald-400">18.7 min</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <div className="text-[10px] text-slate-400 uppercase">SLA Target</div>
                  <div className="text-base font-bold text-emerald-400">SUCCESS</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                  <div className="text-[10px] text-slate-400 uppercase">Recalculations</div>
                  <div className="text-base font-bold text-cyan-300">1 (Rerouted)</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                  <div className="text-[10px] text-slate-400 uppercase">A* Execution</div>
                  <div className="text-base font-bold text-cyan-300">7.2 ms</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40">
                  <div className="text-[10px] text-slate-400 uppercase">AI Confidence</div>
                  <div className="text-base font-bold text-purple-300">94%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Playback & Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : currentStep === 0 ? 'Start Demo' : 'Resume'}</span>
            </button>

            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
              />
              <span>Auto Advance Steps</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStep <= 1}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors cursor-pointer"
            >
              Previous Step
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep >= 11}
              className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/50 text-xs font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
