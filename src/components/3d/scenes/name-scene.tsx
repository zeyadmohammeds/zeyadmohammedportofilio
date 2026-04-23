import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Text, PresentationControls } from "@react-three/drei";

export function NameScene({ theme }: { theme: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 40 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
      >
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Text
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
            fontSize={2.5}
            color={theme === "dark" ? "#ffffff" : "#000000"}
            maxWidth={10}
            lineHeight={0.75}
            letterSpacing={-0.08}
            textAlign="left"
            anchorX="left"
            anchorY="middle"
          >
            ZEYAD{"\n"}MOHAMMED
          </Text>
        </Float>
      </PresentationControls>
      <ContactShadows
        position={[0, -4.5, 0]}
        opacity={0.4}
        scale={20}
        blur={1.75}
        far={4.5}
      />
    </Canvas>
  );
}
