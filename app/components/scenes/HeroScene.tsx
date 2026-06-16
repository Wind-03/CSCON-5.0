"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingParticles({ color, count = 800, spread = 8, speed = 0.3 }: {
  color: string; count?: number; spread?: number; speed?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial color={color} size={0.015} sizeAttenuation depthWrite={false} transparent opacity={0.6} />
    </Points>
  );
}

function StreamLine({ color, offset = 0, radius = 2 }: { color: string; offset?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4 + offset;
      pos[i * 3] = Math.cos(t) * radius * (0.8 + Math.random() * 0.4);
      pos[i * 3 + 1] = (i / count) * 10 - 5;
      pos[i * 3 + 2] = Math.sin(t) * radius * (0.8 + Math.random() * 0.4);
    }
    return pos;
  }, [offset, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2 + offset;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial color={color} size={0.025} sizeAttenuation depthWrite={false} transparent opacity={0.8} />
    </Points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.05) * 0.5;
    state.camera.position.y = Math.cos(t * 0.08) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <StreamLine color="#39FF14" offset={0} radius={2.5} />
      <StreamLine color="#7B2FBE" offset={2.1} radius={2} />
      <StreamLine color="#00F5FF" offset={4.2} radius={1.8} />
      <FloatingParticles color="#39FF14" count={400} spread={12} speed={0.1} />
      <FloatingParticles color="#7B2FBE" count={200} spread={10} speed={0.15} />
      <FloatingParticles color="#00F5FF" count={150} spread={8} speed={0.08} />
      <CameraRig />
    </Canvas>
  );
}
