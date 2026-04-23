import { Canvas } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { RobotExpressive } from "@/components/3d/RobotExpressive";

export function StickyScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 35 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />
      <Environment preset="city" />
      <Sparkles count={30} scale={4} size={1} speed={0.5} opacity={0.3} color="#3b82f6" />
      <Float speed={4} rotationIntensity={0.8} floatIntensity={2}>
        <RobotExpressive
          position={[0, -1.2, 0]}
          scale={0.7}
          initialAction="Jump"
          interactive={true}
        />
      </Float>
    </Canvas>
  );
}
