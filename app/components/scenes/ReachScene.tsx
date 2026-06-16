"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function NetworkParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(Math.min(count, 2000) * 3);
    for (let i = 0; i < Math.min(count, 2000); i++) {
      const r = Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  const displayCount = Math.min(count, 2000);

  return (
    <Points
      ref={ref}
      positions={positions.slice(0, displayCount * 3)}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        color="#00F5FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.7}
      />
    </Points>
  );
}

export default function ReachScene({ targetCount }: { targetCount: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }} gl={{ antialias: true, alpha: true }}>
      <NetworkParticles count={targetCount} />
    </Canvas>
  );
}
