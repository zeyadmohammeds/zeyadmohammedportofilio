import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { useGraph, useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, useAnimations, Sparkles, Float, Ring, MeshDistortMaterial } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { RobotAction } from "@/lib/robot-state";

type ActionName = RobotAction;

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

interface RobotActionEvent extends Event {
  detail: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    FootL_1: THREE.Mesh;
    LowerLegL_1: THREE.Mesh;
    LegL: THREE.Mesh;
    LowerLegR_1: THREE.Mesh;
    LegR: THREE.Mesh;
    Head_2: THREE.Mesh;
    Head_3: THREE.Mesh;
    Head_4: THREE.Mesh;
    ArmL: THREE.Mesh;
    ShoulderL_1: THREE.Mesh;
    ArmR: THREE.Mesh;
    ShoulderR_1: THREE.Mesh;
    Torso_2: THREE.Mesh;
    Torso_3: THREE.Mesh;
    FootR_1: THREE.Mesh;
    HandR_1: THREE.SkinnedMesh;
    HandR_2: THREE.SkinnedMesh;
    HandL_1: THREE.SkinnedMesh;
    HandL_2: THREE.SkinnedMesh;
    Bone: THREE.Bone;
  };
  materials: {
    Grey: THREE.MeshStandardMaterial;
    Main: THREE.MeshStandardMaterial;
    Black: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type RobotExpressiveProps = React.ComponentProps<"group"> & {
  initialAction?: ActionName;
  idleAction?: ActionName;
  interactive?: boolean;
};

export function RobotExpressive({
  initialAction = "Wave",
  idleAction = "Idle",
  interactive = true,
  small = false,
  ...props
}: RobotExpressiveProps & { small?: boolean }) {
  const group = React.useRef<THREE.Group>(null);
  const emotionRef = React.useRef<"calm" | "excited" | "error">("calm");
  const lastActionAtRef = React.useRef<number>(Date.now());
  const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  // Advanced material effects
  useEffect(() => {
    if (materials.Main) {
      materials.Main.roughness = 0.1;
      materials.Main.metalness = 0.8;
    }
  }, [materials]);

  const [activeAction, setActiveAction] = useState<ActionName>(initialAction);

  // Smoothly blend animations
  useEffect(() => {
    if (actions[activeAction]) {
      lastActionAtRef.current = Date.now();
      actions[activeAction].reset().fadeIn(0.5).play();
      return () => {
        actions[activeAction]?.fadeOut(0.5);
      };
    }
  }, [activeAction, actions]);

  // Advanced Global Event listeners
  useEffect(() => {
    // 1st open: Wave -> Idle
    const timers: number[] = [];
    const initTimer = window.setTimeout(() => setActiveAction(idleAction), 3000);
    timers.push(initTimer);

    const onOffline = () => {
      emotionRef.current = "error";
      setActiveAction("Death");
    };

    const onOnline = () => {
      emotionRef.current = "excited";
      setActiveAction("Standing");
      timers.push(window.setTimeout(() => setActiveAction("ThumbsUp"), 1000));
      timers.push(window.setTimeout(() => setActiveAction(idleAction), 4000));
      timers.push(window.setTimeout(() => (emotionRef.current = "calm"), 4200));
    };

    const onRobotAction = ((e: RobotActionEvent) => {
      const actionName = e.detail as ActionName;
      if (actionName) {
        if (actionName === "Death" || actionName === "No") emotionRef.current = "error";
        if (actionName === "Yes" || actionName === "ThumbsUp" || actionName === "Dance")
          emotionRef.current = "excited";
        if (actionName === "Idle" || actionName === "Standing") emotionRef.current = "calm";
        setActiveAction(actionName);
        // Reset to idle after an emote, unless it's death
        if (actionName !== "Death" && actionName !== "Sitting") {
          timers.push(window.setTimeout(() => setActiveAction(idleAction), 3000));
          timers.push(window.setTimeout(() => (emotionRef.current = "calm"), 3200));
        }
      }
    }) as EventListener;

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    window.addEventListener("robot:action", onRobotAction);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("robot:action", onRobotAction);
    };
  }, [idleAction]);

  // Advanced: Emotional color shift & Glow
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      const sinceLastAction = Date.now() - lastActionAtRef.current;

      // Calculate scroll normalization (0 to 1)
      const scrollY = window.scrollY || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollNorm = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Float/intensity changes with emotional state.
      const emotionScale =
        emotionRef.current === "excited" ? 1.7 : emotionRef.current === "error" ? 0.55 : 1;
      group.current.position.y = Math.sin(t * (2 * emotionScale)) * 0.1 - 1.5 + scrollNorm * 0.8;

      // Base rotation reacts to pointer
      let targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;

      // Advanced: rotate character heavily based on scroll position!
      const scrollRotation = scrollNorm * Math.PI * 2;
      targetX -= scrollRotation;

      if (emotionRef.current === "excited") targetX += Math.sin(t * 4) * 0.14;
      if (emotionRef.current === "error") targetX *= 0.45;

      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.1);
      const targetPitch = emotionRef.current === "error" ? -targetY - 0.15 : -targetY;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetPitch, 0.1);

      // Advanced: Emotional color shift
      if (materials.Main) {
        const targetColor = new THREE.Color(
          emotionRef.current === "excited"
            ? "#ffcc00"
            : emotionRef.current === "error"
              ? "#ff3300"
              : "#ffffff",
        );
        materials.Main.color.lerp(targetColor, 0.05);
        if (emotionRef.current === "excited") {
          materials.Main.emissive.set("#ffcc00").multiplyScalar(Math.sin(t * 10) * 0.2 + 0.2);
        } else {
          materials.Main.emissive.set("#000000");
        }
      }

      // Idle expression loop: subtle emotes if user is inactive.
      if (sinceLastAction > 12000 && Math.random() > 0.996) {
        setActiveAction(Math.random() > 0.5 ? "Wave" : "Standing");
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    emotionRef.current = "excited";
    setActiveAction("Jump");
    window.setTimeout(() => {
      setActiveAction(idleAction);
      emotionRef.current = "calm";
    }, 2000);
  };

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onClick={handleClick}
      onPointerEnter={() => (document.body.style.cursor = interactive ? "pointer" : "auto")}
      onPointerLeave={() => (document.body.style.cursor = "auto")}
    >
      {/* ── Advanced Visual Effects Overlay ── */}
      <group position={[0, 1.5, 0]}>
        <Sparkles
          count={emotionRef.current === "excited" ? 60 : 20}
          scale={emotionRef.current === "excited" ? 4 : 2}
          size={emotionRef.current === "excited" ? 4 : 1.5}
          speed={emotionRef.current === "excited" ? 3 : 0.4}
          color={emotionRef.current === "excited" ? "#ffcc00" : "#3b82f6"}
          opacity={0.4}
        />
        
        {/* Holographic Ring HUD */}
        <Float speed={2} rotationIntensity={2} floatIntensity={0.5}>
          <Ring args={[2.2, 2.25, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial 
              color={emotionRef.current === "excited" ? "#ffcc00" : "#3b82f6"} 
              transparent 
              opacity={0.15} 
              side={THREE.DoubleSide} 
            />
          </Ring>
          <Ring args={[2.4, 2.42, 64]} rotation={[Math.PI / 2, 0.5, 0]}>
            <meshBasicMaterial 
              color={emotionRef.current === "excited" ? "#ffcc00" : "#3b82f6"} 
              transparent 
              opacity={0.08} 
              side={THREE.DoubleSide} 
            />
          </Ring>
        </Float>
      </group>

      <group name="Root_Scene">
        <group name="RootNode">
          <group name="RobotArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Bone} />
          </group>
          <group
            name="HandR"
            position={[-0.003, 2.37, -0.021]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="HandR_1"
              geometry={nodes.HandR_1.geometry}
              material={materials.Main}
              skeleton={nodes.HandR_1.skeleton}
            />
            <skinnedMesh
              name="HandR_2"
              geometry={nodes.HandR_2.geometry}
              material={materials.Grey}
              skeleton={nodes.HandR_2.skeleton}
            />
          </group>
          <group
            name="HandL"
            position={[-0.003, 2.37, -0.021]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="HandL_1"
              geometry={nodes.HandL_1.geometry}
              material={materials.Main}
              skeleton={nodes.HandL_1.skeleton}
            />
            <skinnedMesh
              name="HandL_2"
              geometry={nodes.HandL_2.geometry}
              material={materials.Grey}
              skeleton={nodes.HandL_2.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/RobotExpressive.glb");
