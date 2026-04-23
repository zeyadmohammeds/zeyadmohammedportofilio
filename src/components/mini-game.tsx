import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, Terminal, CheckCircle2 } from "lucide-react";

export function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(
    "function calculateScore(a, b) {\n  // Bug: Should return the product\n  return a + b;\n}",
  );
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const checkCode = () => {
    if (code.includes("a * b")) {
      setSolved(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // Easter egg: hit 'b' key 3 times rapidly
  useEffect(() => {
    let strikes = 0;
    let lastHit = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in inputs
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === "b") {
        const now = Date.now();
        if (now - lastHit < 500) {
          strikes++;
        } else {
          strikes = 1;
        }
        lastHit = now;

        if (strikes >= 3) {
          setIsOpen(true);
          strikes = 0;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-surface border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all opacity-50 hover:opacity-100 group"
      >
        <Bug className="h-5 w-5 group-hover:animate-bounce" />
      </button>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: Math.random() * 2 + 1,
                  x: (Math.random() - 0.5) * window.innerWidth,
                  y: Math.random() * window.innerHeight * 1.5 - window.innerHeight,
                }}
                transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Terminal className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Find the Bug</h2>
                  <p className="text-xs text-muted-foreground">Level 1: Basic Math</p>
                </div>
              </div>

              {solved ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-success mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">Senior Developer Approved!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You successfully patched the core module.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSolved(false);
                      setCode(
                        "function calculateScore(a, b) {\n  // Bug: Should return the product\n  return a + b;\n}",
                      );
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Close Term
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    The accounting module is bleeding money. The{" "}
                    <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">
                      calculateScore
                    </code>{" "}
                    function is adding instead of multiplying. Fix the code to continue.
                  </div>

                  <div className="relative font-mono text-sm group">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-32 bg-[#0d0d0d] text-foreground border border-border p-4 rounded-md outline-none focus:border-primary/50 font-mono resize-none"
                    />
                    <div className="absolute right-2 bottom-2 max-w-full text-[10px] text-muted-foreground opacity-50 hidden group-hover:block">
                      Edit directly
                    </div>
                  </div>

                  <button
                    onClick={checkCode}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                  >
                    Run Test Suite
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
