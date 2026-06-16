"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function TrackParticles({ color, count = 600, phase = 0 }: {
  color: string; count?: number; phase?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 5 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 1.5;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05 + phase;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.03 + phase) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial color={color} size={0.02} sizeAttenuation depthWrite={false} transparent opacity={0.5} />
    </Points>
  );
}

function GlowRing({ color, radius = 3, y = 0 }: { color: string; radius?: number; y?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={ref} position={[0, y, 0]}>
      <torusGeometry args={[radius, 0.02, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

export function CreateScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <TrackParticles color="#C580FF" count={700} phase={0} />
      <TrackParticles color="#7B2FBE" count={300} phase={1} />
      <GlowRing color="#C580FF" radius={3} y={0} />
      <GlowRing color="#7B2FBE" radius={4.5} y={1} />
    </Canvas>
  );
}

export function BuildScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <TrackParticles color="#6BB5FF" count={700} phase={2} />
      <TrackParticles color="#1A6EBF" count={300} phase={3} />
      <GlowRing color="#6BB5FF" radius={3} y={0} />
      <GlowRing color="#1A6EBF" radius={4.5} y={-1} />
    </Canvas>
  );
}

export function ScaleScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <TrackParticles color="#F0C550" count={700} phase={4} />
      <TrackParticles color="#F0A500" count={300} phase={5} />
      <GlowRing color="#F0C550" radius={3} y={0} />
      <GlowRing color="#F0A500" radius={4.5} y={1} />
    </Canvas>
  );
}
