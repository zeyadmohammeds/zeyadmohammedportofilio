import { useEffect, useState, Suspense, lazy, type ReactNode } from "react";
import { useApp } from "@/lib/mode-context";

/**
 * Wraps children in a client-only guard + Suspense.
 * On the server or before hydration, renders `fallback`.
 */
function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/* ── Lazy-loaded 3D scene internals ── */
const LazyHeroScene = lazy(() =>
  import("./scenes/hero-scene").then((m) => ({ default: m.HeroScene }))
);
const LazyStickyScene = lazy(() =>
  import("./scenes/sticky-scene").then((m) => ({ default: m.StickyScene }))
);
const LazyNameScene = lazy(() =>
  import("./scenes/name-scene").then((m) => ({ default: m.NameScene }))
);

/* ── Public exports ── */

export function RobotAssistant() {
  return null;
}

export function HeroRobot() {
  return (
    <div className="relative h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px] pointer-events-none">
      <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-foreground/5" />}>
        <LazyHeroScene />
      </ClientOnly>
      <div className="absolute inset-0 pointer-events-auto cursor-pointer" />
    </div>
  );
}

export function StickyRobot() {
  return (
    <ClientOnly>
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] h-[160px] w-[160px] opacity-80 hover:opacity-100 transition-opacity">
        <LazyStickyScene />
      </div>
    </ClientOnly>
  );
}

export function ThreeDName() {
  const { theme } = useApp();

  const fallback = (
    <div className="h-full w-full flex items-center">
      <h1 className="text-[3.5rem] sm:text-[7rem] md:text-[9rem] leading-[0.85] font-black tracking-tighter text-foreground uppercase">
        Zeyad <br /> Mohammed
      </h1>
    </div>
  );

  return (
    <div className="h-full w-full">
      <ClientOnly fallback={fallback}>
        <LazyNameScene theme={theme} />
      </ClientOnly>
    </div>
  );
}
