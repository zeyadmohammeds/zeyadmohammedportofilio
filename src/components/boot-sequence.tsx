import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export function BootSequence() {
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if we've already booted in this session
    const hasBooted = sessionStorage.getItem("zeyados_booted");
    if (hasBooted) {
      setBooting(false);
      return;
    }

    const duration = 2200; // 2.2 seconds boot
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      // Easing out the progress bar
      const newProgress = 100 * (1 - Math.pow(1 - currentStep / steps, 3));
      setProgress(Math.min(newProgress, 100));

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          sessionStorage.setItem("zeyados_booted", "true");
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {booting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background text-foreground"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center border-4 border-border bg-primary shadow-[8px_8px_0px_0px_var(--color-foreground)]">
              <BrainCircuit className="h-12 w-12 text-primary-foreground" />
            </div>
            
            <h1 className="font-display text-2xl font-black tracking-widest uppercase mb-12">
              Zeyad<span className="text-primary">OS</span>
            </h1>

            <div className="h-2 w-64 border-2 border-border bg-surface shadow-[4px_4px_0px_0px_var(--color-foreground)] overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Initializing System Modules... {Math.round(progress)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
