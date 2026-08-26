import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TerrainEnvironmentProps {
  dayNightMode: 'NIGHT_TACTICAL' | 'DAY_SATELLITE' | 'DUSK_SURVEILLANCE';
  showAtmosphericFog: boolean;
  showTerrainRelief: boolean;
}

export const TerrainEnvironment: React.FC<TerrainEnvironmentProps> = ({
  dayNightMode,
  showAtmosphericFog,
  showTerrainRelief,
}) => {
  // Generate terrain geometry with height variance (hills, river valleys, mountain ridges)
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 64, 64);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Calculate realistic elevation
      const mountainNoise = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 1.8;
      const ridgeNoise = Math.sin((x + y) * 0.12) * 1.2;
      const riverBed = Math.exp(-Math.pow((x - y * 0.5) * 0.1, 2)) * -1.5;
      
      let elevation = mountainNoise + ridgeNoise + riverBed;
      if (elevation < -0.8) elevation = -0.8;
      
      pos.setZ(i, elevation); // Plane is oriented along Z before rotation
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  const gridColor =
    dayNightMode === 'NIGHT_TACTICAL'
      ? '#0E7490'
      : dayNightMode === 'DUSK_SURVEILLANCE'
      ? '#7C3AED'
      : '#0284C7';

  const terrainColor =
    dayNightMode === 'NIGHT_TACTICAL'
      ? '#08111F'
      : dayNightMode === 'DUSK_SURVEILLANCE'
      ? '#111827'
      : '#0F172A';

  return (
    <group>
      {/* Fog */}
      {showAtmosphericFog && (
        <fog
          attach="fog"
          args={[
            dayNightMode === 'NIGHT_TACTICAL'
              ? '#050B14'
              : dayNightMode === 'DUSK_SURVEILLANCE'
              ? '#0A0E17'
              : '#0C192E',
            25,
            90,
          ]}
        />
      )}

      {/* Main Ground Mesh with elevation */}
      <mesh
        geometry={terrainGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={terrainColor}
          roughness={0.85}
          metalness={0.2}
          wireframe={!showTerrainRelief}
        />
      </mesh>

      {/* Tactical Coordinate Grid Overlay */}
      <gridHelper
        args={[80, 40, gridColor, '#1E293B']}
        position={[0, 0.02, 0]}
      />

      {/* Ambient Lighting */}
      <ambientLight intensity={dayNightMode === 'NIGHT_TACTICAL' ? 0.35 : 0.65} />
      
      {/* Directional Sunlight / Satellite Scanner Light */}
      <directionalLight
        position={[25, 45, 20]}
        intensity={dayNightMode === 'NIGHT_TACTICAL' ? 0.8 : 1.4}
        color={dayNightMode === 'NIGHT_TACTICAL' ? '#38BDF8' : '#F8FAFC'}
        castShadow
      />
      
      {/* Tactical Blue Rim Light from Opposite Corner */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={0.5}
        color="#818CF8"
      />
    </group>
  );
};
