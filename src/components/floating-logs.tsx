import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { useApp } from "@/lib/mode-context";
import { useLocation } from "@tanstack/react-router";

interface LogEntry {
  id: string;
  type: "info" | "success" | "warn" | "error";
  timestamp: Date;
  message: string;
}

export function FloatingLogs() {
  const { mode, isAdmin } = useApp();
  const location = useLocation();
  const isDocAdmin = location.pathname.startsWith("/admin");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-open in developer mode
  useEffect(() => {
    if (mode === "developer" && !isOpen) {
      setIsOpen(true);
    }
  }, [mode]);

  useEffect(() => {
    const handleLog = (e: CustomEvent<{ type: LogEntry["type"]; message: string }>) => {
      setLogs((prev) => [
        ...prev.slice(-49), // Keep last 50
        {
          id: Math.random().toString(36).substring(7),
          type: e.detail.type,
          message: e.detail.message,
          timestamp: new Date(),
        },
      ]);
    };

    window.addEventListener("api:log" as any, handleLog);
    return () => window.removeEventListener("api:log" as any, handleLog);
  }, []);

  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  if (!isOpen || !isDocAdmin) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 transition-all duration-300`}
    >
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg hover:bg-surface-2 hover:text-primary transition-colors"
          >
            <Terminal className="h-4 w-4" />
            {logs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {logs.length}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex h-[350px] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface/50 px-3 py-2 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Terminal className="h-3.5 w-3.5" />
                <span>System Logs</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLogs([])}
                  className="rounded p-1 opacity-60 hover:bg-surface-2 hover:opacity-100"
                  title="Clear logs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded p-1 opacity-60 hover:bg-surface-2 hover:opacity-100"
                  title="Minimize"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 opacity-60 hover:bg-surface-2 hover:opacity-100"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed"
            >
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground/50">
                  Waiting for network activity...
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      <span className="shrink-0 text-muted-foreground/50">
                        {log.timestamp.toLocaleTimeString(undefined, {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                      <span
                        className={`
                        ${log.type === "info" ? "text-blue-400" : ""}
                        ${log.type === "success" ? "text-success" : ""}
                        ${log.type === "warn" ? "text-warning" : ""}
                        ${log.type === "error" ? "text-destructive" : ""}
                      `}
                      >
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
