import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TerrainEnvironment } from './TerrainEnvironment';
import { InstancedVillageNodes } from './InstancedVillageNodes';
import { VillageNode } from './VillageNode';
import { InstancedHospitalNodes } from './InstancedHospitalNodes';
import { Ambulance3D } from './Ambulance3D';
import { EmergencyMarker } from './EmergencyMarker';
import { PharmacyNode } from './PharmacyNode';
import { InstancedRoadNetwork } from './InstancedRoadNetwork';
import { RoutePath } from './RoutePath';
import { RoutingAnalysisOverlay } from './RoutingAnalysisOverlay';
import { CameraController } from './CameraController';
import { MapHUDOverlay } from './MapHUDOverlay';
import { useHealthcareStore } from '../../store/useHealthcareStore';

export const CommandCenter3D: React.FC = () => {
  const {
    villages,
    hospitals,
    ambulances,
    emergencies,
    pharmacies,
    roadSegments,
    layers,
    activeRouteResult,
    selectedEntity,
  } = useHealthcareStore();

  const isDroneRoute = ambulances.some(
    (a) => a.type.includes('Drone') && a.status === 'Dispatched En Route'
  );

  const selectedVillage = villages.find((v) => selectedEntity?.type === 'VILLAGE' && selectedEntity.id === v.id);

  return (
    <div className="relative w-full h-full bg-[#050B14] overflow-hidden select-none">
      {/* 3D Map Canvas */}
      <Canvas
        camera={{ position: [0, 42, 38], fov: 45, near: 0.1, far: 250 }}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <CameraController />

          {/* Terrain & Atmospheric Lighting */}
          <TerrainEnvironment
            dayNightMode={layers.dayNightMode}
            showAtmosphericFog={layers.showAtmosphericFog}
            showTerrainRelief={layers.showTerrainRelief}
          />

          {/* Instanced Road Network for High Performance Scaling */}
          {layers.showRoadNetwork && <InstancedRoadNetwork roadSegments={roadSegments} />}

          {/* Active A* Route Path with Animated Particle Stream */}
          {activeRouteResult && (
            <>
              <RoutePath routeResult={activeRouteResult} isDrone={isDroneRoute} />
              {activeRouteResult.explorationTree && (
                <RoutingAnalysisOverlay
                  explorationTree={activeRouteResult.explorationTree}
                  visible={true}
                />
              )}
            </>
          )}

          {/* Instanced Village Settlements for High Performance Scaling to Thousands of Objects */}
          {layers.showVillages && (
            <>
              <InstancedVillageNodes villages={villages} />
              {/* Render detailed VillageNode wrapper specifically for selected village HTML label */}
              {selectedVillage && (
                <VillageNode
                  key={`selected-${selectedVillage.id}`}
                  village={selectedVillage}
                  isSelected={true}
                />
              )}
            </>
          )}

          {/* Instanced Hospitals & Trauma Centers */}
          {layers.showHospitals && <InstancedHospitalNodes hospitals={hospitals} />}

          {/* Pharmacies & Drone Landing Pads */}
          {pharmacies.map((pharmacy) => (
            <PharmacyNode
              key={pharmacy.id}
              pharmacy={pharmacy}
              isSelected={selectedEntity?.type === 'PHARMACY' && selectedEntity.id === pharmacy.id}
            />
          ))}

          {/* 3D Ambulances & eVTOL Medical Drones */}
          {layers.showAmbulances &&
            ambulances.map((ambulance) => (
              <Ambulance3D
                key={ambulance.id}
                ambulance={ambulance}
                isSelected={selectedEntity?.type === 'AMBULANCE' && selectedEntity.id === ambulance.id}
              />
            ))}

          {/* Live Emergency SOS Beacons */}
          {layers.showEmergencyBeacons &&
            emergencies
              .filter((e) => e.status !== 'RESOLVED')
              .map((emergency) => (
                <EmergencyMarker
                  key={emergency.id}
                  emergency={emergency}
                  isSelected={selectedEntity?.type === 'EMERGENCY' && selectedEntity.id === emergency.id}
                />
              ))}
        </Suspense>
      </Canvas>

      {/* Floating Tactical HUD Overlay Controls */}
      <MapHUDOverlay />
    </div>
  );
};
