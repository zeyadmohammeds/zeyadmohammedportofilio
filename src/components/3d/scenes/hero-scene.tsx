import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Sparkles, Line, Sphere } from "@react-three/drei";
import { RobotExpressive } from "@/components/3d/RobotExpressive";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function BackgroundNodes() {
  const count = 6;
  const nodes = useMemo(() => 
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        -5 - Math.random() * 5
      ),
      speed: Math.random() * 0.5 + 0.2
    })), []);

  return (
    <group>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={1} floatIntensity={2}>
          <Sphere position={node.position} args={[0.15, 16, 16]}>
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
          </Sphere>
          {i > 0 && (
            <Line 
              points={[nodes[i-1].position, node.position]} 
              color="#3b82f6" 
              opacity={0.05} 
              transparent 
              lineWidth={1} 
            />
          )}
        </Float>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      shadows
      gl={{ alpha: true }}
      className="pointer-events-none"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[5, 5, 5]} intensity={2} color="#3b82f6" />
      <pointLight position={[-5, 2, -2]} intensity={1.5} color="#ffcc00" />
      
      <Environment preset="city" />
      
      <BackgroundNodes />
      
      {/* Volumetric ambient particles */}
      <Sparkles count={80} scale={10} size={1.5} speed={0.4} opacity={0.2} color="#ffffff" />
      
      <Float speed={3} rotationIntensity={0.8} floatIntensity={1.2}>
        <RobotExpressive
          position={[0, -1.8, 0]}
          scale={1.2}
          initialAction="Wave"
          interactive={true}
        />
      </Float>
      
      <ContactShadows position={[0, -3.2, 0]} opacity={0.4} scale={8} blur={2.5} far={4} />
    </Canvas>
  );
}
