import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Search, Home, FolderKanban, User, Terminal, Mail, Moon, Sun, Lock } from "lucide-react";
import { useApp } from "@/lib/mode-context";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme, mode, toggleMode, isAdmin } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const items = [
    { type: "route", icon: Home, label: "Go to Home", action: () => navigate({ to: "/" }) },
    {
      type: "route",
      icon: FolderKanban,
      label: "View Projects",
      action: () => navigate({ to: "/projects" }),
    },
    { type: "route", icon: User, label: "About Me", action: () => navigate({ to: "/about" }) },
    { type: "route", icon: Mail, label: "Contact", action: () => navigate({ to: "/contact" }) },
    {
      type: "route",
      icon: Terminal,
      label: "API Explorer",
      action: () => navigate({ to: "/dev" }),
    },
    {
      type: "action",
      icon: theme === "dark" ? Sun : Moon,
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`,
      action: toggleTheme,
    },
    {
      type: "action",
      icon: Terminal,
      label: `Toggle Developer Mode (currently ${mode})`,
      action: toggleMode,
    },
    {
      type: "hidden",
      icon: Lock,
      label: "Admin Console",
      action: () => navigate({ to: isAdmin ? "/admin" : "/admin/login" }),
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) &&
      (item.type !== "hidden" || query.toLowerCase() === "admin"),
  );

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-xl border-4 border-foreground bg-background shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center gap-4 border-b-4 border-foreground bg-primary px-4 py-4 text-primary-foreground">
                <Search className="h-6 w-6" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="TYPE A COMMAND OR SEARCH..."
                  className="flex-1 bg-transparent text-sm font-black uppercase tracking-widest text-primary-foreground placeholder:text-primary-foreground/50 outline-none border-none focus:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd className="hidden border-2 border-foreground bg-background px-2 py-1 font-mono text-[10px] font-bold text-foreground sm:inline-block">
                  ESC
                </kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 bg-background">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center font-mono text-sm font-bold uppercase tracking-widest text-foreground/50">
                    NO RESULTS FOUND.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item.action)}
                        className="group flex w-full items-center gap-4 border-4 border-transparent px-4 py-3 text-left font-mono text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
