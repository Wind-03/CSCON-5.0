"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Particle Field ──────────────────────────────────────
function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#39FF14"),
      new THREE.Color("#8B5CF6"),
      new THREE.Color("#3B82F6"),
      new THREE.Color("#F59E0B"),
      new THREE.Color("#06B6D4"),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.015;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.35}
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ── Convergence Streams ──────────────────────────────────
function Stream({ color, offsetX, offsetY }: { color: string; offsetX: number; offsetY: number }) {
  const ref = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.02) {
      pts.push(new THREE.Vector3(
        offsetX * (1 - t * t),
        offsetY * (1 - t * t),
        -15 + t * 15
      ));
    }
    return pts;
  }, [offsetX, offsetY]);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.LineBasicMaterial).opacity =
        0.4 + Math.sin(clock.getElapsedTime() * 2 + offsetX) * 0.25;
    }
  });

  return (
    <Line
      ref={ref as React.Ref<never>}
      points={points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.5}
    />
  );
}

// ── Floating Wireframe Shapes ────────────────────────────
function Floater({
  geometry,
  color,
  position,
  rotSpeed,
  phaseOffset,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  rotSpeed: [number, number];
  phaseOffset: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x += rotSpeed[0] * 0.016;
    ref.current.rotation.y += rotSpeed[1] * 0.016;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + phaseOffset) * 0.8;
    (ref.current.material as THREE.LineBasicMaterial).opacity =
      0.15 + Math.sin(t + phaseOffset) * 0.08;
  });

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <lineSegments ref={ref} position={position} geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={0.2} />
    </lineSegments>
  );
}

// ── Dynamic Lights ───────────────────────────────────────
function DynamicLights() {
  const greenRef = useRef<THREE.PointLight>(null);
  const purpleRef = useRef<THREE.PointLight>(null);
  const blueRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (greenRef.current) {
      greenRef.current.position.x = Math.sin(t) * 18;
      greenRef.current.position.y = Math.cos(t * 0.7) * 12 + 5;
    }
    if (purpleRef.current) {
      purpleRef.current.position.x = -18 + Math.cos(t * 0.8) * 10;
      purpleRef.current.position.y = Math.sin(t * 0.6) * 14;
    }
    if (blueRef.current) {
      blueRef.current.position.x = 18 + Math.sin(t * 0.9) * 8;
      blueRef.current.position.z = Math.cos(t * 0.5) * 6;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={greenRef} color="#39FF14" intensity={4} distance={80} position={[0, 10, 10]} />
      <pointLight ref={purpleRef} color="#8B5CF6" intensity={3} distance={80} position={[-18, -10, 5]} />
      <pointLight ref={blueRef} color="#3B82F6" intensity={3} distance={80} position={[18, -5, 5]} />
    </>
  );
}

// ── Grid Plane ───────────────────────────────────────────
function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -28, 0]}>
      <planeGeometry args={[250, 250, 50, 50]} />
      <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.025} />
    </mesh>
  );
}

// ── Camera Rig ───────────────────────────────────────────
function CameraRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  if (typeof window !== "undefined") {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  useFrame(() => {
    const sp = scrollProgress.current;
    camera.position.x += (mouse.current.x * 4 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current.y * 2 - sp * 25 - camera.position.y) * 0.04;
    camera.position.z = 32 - sp * 18;
    camera.lookAt(0, -sp * 10, 0);
  });

  return null;
}

// ── Main Export ──────────────────────────────────────────
export default function BackgroundScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const floaterDefs = useMemo(() => [
    { geo: new THREE.IcosahedronGeometry(3, 0), color: "#39FF14", pos: [-15, 8, -5] as [number, number, number], rot: [0.3, 0.5] as [number, number], phase: 0 },
    { geo: new THREE.OctahedronGeometry(2, 0), color: "#8B5CF6", pos: [18, -5, -8] as [number, number, number], rot: [0.4, 0.3] as [number, number], phase: 1.2 },
    { geo: new THREE.TetrahedronGeometry(2.5, 0), color: "#3B82F6", pos: [-20, -10, -3] as [number, number, number], rot: [0.2, 0.6] as [number, number], phase: 2.4 },
    { geo: new THREE.BoxGeometry(3, 3, 3), color: "#F59E0B", pos: [12, 12, -10] as [number, number, number], rot: [0.5, 0.4] as [number, number], phase: 3.6 },
    { geo: new THREE.IcosahedronGeometry(1.5, 0), color: "#06B6D4", pos: [25, 0, -6] as [number, number, number], rot: [0.3, 0.7] as [number, number], phase: 4.8 },
    { geo: new THREE.OctahedronGeometry(1.2, 0), color: "#39FF14", pos: [0, -18, -4] as [number, number, number], rot: [0.6, 0.2] as [number, number], phase: 0.8 },
    { geo: new THREE.TetrahedronGeometry(1.8, 0), color: "#8B5CF6", pos: [-25, 5, -12] as [number, number, number], rot: [0.4, 0.5] as [number, number], phase: 2.0 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 32], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#050505" }}
      >
        <CameraRig scrollProgress={scrollProgress} />
        <DynamicLights />
        <ParticleField />
        <Stream color="#8B5CF6" offsetX={-10} offsetY={6} />
        <Stream color="#3B82F6" offsetX={10} offsetY={-6} />
        <Stream color="#39FF14" offsetX={0} offsetY={0} />
        {floaterDefs.map((f, i) => (
          <Floater
            key={i}
            geometry={f.geo}
            color={f.color}
            position={f.pos}
            rotSpeed={f.rot}
            phaseOffset={f.phase}
          />
        ))}
        <GridPlane />
      </Canvas>
    </div>
  );
}