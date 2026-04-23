import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Points, PointMaterial } from "@react-three/drei";

export function HeroScene() {
  const ref = useRef<THREE.Points>(null);

  const sphere = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 5 + Math.random() * 2;
    sphere[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    sphere[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    sphere[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4f46e5"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
