import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Ambulance } from '../../types';
import { useHealthcareStore } from '../../store/useHealthcareStore';

interface Ambulance3DProps {
  ambulance: Ambulance;
  isSelected: boolean;
}

export const Ambulance3D: React.FC<Ambulance3DProps> = ({ ambulance, isSelected }) => {
  const selectEntity = useHealthcareStore((state) => state.selectEntity);
  const groupRef = useRef<THREE.Group>(null);
  const sirenRedRef = useRef<THREE.PointLight>(null);
  const sirenBlueRef = useRef<THREE.PointLight>(null);
  const rotorRef1 = useRef<THREE.Mesh>(null);
  const rotorRef2 = useRef<THREE.Mesh>(null);

  const isDrone = ambulance.type.includes('Drone');
  const isMoving = ambulance.status === 'Dispatched En Route' || ambulance.status === 'Transporting to Hospital';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Flashing emergency lightbar animation
    if (sirenRedRef.current && sirenBlueRef.current) {
      const redOn = Math.sin(t * 12) > 0;
      sirenRedRef.current.intensity = isMoving ? (redOn ? 2.5 : 0.1) : 0.2;
      sirenBlueRef.current.intensity = isMoving ? (!redOn ? 2.5 : 0.1) : 0.2;
    }

    // Drone rotor spin
    if (isDrone) {
      if (rotorRef1.current) rotorRef1.current.rotation.y += 0.4;
      if (rotorRef2.current) rotorRef2.current.rotation.y -= 0.4;
    }

    // Animated interpolation along waypoints if route exists
    if (isMoving && ambulance.routeWaypoints && ambulance.routeWaypoints.length > 1 && groupRef.current) {
      const pts = ambulance.routeWaypoints;
      const progress = (t * 0.12) % 1; // Loop along route
      const totalSegments = pts.length - 1;
      const exactIndex = progress * totalSegments;
      const segIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
      const segFraction = exactIndex - segIndex;

      const p1 = pts[segIndex];
      const p2 = pts[segIndex + 1];

      const curX = p1[0] + (p2[0] - p1[0]) * segFraction;
      const curY = p1[1] + (p2[1] - p1[1]) * segFraction + (isDrone ? 1.8 : 0.15);
      const curZ = p1[2] + (p2[2] - p1[2]) * segFraction;

      groupRef.current.position.set(curX, curY, curZ);

      // Rotate towards direction of motion
      const dirX = p2[0] - p1[0];
      const dirZ = p2[2] - p1[2];
      const angle = Math.atan2(dirX, dirZ);
      groupRef.current.rotation.y = angle;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectEntity('AMBULANCE', ambulance.id, ambulance);
  };

  const statusColor =
    ambulance.status === 'Dispatched En Route'
      ? '#EF4444'
      : ambulance.status === 'At Scene / Patient Loading'
      ? '#F59E0B'
      : ambulance.status === 'Transporting to Hospital'
      ? '#8B5CF6'
      : '#22C55E';

  return (
    <group
      ref={groupRef}
      position={[
        ambulance.position[0],
        ambulance.position[1] + (isDrone ? 1.8 : 0.2),
        ambulance.position[2],
      ]}
      onClick={handleClick}
    >
      {isDrone ? (
        /* eVTOL Emergency Drone Mesh */
        <group>
          {/* Drone Body / Fuselage */}
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.25, 0.9]} />
            <meshStandardMaterial color="#E0F2FE" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Cargo Payload Bay (Red Cross) */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.45, 0.25, 0.45]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.5} />
          </mesh>
          {/* 4 Carbon fiber motor arms */}
          <mesh position={[0.5, 0.1, 0.5]} ref={rotorRef1}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.5, 0.1, -0.5]} ref={rotorRef2}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.5, 0.1, -0.5]}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.5, 0.1, 0.5]}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
        </group>
      ) : (
        /* 4x4 / ALS Ambulance Vehicle Mesh */
        <group>
          {/* Vehicle Main Body */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.9, 0.65, 1.8]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Cabin Windshield */}
          <mesh position={[0, 0.45, 0.6]}>
            <boxGeometry args={[0.82, 0.35, 0.4]} />
            <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Red Side Emergency Stripe */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.92, 0.14, 1.7]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.4} />
          </mesh>
          {/* 4 Rubber Heavy-Duty Wheels */}
          <mesh position={[-0.48, 0.12, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh position={[0.48, 0.12, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh position={[-0.48, 0.12, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh position={[0.48, 0.12, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>

          {/* Roof Siren Lightbar */}
          <mesh position={[0, 0.72, 0.1]}>
            <boxGeometry args={[0.6, 0.1, 0.2]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>
      )}

      {/* Flashing Siren Lights */}
      <pointLight ref={sirenRedRef} position={[-0.2, 0.85, 0.1]} color="#EF4444" distance={5} intensity={1} />
      <pointLight ref={sirenBlueRef} position={[0.2, 0.85, 0.1]} color="#3B82F6" distance={5} intensity={1} />

      {/* Selected Tactical Circle Indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 2.5D HTML Callsign Badge */}
      <Html
        position={[0, 1.6, 0]}
        center
        distanceFactor={28}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className={`px-2 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition-all duration-200 border shadow-lg ${
            isSelected
              ? 'bg-blue-950/95 border-blue-400 text-blue-100 scale-110 shadow-blue-500/40'
              : 'bg-slate-950/85 border-slate-700/80 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor }}
            />
            <span>{ambulance.callsign.split(' ')[0]}</span>
            {ambulance.estimatedArrivalMinutes && (
              <span className="text-cyan-400 font-bold bg-cyan-950/80 px-1 rounded border border-cyan-500/40">
                {ambulance.estimatedArrivalMinutes}m ETA
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
