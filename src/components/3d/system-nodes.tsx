import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Sphere, Text, Trail } from "@react-three/drei";

interface NodeProps {
  position: [number, number, number];
  color: string;
  label: string;
}

function GlowingNode({ position, color, label }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>
      <Text position={[0, -0.6, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function DataParticle({
  start,
  end,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.elapsedTime * 0.5) % 1;
      ref.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function SystemArchitecture3D() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    }
  });

  const nodes = [
    { pos: new THREE.Vector3(-3, 0, 0), color: "#3b82f6", label: "Client (React)" },
    { pos: new THREE.Vector3(0, 1.5, -1), color: "#10b981", label: "API Gateway" },
    { pos: new THREE.Vector3(3, 0, 0), color: "#8b5cf6", label: "Database (Postgres)" },
    { pos: new THREE.Vector3(0, -1.5, -1), color: "#f59e0b", label: "Auth Service" },
  ];

  const lines = [
    [nodes[0].pos, nodes[1].pos],
    [nodes[1].pos, nodes[2].pos],
    [nodes[0].pos, nodes[3].pos],
    [nodes[3].pos, nodes[2].pos],
  ];

  return (
    <group ref={group}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <GlowingNode
          key={i}
          position={n.pos.toArray() as [number, number, number]}
          color={n.color}
          label={n.label}
        />
      ))}

      {/* Connections format */}
      {lines.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line[0], line[1]]}
          color="#ffffff"
          opacity={0.2}
          transparent
          lineWidth={1}
        />
      ))}

      {/* Data Flow Particles */}
      <DataParticle start={nodes[0].pos} end={nodes[1].pos} color="#60a5fa" />
      <DataParticle start={nodes[1].pos} end={nodes[2].pos} color="#34d399" />
      <DataParticle start={nodes[0].pos} end={nodes[3].pos} color="#a78bfa" />
      <DataParticle start={nodes[3].pos} end={nodes[2].pos} color="#fbbf24" />
    </group>
  );
}
